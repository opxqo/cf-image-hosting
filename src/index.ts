import { Hono } from 'hono';
import { htmlContent } from './html';

type Bindings = {
    MY_BUCKET: R2Bucket;
    AUTH_TOKEN?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 首页
app.get('/', (c) => c.html(htmlContent));

// 图片列表 API
app.get('/api/images', async (c) => {
    try {
        const list = await c.env.MY_BUCKET.list({ limit: 100 });
        const origin = new URL(c.req.url).origin;
        const images = list.objects.map((obj) => ({
            key: obj.key,
            size: obj.size,
            uploaded: obj.uploaded.toISOString(),
            url: `${origin}/${obj.key}`,
            thumb: `${origin}/thumb/${obj.key}`,
        }));
        return c.json({ success: true, images });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 缩略图 API (使用 Cloudflare Image Resizing)
app.get('/thumb/:key', async (c) => {
    const key = c.req.param('key');
    const object = await c.env.MY_BUCKET.get(key);

    if (!object) return c.text('Not Found', 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=31536000');

    // 尝试使用 Cloudflare Image Resizing
    // 如果没有开启此功能，则返回原图
    const originalUrl = new URL(c.req.url).origin + '/' + key;

    try {
        const resized = await fetch(originalUrl, {
            cf: {
                image: {
                    width: 300,
                    height: 300,
                    fit: 'cover',
                    quality: 80,
                },
            },
        });
        if (resized.ok) {
            return new Response(resized.body, { headers });
        }
    } catch {
        // Image Resizing 不可用，返回原图
    }

    return new Response(object.body, { headers });
});

// 图片上传 API
app.post('/upload', async (c) => {
    const authToken = c.env.AUTH_TOKEN;
    if (authToken) {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.endsWith(authToken)) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }
    }

    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
        return c.json({ success: false, message: 'No file uploaded' }, 400);
    }

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${crypto.randomUUID()}.${ext}`;

    try {
        await c.env.MY_BUCKET.put(filename, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type },
        });

        const url = new URL(c.req.url);
        const fileUrl = `${url.origin}/${filename}`;

        return c.json({ success: true, url: fileUrl, imgUrl: fileUrl });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 删除图片 API
app.delete('/api/images/:key', async (c) => {
    const authToken = c.env.AUTH_TOKEN;
    if (authToken) {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.endsWith(authToken)) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }
    }

    try {
        await c.env.MY_BUCKET.delete(c.req.param('key'));
        return c.json({ success: true });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 图片获取 API
app.get('/:key', async (c) => {
    const object = await c.env.MY_BUCKET.get(c.req.param('key'));
    if (!object) return c.text('Not Found', 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
});

export default app;

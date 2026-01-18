import { Hono } from 'hono';
import { htmlContent } from './html';

type Bindings = {
    MY_BUCKET: R2Bucket;
    AUTH_TOKEN?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 首页：显示上传界面
app.get('/', (c) => {
    return c.html(htmlContent);
});

// 图片列表 API
app.get('/api/images', async (c) => {
    try {
        const list = await c.env.MY_BUCKET.list({ limit: 100 });
        const images = list.objects.map((obj) => ({
            key: obj.key,
            size: obj.size,
            uploaded: obj.uploaded.toISOString(),
            url: new URL(c.req.url).origin + '/' + obj.key,
        }));
        return c.json({ success: true, images });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 图片上传 API
app.post('/upload', async (c) => {
    // 1. 鉴权
    const authToken = c.env.AUTH_TOKEN;
    if (authToken) {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.endsWith(authToken)) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }
    }

    // 2. 解析文件
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
        return c.json({ success: false, message: 'No file uploaded' }, 400);
    }

    // 3. 生成文件名 (UUID + 扩展名)
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${crypto.randomUUID()}.${ext}`;

    // 4. 写入 R2
    try {
        await c.env.MY_BUCKET.put(filename, await file.arrayBuffer(), {
            httpMetadata: {
                contentType: file.type,
            },
        });

        // 5. 生成 URL
        const url = new URL(c.req.url);
        const fileUrl = `${url.origin}/${filename}`;

        return c.json({
            success: true,
            url: fileUrl,
            imgUrl: fileUrl, // 兼容 PicGo
        });
    } catch (err) {
        return c.json({ success: false, message: 'Failed to upload to R2', error: String(err) }, 500);
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

    const key = c.req.param('key');
    try {
        await c.env.MY_BUCKET.delete(key);
        return c.json({ success: true });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 图片获取 API
app.get('/:key', async (c) => {
    const key = c.req.param('key');

    // 尝试从 R2 获取
    const object = await c.env.MY_BUCKET.get(key);

    if (!object) {
        return c.text('File Not Found', 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); // 长缓存

    return new Response(object.body, {
        headers: headers,
    });
});

export default app;

import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { htmlContent, loginPage } from './html';

type Bindings = {
    MY_BUCKET: R2Bucket;
    USERNAME: string;
    PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 简单的 session token 生成
function generateToken(): string {
    return crypto.randomUUID() + '-' + Date.now();
}

// 验证登录状态
function isLoggedIn(c: any): boolean {
    const token = getCookie(c, 'session');
    return !!token && token.length > 10;
}

// 登录页面
app.get('/login', (c) => {
    if (isLoggedIn(c)) return c.redirect('/');
    return c.html(loginPage);
});

// 登录 API
app.post('/api/login', async (c) => {
    const body = await c.req.parseBody();
    const username = body['username'];
    const password = body['password'];

    if (username === c.env.USERNAME && password === c.env.PASSWORD) {
        const token = generateToken();
        setCookie(c, 'session', token, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 24 * 7, // 7 天
        });
        return c.json({ success: true });
    }
    return c.json({ success: false, message: '用户名或密码错误' }, 401);
});

// 登出 API
app.post('/api/logout', (c) => {
    deleteCookie(c, 'session', { path: '/' });
    return c.json({ success: true });
});

// 首页 - 需要登录
app.get('/', (c) => {
    if (!isLoggedIn(c)) return c.redirect('/login');
    return c.html(htmlContent);
});

// 图片列表 API - 需要登录
app.get('/api/images', async (c) => {
    if (!isLoggedIn(c)) return c.json({ success: false, message: 'Unauthorized' }, 401);

    try {
        const list = await c.env.MY_BUCKET.list({ limit: 100 });
        const origin = new URL(c.req.url).origin;
        const images = list.objects.map((obj) => ({
            key: obj.key,
            size: obj.size,
            uploaded: obj.uploaded.toISOString(),
            url: `${origin}/i/${obj.key}`,
            thumb: `${origin}/thumb/${obj.key}`,
        }));
        return c.json({ success: true, images });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 缩略图 - 公开访问
app.get('/thumb/:key', async (c) => {
    const object = await c.env.MY_BUCKET.get(c.req.param('key'));
    if (!object) return c.text('Not Found', 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
});

// 图片上传 - 需要登录
app.post('/upload', async (c) => {
    if (!isLoggedIn(c)) return c.json({ success: false, message: 'Unauthorized' }, 401);

    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
        return c.json({ success: false, message: 'No file' }, 400);
    }

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${crypto.randomUUID()}.${ext}`;

    try {
        await c.env.MY_BUCKET.put(filename, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type },
        });

        const url = new URL(c.req.url).origin + '/i/' + filename;
        return c.json({ success: true, url, imgUrl: url });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 删除图片 - 需要登录
app.delete('/api/images/:key', async (c) => {
    if (!isLoggedIn(c)) return c.json({ success: false, message: 'Unauthorized' }, 401);

    try {
        await c.env.MY_BUCKET.delete(c.req.param('key'));
        return c.json({ success: true });
    } catch (err) {
        return c.json({ success: false, message: String(err) }, 500);
    }
});

// 图片访问 - 公开
app.get('/i/:key', async (c) => {
    const object = await c.env.MY_BUCKET.get(c.req.param('key'));
    if (!object) return c.text('Not Found', 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
});

export default app;

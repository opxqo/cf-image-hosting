import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { htmlContent, loginPage } from './html';

type Bindings = {
    MY_BUCKET: R2Bucket;
    USERNAME: string;
    PASSWORD: string;
};

type Env = { Bindings: Bindings };
const app = new Hono<Env>();

const R2_DOMAIN = 'https://images.opxqo.com';

/* ═══════════════════════════════════════════
   Auth: HMAC-SHA256 签名 Token
   ═══════════════════════════════════════════ */

const MAX_AGE = 7 * 24 * 3600; // 7 天

async function hmacKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'],
    );
}

function b64url(bytes: Uint8Array): string {
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

async function signToken(sub: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const payload = enc.encode(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
    const header = b64url(payload);
    const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(header));
    return header + '.' + b64url(new Uint8Array(sig));
}

async function checkToken(token: string | undefined, secret: string): Promise<boolean> {
    if (!token) return false;
    try {
        const [header, sig] = token.split('.');
        if (!header || !sig) return false;
        const ok = await crypto.subtle.verify(
            'HMAC', await hmacKey(secret), b64urlDecode(sig), new TextEncoder().encode(header),
        );
        if (!ok) return false;
        const { exp } = JSON.parse(new TextDecoder().decode(b64urlDecode(header)));
        return typeof exp === 'number' && exp > Date.now() / 1000;
    } catch { return false; }
}

async function requireAuth(c: any): Promise<Response | null> {
    if (await checkToken(getCookie(c, 'session'), c.env.PASSWORD)) return null;
    return c.json({ success: false, message: 'Unauthorized' }, 401);
}

/* ═══════════════════════════════════════════
   全局错误处理
   ═══════════════════════════════════════════ */

app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
});

/* ═══════════════════════════════════════════
   认证路由
   ═══════════════════════════════════════════ */

app.get('/login', async (c) => {
    if (await checkToken(getCookie(c, 'session'), c.env.PASSWORD)) return c.redirect('/');
    return c.html(loginPage);
});

app.post('/api/login', async (c) => {
    const body = await c.req.parseBody();
    if (body['username'] === c.env.USERNAME && body['password'] === c.env.PASSWORD) {
        const token = await signToken(c.env.USERNAME, c.env.PASSWORD);
        setCookie(c, 'session', token, {
            path: '/', httpOnly: true, secure: true, sameSite: 'Strict', maxAge: MAX_AGE,
        });
        return c.json({ success: true });
    }
    return c.json({ success: false, message: '用户名或密码错误' }, 401);
});

app.post('/api/logout', (c) => {
    deleteCookie(c, 'session', { path: '/' });
    return c.json({ success: true });
});

/* ═══════════════════════════════════════════
   页面路由
   ═══════════════════════════════════════════ */

app.get('/', async (c) => {
    if (!(await checkToken(getCookie(c, 'session'), c.env.PASSWORD))) return c.redirect('/login');
    return c.html(htmlContent);
});

/* ═══════════════════════════════════════════
   文件夹 API
   ═══════════════════════════════════════════ */

app.get('/api/folders', async (c) => {
    const deny = await requireAuth(c);
    if (deny) return deny;
    const list = await c.env.MY_BUCKET.list({ delimiter: '/' });
    const folders = ['默认', ...list.delimitedPrefixes.map(p => p.replace(/\/$/, ''))];
    return c.json({ success: true, folders });
});

app.delete('/api/folders/:name', async (c) => {
    const deny = await requireAuth(c);
    if (deny) return deny;
    const name = c.req.param('name');
    if (name === '默认') return c.json({ success: false, message: '无法删除默认文件夹' }, 400);

    let deleted = 0;
    let cursor: string | undefined;
    do {
        const list = await c.env.MY_BUCKET.list({ prefix: name + '/', limit: 1000, cursor });
        if (list.objects.length) {
            await c.env.MY_BUCKET.delete(list.objects.map(o => o.key));
            deleted += list.objects.length;
        }
        cursor = list.truncated ? list.cursor : undefined;
    } while (cursor);
    return c.json({ success: true, deleted });
});

/* ═══════════════════════════════════════════
   图片 API
   ═══════════════════════════════════════════ */

app.get('/api/images', async (c) => {
    const deny = await requireAuth(c);
    if (deny) return deny;

    const folder = c.req.query('folder');
    const cursorQ = c.req.query('cursor');
    const limit = Math.min(Number(c.req.query('limit') || 50), 100);
    const prefix = folder && folder !== '默认' ? folder + '/' : '';

    const opts: R2ListOptions = { limit, prefix };
    if (cursorQ) (opts as any).cursor = cursorQ;

    const list = await c.env.MY_BUCKET.list(opts);

    const images = list.objects
        .filter(o => (!folder || folder === '默认') ? !o.key.includes('/') : true)
        .map(o => ({
            key: o.key,
            name: o.key.includes('/') ? o.key.split('/').pop() : o.key,
            size: o.size,
            uploaded: o.uploaded.toISOString(),
            url: R2_DOMAIN + '/' + o.key,
            thumb: R2_DOMAIN + '/' + o.key,
        }));

    return c.json({
        success: true, images,
        cursor: list.truncated ? list.cursor : null,
        hasMore: !!list.truncated,
    });
});

app.post('/upload', async (c) => {
    const deny = await requireAuth(c);
    if (deny) return deny;

    const body = await c.req.parseBody();
    const file = body['file'];
    const folder = body['folder'] as string;
    if (!file || !(file instanceof File)) return c.json({ success: false, message: 'No file' }, 400);

    const ext = file.name.split('.').pop() || 'png';
    let key = crypto.randomUUID() + '.' + ext;
    if (folder && folder !== '默认') key = folder + '/' + key;

    await c.env.MY_BUCKET.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
    });

    const url = R2_DOMAIN + '/' + key;
    return c.json({ success: true, url, key });
});

app.delete('/api/images/:key{.+}', async (c) => {
    const deny = await requireAuth(c);
    if (deny) return deny;
    await c.env.MY_BUCKET.delete(c.req.param('key'));
    return c.json({ success: true });
});

app.post('/api/batch-delete', async (c) => {
    const deny = await requireAuth(c);
    if (deny) return deny;
    const { keys } = await c.req.json<{ keys: string[] }>();
    if (!Array.isArray(keys) || !keys.length) return c.json({ success: false, message: '请提供图片列表' }, 400);
    if (keys.length > 100) return c.json({ success: false, message: '单次最多删除100张' }, 400);
    await c.env.MY_BUCKET.delete(keys);
    return c.json({ success: true, deleted: keys.length });
});

/* ═══════════════════════════════════════════
   公开图片访问
   ═══════════════════════════════════════════ */

app.get('/i/:key{.+}', async (c) => {
    const obj = await c.env.MY_BUCKET.get(c.req.param('key'));
    if (!obj) return c.text('Not Found', 404);
    const h = new Headers();
    obj.writeHttpMetadata(h);
    h.set('etag', obj.httpEtag);
    h.set('Cache-Control', 'public, max-age=31536000');
    return new Response(obj.body, { headers: h });
});

app.get('/thumb/:key{.+}', async (c) => {
    const obj = await c.env.MY_BUCKET.get(c.req.param('key'));
    if (!obj) return c.text('Not Found', 404);
    const h = new Headers();
    obj.writeHttpMetadata(h);
    h.set('Cache-Control', 'public, max-age=31536000');
    return new Response(obj.body, { headers: h });
});

export default app;

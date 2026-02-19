/* ═══ shadcn/ui 风格主题 — Zinc 色系 ═══ */
const themeCSS = `
:root {
    --bg: #09090b; --fg: #fafafa;
    --card: #09090b; --card-fg: #fafafa;
    --muted: #27272a; --muted-fg: #a1a1aa;
    --border: #27272a; --input: #27272a;
    --primary: #fafafa; --primary-fg: #18181b;
    --secondary: #27272a; --secondary-fg: #fafafa;
    --accent: #27272a; --accent-fg: #fafafa;
    --destructive: #7f1d1d; --destructive-fg: #fafafa;
    --ring: #d4d4d8;
    --radius: 0.375rem;
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color-scheme: dark;
}
[data-theme="light"] {
    --bg: #ffffff; --fg: #09090b;
    --card: #ffffff; --card-fg: #09090b;
    --muted: #f4f4f5; --muted-fg: #71717a;
    --border: #e4e4e7; --input: #e4e4e7;
    --primary: #18181b; --primary-fg: #fafafa;
    --secondary: #f4f4f5; --secondary-fg: #18181b;
    --accent: #f4f4f5; --accent-fg: #18181b;
    --destructive: #ef4444; --destructive-fg: #fafafa;
    --ring: #18181b;
    color-scheme: light;
}
`;

/* ═══ 登录页 ═══ */
export const loginPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - 图床</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        ${themeCSS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--font); background: var(--bg); color: var(--fg);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            overflow: hidden;
        }
        #particles { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .card {
            position: relative; z-index: 1;
            background: var(--card); border: 1px solid var(--border);
            border-radius: calc(var(--radius) + 2px); padding: 32px; width: 100%; max-width: 360px;
            opacity: 0; transform: translateY(30px) scale(0.96);
            transform-style: preserve-3d; perspective: 800px;
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .anim-item { opacity: 0; transform: translateY(15px); }
        .logo { text-align: center; margin-bottom: 6px; font-size: 32px; }
        h1 { text-align: center; font-size: 18px; font-weight: 600; color: var(--fg); margin-bottom: 2px; letter-spacing: -0.025em; }
        .sub { text-align: center; font-size: 13px; color: var(--muted-fg); margin-bottom: 24px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 13px; font-weight: 500; color: var(--fg); margin-bottom: 6px; }
        .field input {
            width: 100%; padding: 8px 12px; background: transparent; color: var(--fg);
            border: 1px solid var(--input); border-radius: var(--radius);
            font-size: 13px; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field input:focus { border-color: var(--ring); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 25%, transparent); }
        .btn {
            width: 100%; padding: 8px; background: var(--primary); color: var(--primary-fg); border: none;
            border-radius: var(--radius); font-size: 13px; font-weight: 500;
            cursor: pointer; transition: opacity 0.15s, box-shadow 0.2s;
            position: relative; overflow: hidden;
        }
        .btn:hover { opacity: 0.9; box-shadow: 0 0 20px color-mix(in srgb, var(--primary) 30%, transparent); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .err { color: var(--destructive); font-size: 13px; text-align: center; margin-top: 12px; display: none; }
        .success-flash { position: fixed; inset: 0; background: radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%); z-index: 100; pointer-events: none; }
    </style>
</head>
<body>
    <canvas id="particles"></canvas>
    <div class="card" id="card">
        <div class="logo anim-item">📷</div>
        <h1 class="anim-item">图床</h1>
        <p class="sub anim-item">登录以管理您的图片</p>
        <form id="form">
            <div class="field anim-item"><label>用户名</label><input type="text" name="username" required autofocus placeholder="输入用户名"></div>
            <div class="field anim-item"><label>密码</label><input type="password" name="password" required placeholder="输入密码"></div>
            <button type="submit" class="btn anim-item" id="sbtn">登录</button>
            <div class="err" id="err"></div>
        </form>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"></script>
    <script>
        (function(){
            var t = localStorage.getItem('theme');
            if (t) document.documentElement.setAttribute('data-theme', t);
        })();

        /* ── 浮动粒子背景 ── */
        (function(){
            var c = document.getElementById('particles'), ctx = c.getContext('2d');
            var w, h, dots = [];
            var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
            function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
            resize(); window.addEventListener('resize', resize);
            for (var i = 0; i < 50; i++) dots.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*2+0.5, dx: (Math.random()-0.5)*0.4, dy: (Math.random()-0.5)*0.4, o: Math.random()*0.4+0.1 });
            function draw() {
                ctx.clearRect(0,0,w,h);
                var clr = isDark ? '255,255,255' : '0,0,0';
                dots.forEach(function(d) {
                    d.x += d.dx; d.y += d.dy;
                    if (d.x < 0 || d.x > w) d.dx *= -1;
                    if (d.y < 0 || d.y > h) d.dy *= -1;
                    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
                    ctx.fillStyle = 'rgba('+clr+','+d.o+')'; ctx.fill();
                });
                // 连线
                for (var i = 0; i < dots.length; i++) for (var j = i+1; j < dots.length; j++) {
                    var dx = dots[i].x-dots[j].x, dy = dots[i].y-dots[j].y, dist = Math.sqrt(dx*dx+dy*dy);
                    if (dist < 120) { ctx.beginPath(); ctx.moveTo(dots[i].x,dots[i].y); ctx.lineTo(dots[j].x,dots[j].y); ctx.strokeStyle='rgba('+clr+','+(0.08*(1-dist/120))+')'; ctx.stroke(); }
                }
                requestAnimationFrame(draw);
            }
            draw();
        })();

        /* ── 3D 视差卡片 ── */
        var card = document.getElementById('card');
        document.addEventListener('mousemove', function(e) {
            var cx = window.innerWidth/2, cy = window.innerHeight/2;
            var rx = (e.clientY - cy) / cy * -8;
            var ry = (e.clientX - cx) / cx * 8;
            anime({ targets: card, rotateX: rx, rotateY: ry, duration: 400, easing: 'easeOutQuad' });
        });
        document.addEventListener('mouseleave', function() {
            anime({ targets: card, rotateX: 0, rotateY: 0, duration: 600, easing: 'easeOutElastic(1, 0.5)' });
        });

        /* ── 入场动画时间线 ── */
        var tl = anime.timeline({ easing: 'easeOutCubic' });
        tl.add({ targets: '#card', opacity: [0, 1], translateY: [40, 0], scale: [0.92, 1], duration: 700 })
          .add({ targets: '.anim-item', opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(90), duration: 500 }, '-=300')
          .add({ targets: '.logo', rotate: ['-15deg', '0deg'], scale: [0.5, 1], duration: 600, easing: 'easeOutElastic(1, 0.5)' }, '-=600');

        /* ── 输入框聚焦高亮 ── */
        document.querySelectorAll('.field input').forEach(function(inp) {
            inp.addEventListener('focus', function() {
                anime({ targets: inp.parentElement, scale: [1, 1.02], duration: 200, easing: 'easeOutQuad' });
            });
            inp.addEventListener('blur', function() {
                anime({ targets: inp.parentElement, scale: [1.02, 1], duration: 200, easing: 'easeOutQuad' });
            });
        });

        document.getElementById('form').onsubmit = async function(e) {
            e.preventDefault();
            var btn = document.getElementById('sbtn');
            var err = document.getElementById('err');
            btn.disabled = true; btn.textContent = '登录中...'; err.style.display = 'none';
            // 按钮加载动画
            anime({ targets: btn, scale: [1, 0.97], duration: 150, easing: 'easeInQuad' });
            try {
                var res = await fetch('/api/login', { method: 'POST', body: new FormData(e.target) });
                var data = await res.json();
                if (data.success) {
                    // 成功闪光 + 卡片飞走
                    var flash = document.createElement('div'); flash.className = 'success-flash'; document.body.appendChild(flash);
                    anime({ targets: flash, opacity: [0,1,0], duration: 600, easing: 'easeInOutQuad' });
                    anime({ targets: '#card', scale: [1, 0.95], opacity: [1, 0], translateY: [0, -30], duration: 500, easing: 'easeInCubic', delay: 200,
                        complete: function() { location.href = '/'; } });
                } else {
                    err.textContent = data.message || '登录失败'; err.style.display = 'block';
                    anime({ targets: err, opacity: [0,1], translateY: [10,0], duration: 300, easing: 'easeOutQuad' });
                    anime({ targets: '#card', keyframes: [{translateX:-10},{translateX:10},{translateX:-6},{translateX:6},{translateX:-3},{translateX:3},{translateX:0}], duration: 500, easing: 'easeInOutQuad' });
                    anime({ targets: btn, scale: 1, duration: 200 }); btn.disabled = false; btn.textContent = '登录';
                }
            } catch(ex) {
                err.textContent = '网络错误'; err.style.display = 'block';
                anime({ targets: err, opacity: [0,1], translateY: [10,0], duration: 300, easing: 'easeOutQuad' });
                anime({ targets: '#card', keyframes: [{translateX:-10},{translateX:10},{translateX:-6},{translateX:6},{translateX:-3},{translateX:3},{translateX:0}], duration: 500, easing: 'easeInOutQuad' });
                anime({ targets: btn, scale: 1, duration: 200 }); btn.disabled = false; btn.textContent = '登录';
            }
        };
    </script>
</body>
</html>`;

/* ═══ 主页 ═══ */
export const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图床</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        ${themeCSS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font); background: var(--bg); color: var(--fg); font-size: 14px; }

        /* ── Header ── */
        .header {
            position: sticky; top: 0; z-index: 50;
            display: flex; align-items: center; justify-content: space-between;
            padding: 12px 24px; background: color-mix(in srgb, var(--bg) 85%, transparent);
            border-bottom: 1px solid var(--border);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        }
        .header h1 { font-size: 15px; font-weight: 600; letter-spacing: -0.025em; display: flex; align-items: center; gap: 6px; }
        .header-actions { display: flex; gap: 6px; align-items: center; }

        /* ── Buttons ── */
        .btn-ghost {
            display: inline-flex; align-items: center; justify-content: center;
            height: 32px; padding: 0 10px; font-size: 13px; font-weight: 500;
            background: transparent; border: none; border-radius: var(--radius);
            color: var(--muted-fg); cursor: pointer; transition: background 0.1s, color 0.1s;
        }
        .btn-ghost:hover { background: var(--accent); color: var(--accent-fg); }
        .btn-outline {
            display: inline-flex; align-items: center; justify-content: center;
            height: 32px; padding: 0 12px; font-size: 13px; font-weight: 500;
            background: transparent; border: 1px solid var(--input); border-radius: var(--radius);
            color: var(--fg); cursor: pointer; transition: background 0.1s;
        }
        .btn-outline:hover { background: var(--accent); }
        .btn-outline.sm { height: 28px; padding: 0 10px; font-size: 12px; }
        .btn-primary {
            display: inline-flex; align-items: center; justify-content: center;
            height: 32px; padding: 0 14px; font-size: 13px; font-weight: 500;
            background: var(--primary); color: var(--primary-fg); border: none;
            border-radius: var(--radius); cursor: pointer; transition: opacity 0.1s;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-destructive {
            display: inline-flex; align-items: center; justify-content: center;
            height: 28px; padding: 0 12px; font-size: 12px; font-weight: 500;
            background: var(--destructive); color: var(--destructive-fg); border: none;
            border-radius: var(--radius); cursor: pointer; transition: opacity 0.1s;
        }
        .btn-destructive:hover { opacity: 0.9; }
        .icon-btn {
            width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
            background: transparent; border: none; border-radius: var(--radius);
            color: var(--muted-fg); cursor: pointer; font-size: 15px; transition: background 0.1s, color 0.1s;
        }
        .icon-btn:hover { background: var(--accent); color: var(--accent-fg); }

        /* ── Container ── */
        .container { max-width: 960px; margin: 0 auto; padding: 24px 20px 80px; }

        /* ── Upload Section ── */
        .upload-card {
            border: 1px solid var(--border); border-radius: calc(var(--radius) + 2px);
            padding: 16px; margin-bottom: 24px;
        }
        .upload-top { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
        .folder-select {
            flex: 1; height: 32px; padding: 0 10px; background: transparent; color: var(--fg);
            border: 1px solid var(--input); border-radius: var(--radius);
            font-size: 13px; outline: none; cursor: pointer;
        }
        .folder-select:focus { border-color: var(--ring); box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 20%, transparent); }

        .dropzone {
            border: 1px dashed var(--border); border-radius: var(--radius);
            padding: 32px; text-align: center; cursor: pointer;
            transition: border-color 0.15s, background 0.15s;
            position: relative; overflow: hidden;
        }
        .dropzone::after {
            content: ''; position: absolute; inset: -2px;
            border-radius: inherit;
            background: conic-gradient(from var(--glow-angle, 0deg), transparent 60%, color-mix(in srgb, var(--fg) 8%, transparent) 80%, transparent 100%);
            opacity: 0; transition: opacity 0.3s; z-index: -1;
            animation: dropzone-glow 4s linear infinite;
        }
        @keyframes dropzone-glow { to { --glow-angle: 360deg; } }
        @property --glow-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        .dropzone:hover::after, .dropzone.active::after { opacity: 1; }
        .dropzone:hover, .dropzone.active { border-color: var(--muted-fg); background: var(--muted); }
        .dropzone svg { width: 32px; height: 32px; color: var(--muted-fg); margin-bottom: 6px; transition: transform 0.3s; }
        .dropzone:hover svg { transform: translateY(-3px); }
        .dropzone p { color: var(--muted-fg); font-size: 13px; }
        .dropzone .hint { color: var(--muted-fg); font-size: 12px; margin-top: 2px; opacity: 0.7; }

        /* ── Progress ── */
        .progress-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
        .progress-item {
            display: flex; align-items: center; gap: 10px; padding: 6px 10px;
            background: var(--muted); border-radius: var(--radius); font-size: 12px; color: var(--muted-fg);
        }
        .progress-item .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .progress-bar { width: 100px; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--fg); border-radius: 2px; transition: width 0.15s; }
        .progress-item.done .progress-fill { background: #22c55e; }
        .progress-item .pct { width: 32px; text-align: right; font-variant-numeric: tabular-nums; }

        /* ── Gallery Header ── */
        .gallery-header {
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 12px; gap: 10px; flex-wrap: wrap;
        }
        .tabs { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; }
        .tab {
            height: 28px; padding: 0 12px; font-size: 12px; font-weight: 500;
            background: transparent; border: 1px solid transparent; border-radius: var(--radius);
            color: var(--muted-fg); cursor: pointer; transition: all 0.1s;
            display: inline-flex; align-items: center; gap: 4px;
        }
        .tab:hover { background: var(--muted); color: var(--fg); }
        .tab.active { background: var(--muted); color: var(--fg); border-color: var(--border); }
        .tab .del-folder {
            display: none; font-size: 13px; line-height: 1; opacity: 0.5; margin-left: 2px;
        }
        .tab:hover .del-folder { display: inline; }
        .tab:hover .del-folder:hover { opacity: 1; }
        .gallery-actions { display: flex; gap: 4px; }

        /* ── Batch Bar ── */
        .batch-bar {
            position: fixed; bottom: -56px; left: 50%; transform: translateX(-50%);
            display: flex; align-items: center; gap: 10px;
            padding: 10px 20px; background: var(--card); border: 1px solid var(--border);
            border-radius: calc(var(--radius) + 2px); z-index: 60;
            transition: bottom 0.2s ease;
        }
        .batch-bar.show { bottom: 20px; }
        .batch-bar span { font-size: 13px; color: var(--muted-fg); }

        /* ── Grid ── */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 8px;
        }
        .grid-item {
            position: relative; aspect-ratio: 1; background: var(--muted);
            border: 1px solid var(--border); border-radius: var(--radius);
            overflow: hidden; cursor: pointer;
            transition: border-color 0.25s, transform 0.3s ease, box-shadow 0.3s ease;
            transform-style: preserve-3d; will-change: transform;
        }
        .grid-item:hover { border-color: var(--muted-fg); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .grid-item.selected { border-color: var(--ring); box-shadow: 0 0 0 1px var(--ring); }
        .grid-item::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(90deg, var(--muted) 25%, var(--border) 50%, var(--muted) 75%);
            background-size: 200% 100%; animation: shimmer 1.5s infinite;
        }
        .grid-item.loaded::before { display: none; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .grid-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s, transform 0.4s ease; }
        .grid-item.loaded img { opacity: 1; }
        .grid-item:hover img { transform: scale(1.05); }

        .grid-item .check {
            position: absolute; top: 6px; left: 6px; width: 20px; height: 20px;
            border: 1.5px solid rgba(255,255,255,0.6); border-radius: 4px;
            background: rgba(0,0,0,0.3); display: none; align-items: center; justify-content: center;
            font-size: 11px; color: #fff; z-index: 5;
        }
        .select-mode .grid-item .check { display: flex; }
        .grid-item.selected .check { background: var(--fg); border-color: var(--fg); color: var(--bg); }

        .grid-item .overlay {
            position: absolute; bottom: 0; left: 0; right: 0;
            padding: 24px 6px 6px; display: flex; flex-direction: column; gap: 4px;
            background: linear-gradient(transparent, rgba(0,0,0,0.65));
            opacity: 0; transition: opacity 0.15s;
        }
        .grid-item:hover .overlay { opacity: 1; }
        .overlay .info { font-size: 10px; color: rgba(255,255,255,0.7); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .overlay .btns { display: flex; gap: 3px; }
        .overlay .btns button {
            flex: 1; padding: 4px 0; font-size: 10px; font-weight: 500; border: none;
            border-radius: 3px; cursor: pointer; transition: opacity 0.1s;
            background: rgba(255,255,255,0.15); color: #fff;
        }
        .overlay .btns button:hover { background: rgba(255,255,255,0.3); }
        .overlay .btns .btn-rm { background: rgba(239,68,68,0.6); }
        .overlay .btns .btn-rm:hover { background: rgba(239,68,68,0.8); }

        /* ── Empty & Loading ── */
        .empty { text-align: center; padding: 60px 20px; color: var(--muted-fg); font-size: 13px; }
        .empty svg { width: 40px; height: 40px; color: var(--muted-fg); margin-bottom: 10px; opacity: 0.5; }
        .load-more {
            display: block; margin: 20px auto 0; height: 32px; padding: 0 24px;
            background: transparent; border: 1px solid var(--input); border-radius: var(--radius);
            color: var(--fg); font-size: 13px; cursor: pointer; transition: background 0.1s;
        }
        .load-more:hover { background: var(--accent); }

        /* ── Modal ── */
        .modal {
            position: fixed; inset: 0; z-index: 200;
            background: rgba(0,0,0,0.8);
            display: none; align-items: center; justify-content: center;
        }
        .modal.show { display: flex; }
        .modal img { max-width: 90%; max-height: 85vh; border-radius: var(--radius); object-fit: contain; }
        .modal-top {
            position: absolute; top: 0; left: 0; right: 0; padding: 14px 16px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .modal-top .info { color: rgba(255,255,255,0.6); font-size: 12px; }
        .modal-close {
            width: 32px; height: 32px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
            border: none; border-radius: var(--radius); font-size: 18px; cursor: pointer; transition: background 0.1s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.2); }
        .nav-btn {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 36px; height: 36px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);
            border: none; border-radius: var(--radius); font-size: 22px; cursor: pointer; transition: background 0.1s;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .nav-prev { left: 12px; }
        .nav-next { right: 12px; }

        /* ── Toast ── */
        .toast {
            position: fixed; bottom: 20px; right: 20px; z-index: 300;
            padding: 10px 16px; background: var(--fg); color: var(--bg);
            border-radius: var(--radius); font-size: 13px;
            transform: translateY(60px); opacity: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        /* ── Confetti ── */
        .confetti-container { position: fixed; inset: 0; pointer-events: none; z-index: 400; overflow: hidden; }
        .confetti-piece {
            position: absolute; width: 8px; height: 8px; border-radius: 2px;
            top: -10px; opacity: 0;
        }

        /* ── Touch devices: always show overlay ── */
        @media (hover: none) {
            .grid-item .overlay { opacity: 1; }
            .grid-item .overlay .btns button { padding: 8px 0; font-size: 11px; min-height: 32px; }
            .tab .del-folder { display: inline; }
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
            body { padding-bottom: env(safe-area-inset-bottom, 0); }
            .header { padding: 10px 14px; padding-top: calc(10px + env(safe-area-inset-top, 0)); }
            .container { padding: 14px 12px calc(80px + env(safe-area-inset-bottom, 0)); }

            /* Upload */
            .upload-card { padding: 12px; margin-bottom: 16px; }
            .upload-top { gap: 6px; }
            .folder-select { height: 36px; font-size: 14px; }
            .btn-outline.sm { height: 36px; padding: 0 12px; font-size: 13px; }
            .dropzone { padding: 24px 16px; }
            .dropzone svg { width: 28px; height: 28px; }
            .dropzone p { font-size: 14px; }
            .progress-bar { width: 80px; }

            /* Tabs: horizontal scroll */
            .gallery-header { flex-direction: column; align-items: stretch; gap: 8px; }
            .tabs {
                flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch;
                scrollbar-width: none; padding-bottom: 2px;
            }
            .tabs::-webkit-scrollbar { display: none; }
            .tab { flex-shrink: 0; height: 32px; padding: 0 14px; font-size: 13px; }
            .gallery-actions { justify-content: flex-end; }
            .gallery-actions .btn-outline.sm { height: 32px; padding: 0 12px; font-size: 13px; }

            /* Grid: 3 columns on phones */
            .grid { grid-template-columns: repeat(3, 1fr); gap: 4px; }
            .grid-item { border-radius: calc(var(--radius) - 1px); }
            .grid-item .overlay { padding: 16px 4px 4px; gap: 2px; }
            .overlay .info { font-size: 9px; }
            .overlay .btns { gap: 2px; }
            .overlay .btns button { padding: 6px 0; font-size: 9px; border-radius: 2px; min-height: 28px; }
            .grid-item .check { width: 24px; height: 24px; font-size: 13px; top: 4px; left: 4px; }

            /* Batch bar: full width */
            .batch-bar {
                left: 12px; right: 12px; transform: none;
                border-radius: var(--radius); padding: 10px 14px;
                bottom: calc(-60px - env(safe-area-inset-bottom, 0));
            }
            .batch-bar.show { bottom: calc(12px + env(safe-area-inset-bottom, 0)); }

            /* Modal */
            .modal img { max-width: 100%; max-height: 80vh; border-radius: 0; }
            .modal-top { padding: 12px 14px; padding-top: calc(12px + env(safe-area-inset-top, 0)); }
            .modal-close { width: 40px; height: 40px; font-size: 20px; }
            .nav-btn { width: 40px; height: 40px; font-size: 24px; }
            .nav-prev { left: 6px; }
            .nav-next { right: 6px; }

            /* Toast: centered */
            .toast {
                right: auto; left: 50%; transform: translateX(-50%) translateY(60px);
                white-space: nowrap; max-width: 90vw;
                bottom: calc(16px + env(safe-area-inset-bottom, 0));
            }

            /* Load more */
            .load-more { width: 100%; height: 40px; font-size: 14px; }
        }

        /* ── Small phones ── */
        @media (max-width: 380px) {
            .grid { grid-template-columns: repeat(2, 1fr); }
            .header h1 { font-size: 14px; }
            .overlay .btns button { font-size: 8px; }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>📷 图床</h1>
        <div class="header-actions">
            <button class="icon-btn" id="theme-btn" title="切换主题">🌙</button>
            <button class="btn-ghost" id="logout-btn" style="color:var(--muted-fg)">退出</button>
        </div>
    </header>

    <div class="container">
        <div class="upload-card">
            <div class="upload-top">
                <select class="folder-select" id="up-folder"><option value="默认">默认</option></select>
                <button class="btn-outline sm" id="new-folder-btn">+ 新建</button>
            </div>
            <div class="dropzone" id="dropzone">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16V4m0 0L8 8m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"/></svg>
                <p>点击上传、拖拽或粘贴图片</p>
                <p class="hint">支持多文件并发上传</p>
                <input type="file" id="file-input" accept="image/*" multiple hidden>
            </div>
            <div class="progress-list" id="progress-list"></div>
        </div>

        <div class="gallery-header">
            <div class="tabs" id="tabs"></div>
            <div class="gallery-actions">
                <button class="btn-outline sm" id="select-btn">选择</button>
                <button class="btn-outline sm" id="refresh-btn">刷新</button>
            </div>
        </div>
        <div id="gallery"></div>
        <div id="more-wrap" style="display:none"><button class="load-more" id="more-btn">加载更多</button></div>
    </div>

    <div class="batch-bar" id="batch-bar">
        <span id="sel-count">0 张已选</span>
        <button class="btn-destructive" id="batch-del-btn">删除选中</button>
        <button class="btn-outline sm" id="cancel-sel-btn">取消</button>
    </div>

    <div class="modal" id="modal">
        <div class="modal-top">
            <span class="info" id="modal-info"></span>
            <button class="modal-close" id="modal-close">✕</button>
        </div>
        <button class="nav-btn nav-prev" id="prev-btn">‹</button>
        <img id="preview" src="">
        <button class="nav-btn nav-next" id="next-btn">›</button>
    </div>

    <div class="toast" id="toast"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js"></script>
    <script>
    (function() {
        var D = function(id) { return document.getElementById(id); };
        var isMobile = window.innerWidth <= 640;
        var toastTimer, toastAnim;
        function showToast(msg) {
            var t = D('toast');
            t.textContent = msg;
            if (toastAnim) toastAnim.pause();
            clearTimeout(toastTimer);
            toastAnim = anime({
                targets: t,
                translateY: isMobile ? undefined : [60, 0],
                translateX: isMobile ? ['-50%', '-50%'] : undefined,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutElastic(1, 0.6)',
            });
            if (isMobile) { anime.set(t, { translateX: '-50%', translateY: 0 }); }
            toastTimer = setTimeout(function() {
                anime({ targets: t, opacity: 0, translateY: isMobile ? 0 : 20, duration: 250, easing: 'easeInQuad' });
            }, 2200);
        }
        function fmtSize(b) {
            if (b < 1024) return b + ' B';
            if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
            return (b / 1048576).toFixed(1) + ' MB';
        }
        function fmtDate(iso) {
            var d = new Date(iso);
            return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        }
        function authFetch(url, opts) {
            return fetch(url, opts).then(function(r) {
                if (r.status === 401) { location.href = '/login'; throw new Error('Unauthorized'); }
                return r;
            });
        }

        var currentFolder = '默认';
        var serverFolders = ['默认'];
        var localFolders = new Set();
        var allImages = [];
        var pageCursor = null;
        var hasMore = false;
        var selectMode = false;
        var selectedKeys = new Set();
        var previewIdx = -1;

        /* ── Theme ── */
        var theme = localStorage.getItem('theme') || 'dark';
        function applyTheme() {
            if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
            else document.documentElement.removeAttribute('data-theme');
            D('theme-btn').textContent = theme === 'dark' ? '🌙' : '☀️';
            localStorage.setItem('theme', theme);
        }
        applyTheme();
        D('theme-btn').onclick = function() {
            theme = theme === 'dark' ? 'light' : 'dark'; applyTheme();
            anime({ targets: '#theme-btn', rotate: '+=360', scale: [0.5, 1], duration: 500, easing: 'easeOutElastic(1, 0.5)' });
        };

        D('logout-btn').onclick = async function() {
            await fetch('/api/logout', { method: 'POST' });
            location.href = '/login';
        };

        /* ── Folders ── */
        function updateFolderUI() {
            var all = Array.from(new Set(serverFolders.concat(Array.from(localFolders))));
            var sel = D('up-folder');
            sel.innerHTML = all.map(function(f) { return '<option value="' + f + '">' + f + '</option>'; }).join('');
            var tabs = D('tabs');
            tabs.innerHTML = all.map(function(f) {
                var act = f === currentFolder ? ' active' : '';
                var del = f !== '默认' ? '<span class="del-folder" data-del="' + f + '">✕</span>' : '';
                return '<button class="tab' + act + '" data-folder="' + f + '">' + f + del + '</button>';
            }).join('');
            tabs.querySelectorAll('.tab').forEach(function(btn) {
                btn.onclick = function(e) {
                    if (e.target.classList.contains('del-folder')) {
                        e.stopPropagation();
                        var name = e.target.getAttribute('data-del');
                        if (!confirm('删除文件夹 "' + name + '" 及其所有图片？')) return;
                        deleteFolder(name); return;
                    }
                    currentFolder = btn.getAttribute('data-folder');
                    exitSelectMode(); allImages = []; pageCursor = null;
                    updateFolderUI(); loadGallery(false);
                };
            });
        }

        async function loadFolders() {
            try {
                var res = await authFetch('/api/folders');
                var data = await res.json();
                if (data.folders) {
                    serverFolders = data.folders;
                    serverFolders.forEach(function(f) { localFolders.delete(f); });
                    updateFolderUI();
                }
            } catch(e) {}
        }

        async function deleteFolder(name) {
            try {
                await authFetch('/api/folders/' + encodeURIComponent(name), { method: 'DELETE' });
                showToast('文件夹已删除'); localFolders.delete(name);
                if (currentFolder === name) { currentFolder = '默认'; allImages = []; pageCursor = null; }
                loadFolders(); loadGallery(false);
            } catch(e) { showToast('删除失败'); }
        }

        D('new-folder-btn').onclick = function() {
            var name = prompt('请输入文件夹名称：');
            if (name && name.trim()) {
                localFolders.add(name.trim()); updateFolderUI();
                D('up-folder').value = name.trim(); showToast('文件夹已创建，上传后生效');
            }
        };

        /* ── Upload ── */
        var dropzone = D('dropzone'), fileInput = D('file-input');
        dropzone.onclick = function() { fileInput.click(); };
        dropzone.ondragover = function(e) {
            e.preventDefault(); dropzone.classList.add('active');
            anime({ targets: dropzone.querySelector('svg'), translateY: -5, duration: 300, easing: 'easeOutQuad' });
        };
        dropzone.ondragleave = function() {
            dropzone.classList.remove('active');
            anime({ targets: dropzone.querySelector('svg'), translateY: 0, duration: 300, easing: 'easeOutQuad' });
        };
        dropzone.ondrop = function(e) {
            e.preventDefault(); dropzone.classList.remove('active');
            anime({ targets: dropzone, scale: [0.97, 1], duration: 300, easing: 'easeOutElastic(1, 0.5)' });
            handleFiles(e.dataTransfer.files);
        };
        fileInput.onchange = function(e) { handleFiles(e.target.files); fileInput.value = ''; };
        document.onpaste = function(e) {
            for (var i = 0; i < e.clipboardData.items.length; i++) {
                var item = e.clipboardData.items[i];
                if (item.type.indexOf('image/') === 0) { handleFiles([item.getAsFile()]); break; }
            }
        };

        /* ── Confetti ── */
        function fireConfetti() {
            var container = document.createElement('div'); container.className = 'confetti-container'; document.body.appendChild(container);
            var colors = ['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#f368e0'];
            for (var i = 0; i < 40; i++) {
                var piece = document.createElement('div'); piece.className = 'confetti-piece';
                piece.style.left = (Math.random() * 100) + '%';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = (Math.random() * 8 + 4) + 'px';
                piece.style.height = (Math.random() * 8 + 4) + 'px';
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                container.appendChild(piece);
            }
            anime({
                targets: container.querySelectorAll('.confetti-piece'),
                translateY: function() { return [anime.random(-200, -50), anime.random(400, 800)]; },
                translateX: function() { return anime.random(-200, 200); },
                rotate: function() { return anime.random(0, 720); },
                opacity: [1, 0],
                duration: function() { return anime.random(1200, 2000); },
                delay: anime.stagger(20),
                easing: 'easeOutQuad',
                complete: function() { container.remove(); }
            });
        }

        function handleFiles(files) {
            var folder = D('up-folder').value;
            var tasks = Array.from(files).map(function(f) { return uploadFile(f, folder); });
            Promise.allSettled(tasks).then(function(results) {
                var ok = results.filter(function(r) { return r.status === 'fulfilled' && r.value && r.value.success; });
                if (ok.length > 0) {
                    var last = ok[ok.length - 1].value;
                    navigator.clipboard.writeText(last.url).catch(function(){});
                    showToast(ok.length + ' 张已上传，链接已复制');
                    fireConfetti();
                    currentFolder = folder; allImages = []; pageCursor = null;
                    loadFolders(); loadGallery(false);
                }
            });
        }

        function uploadFile(file, folder) {
            return new Promise(function(resolve, reject) {
                var pList = D('progress-list');
                var item = document.createElement('div');
                item.className = 'progress-item';
                item.innerHTML = '<span class="name">' + file.name + '</span><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div><span class="pct">0%</span>';
                pList.appendChild(item);
                // 进度项入场动画
                anime({ targets: item, opacity: [0, 1], translateX: [-20, 0], duration: 300, easing: 'easeOutCubic' });
                var fill = item.querySelector('.progress-fill');
                var pct = item.querySelector('.pct');
                var fd = new FormData();
                fd.append('file', file); fd.append('folder', folder);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload');
                xhr.upload.onprogress = function(e) {
                    if (e.lengthComputable) { var p = Math.round(e.loaded / e.total * 100); fill.style.width = p + '%'; pct.textContent = p + '%'; }
                };
                xhr.onload = function() {
                    if (xhr.status === 401) { location.href = '/login'; return; }
                    item.classList.add('done'); fill.style.width = '100%'; pct.textContent = '✓';
                    anime({ targets: item, backgroundColor: 'rgba(34,197,94,0.15)', duration: 400, easing: 'easeOutQuad' });
                    setTimeout(function() {
                        anime({ targets: item, opacity: 0, translateX: 20, height: 0, marginBottom: 0, padding: 0, duration: 300, easing: 'easeInQuad', complete: function() { item.remove(); } });
                    }, 1500);
                    try { resolve(JSON.parse(xhr.responseText)); } catch(e) { reject(e); }
                };
                xhr.onerror = function() {
                    pct.textContent = '✗';
                    anime({ targets: item, backgroundColor: 'rgba(239,68,68,0.15)', duration: 400, easing: 'easeOutQuad' });
                    reject(new Error('fail'));
                };
                xhr.send(fd);
            });
        }

        /* ── Gallery ── */
        function animateNewItems(grid, startIndex) {
            var items = Array.from(grid.children).slice(startIndex);
            if (!items.length) return;
            anime.set(items, { opacity: 0, scale: 0.85, translateY: 20 });
            anime({
                targets: items,
                opacity: [0, 1],
                scale: [0.85, 1],
                translateY: [20, 0],
                delay: anime.stagger(40, { start: 100 }),
                duration: 450,
                easing: 'easeOutCubic',
            });
        }

        async function loadGallery(append) {
            var gallery = D('gallery');
            if (!append) { gallery.innerHTML = '<div class="empty">加载中...</div>'; allImages = []; }
            try {
                var url = '/api/images?folder=' + encodeURIComponent(currentFolder) + '&limit=50';
                if (append && pageCursor) url += '&cursor=' + encodeURIComponent(pageCursor);
                var res = await authFetch(url);
                var data = await res.json();
                pageCursor = data.cursor; hasMore = data.hasMore;
                D('more-wrap').style.display = hasMore ? '' : 'none';
                if (!append) gallery.innerHTML = '';
                if (data.images && data.images.length) {
                    var grid = gallery.querySelector('.grid');
                    if (!grid) { grid = document.createElement('div'); grid.className = 'grid'; gallery.appendChild(grid); }
                    var prevCount = grid.children.length;
                    allImages = allImages.concat(data.images);
                    data.images.forEach(function(img, i) { renderItem(grid, img, allImages.length - data.images.length + i); });
                    animateNewItems(grid, prevCount);
                } else if (!append) {
                    gallery.innerHTML = '<div class="empty"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><p>暂无图片</p></div>';
                }
            } catch(e) { if (!append) gallery.innerHTML = '<div class="empty">加载失败</div>'; }
        }

        function renderItem(grid, img, idx) {
            var el = document.createElement('div');
            el.className = 'grid-item'; el.setAttribute('data-key', img.key);
            if (selectedKeys.has(img.key)) el.classList.add('selected');
            el.innerHTML = '<div class="check">✓</div><img><div class="overlay"><div class="info">' + (img.name || '') + ' · ' + fmtSize(img.size) + '</div><div class="btns"><button class="btn-url" title="复制URL">URL</button><button class="btn-md" title="复制Markdown">MD</button><button class="btn-html" title="复制HTML">HTML</button><button class="btn-rm" title="删除">🗑</button></div></div>';
            var imgEl = el.querySelector('img');
            var observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    var image = new Image();
                    image.onload = function() { imgEl.src = img.thumb; el.classList.add('loaded'); };
                    image.onerror = function() { imgEl.src = img.url; el.classList.add('loaded'); };
                    image.src = img.thumb; observer.disconnect();
                }
            }, { rootMargin: '200px' });
            observer.observe(el);
            el.onclick = function(e) {
                if (e.target.closest('.btns')) return;
                if (selectMode) { toggleSelect(img.key, el); return; }
                openPreview(idx);
            };
            el.querySelector('.btn-url').onclick = function(e) { e.stopPropagation(); copyText(img.url, 'URL 已复制'); };
            el.querySelector('.btn-md').onclick = function(e) { e.stopPropagation(); copyText('![](' + img.url + ')', 'Markdown 已复制'); };
            el.querySelector('.btn-html').onclick = function(e) { e.stopPropagation(); copyText('<img src="' + img.url + '">', 'HTML 已复制'); };
            el.querySelector('.btn-rm').onclick = function(e) {
                e.stopPropagation();
                if (!confirm('确定删除？')) return;
                authFetch('/api/images/' + encodeURIComponent(img.key), { method: 'DELETE' }).then(function() {
                    showToast('已删除');
                    anime({ targets: el, opacity: 0, scale: 0.8, rotateY: 15, duration: 350, easing: 'easeInCubic',
                        complete: function() { el.remove(); } });
                    allImages = allImages.filter(function(x) { return x.key !== img.key; });
                });
            };
            /* 3D 倾斜 hover */
            if (!isMobile) {
                el.onmousemove = function(e) {
                    var rect = el.getBoundingClientRect();
                    var x = (e.clientX - rect.left) / rect.width - 0.5;
                    var y = (e.clientY - rect.top) / rect.height - 0.5;
                    el.style.transform = 'perspective(600px) rotateY(' + (x*12) + 'deg) rotateX(' + (-y*12) + 'deg) scale(1.03)';
                };
                el.onmouseleave = function() {
                    anime({ targets: el, rotateY: 0, rotateX: 0, scale: 1, duration: 400, easing: 'easeOutQuad',
                        update: function(anim) { el.style.transform = 'perspective(600px) rotateY('+el.style.getPropertyValue('rotateY')+') rotateX(0) scale(1)'; }
                    });
                    el.style.transform = '';
                };
            }
            grid.appendChild(el);
        }

        function copyText(text, msg) {
            navigator.clipboard.writeText(text).then(function() { showToast(msg); }).catch(function() { showToast('复制失败'); });
        }

        /* ── Select Mode ── */
        D('select-btn').onclick = function() {
            if (selectMode) { exitSelectMode(); }
            else { selectMode = true; document.body.classList.add('select-mode'); D('select-btn').textContent = '取消选择'; }
        };
        D('cancel-sel-btn').onclick = function() { exitSelectMode(); };

        function exitSelectMode() {
            selectMode = false; selectedKeys.clear();
            document.body.classList.remove('select-mode');
            D('select-btn').textContent = '选择';
            var bar = D('batch-bar');
            anime({ targets: bar, bottom: isMobile ? -60 : -56, duration: 250, easing: 'easeInQuad',
                complete: function() { bar.classList.remove('show'); } });
            document.querySelectorAll('.grid-item.selected').forEach(function(el) { el.classList.remove('selected'); });
        }

        function toggleSelect(key, el) {
            if (selectedKeys.has(key)) { selectedKeys.delete(key); el.classList.remove('selected'); }
            else { selectedKeys.add(key); el.classList.add('selected'); }
            var n = selectedKeys.size;
            D('sel-count').textContent = n + ' 张已选';
            var bar = D('batch-bar');
            if (n > 0 && !bar.classList.contains('show')) {
                bar.classList.add('show');
                anime({ targets: bar, bottom: isMobile ? 12 : 20, duration: 400, easing: 'easeOutElastic(1, 0.7)' });
            } else if (n === 0) {
                anime({ targets: bar, bottom: isMobile ? -60 : -56, duration: 250, easing: 'easeInQuad',
                    complete: function() { bar.classList.remove('show'); } });
            }
        }

        D('batch-del-btn').onclick = async function() {
            var keys = Array.from(selectedKeys);
            if (!keys.length || !confirm('确定删除 ' + keys.length + ' 张图片？')) return;
            try {
                await authFetch('/api/batch-delete', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keys: keys }),
                });
                showToast(keys.length + ' 张已删除');
                exitSelectMode(); allImages = []; pageCursor = null; loadGallery(false);
            } catch(e) { showToast('删除失败'); }
        };

        /* ── Preview ── */
        function openPreview(idx) {
            if (idx < 0 || idx >= allImages.length) return;
            previewIdx = idx; var img = allImages[idx];
            D('preview').src = img.url;
            D('modal-info').textContent = (img.name || '') + ' · ' + fmtSize(img.size) + ' · ' + fmtDate(img.uploaded);
            D('modal').classList.add('show'); document.body.style.overflow = 'hidden';
            anime.set('#preview', { scale: 0.85, opacity: 0 });
            anime({ targets: '#preview', scale: [0.85, 1], opacity: [0, 1], duration: 350, easing: 'easeOutCubic' });
            anime({ targets: '#modal', opacity: [0, 1], duration: 250, easing: 'easeOutQuad' });
        }
        function closePreview() {
            anime({ targets: '#preview', scale: 0.9, opacity: 0, duration: 200, easing: 'easeInQuad' });
            anime({ targets: '#modal', opacity: 0, duration: 200, easing: 'easeInQuad',
                complete: function() { D('modal').classList.remove('show'); document.body.style.overflow = ''; anime.set('#modal', {opacity: 1}); previewIdx = -1; }
            });
        }
        D('modal-close').onclick = closePreview;
        D('modal').onclick = function(e) { if (e.target === D('modal')) closePreview(); };
        D('prev-btn').onclick = function() { if (previewIdx > 0) openPreview(previewIdx - 1); };
        D('next-btn').onclick = function() { if (previewIdx < allImages.length - 1) openPreview(previewIdx + 1); };

        document.onkeydown = function(e) {
            if (D('modal').classList.contains('show')) {
                if (e.key === 'Escape') closePreview();
                else if (e.key === 'ArrowLeft' && previewIdx > 0) openPreview(previewIdx - 1);
                else if (e.key === 'ArrowRight' && previewIdx < allImages.length - 1) openPreview(previewIdx + 1);
            } else if (e.key === 'Escape' && selectMode) { exitSelectMode(); }
        };

        D('more-btn').onclick = function() { loadGallery(true); };
        D('refresh-btn').onclick = function() {
            anime({ targets: '#refresh-btn', rotate: '+=360', duration: 500, easing: 'easeInOutQuad' });
            allImages = []; pageCursor = null; loadFolders(); loadGallery(false);
        };

        /* ── 页面入场时间线 ── */
        anime.set('.header', { opacity: 0, translateY: -20 });
        anime.set('.upload-card', { opacity: 0, translateY: 20, scale: 0.97 });
        anime.set('.gallery-header', { opacity: 0, translateX: -15 });
        var pageTL = anime.timeline({ easing: 'easeOutCubic' });
        pageTL
            .add({ targets: '.header', opacity: [0, 1], translateY: [-20, 0], duration: 500 })
            .add({ targets: '.upload-card', opacity: [0, 1], translateY: [20, 0], scale: [0.97, 1], duration: 500 }, '-=300')
            .add({ targets: '.gallery-header', opacity: [0, 1], translateX: [-15, 0], duration: 400 }, '-=300');

        loadFolders(); loadGallery(false);
    })();
    </script>
</body>
</html>`;

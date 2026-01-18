export const loginPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - 图床</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #fafafa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-box {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 32px;
            width: 100%;
            max-width: 360px;
        }
        .login-box h1 { font-size: 20px; font-weight: 600; margin-bottom: 24px; text-align: center; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 14px; color: #333; margin-bottom: 6px; }
        .form-group input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
        }
        .form-group input:focus { border-color: #0070f3; }
        .btn {
            width: 100%;
            padding: 12px;
            background: #0070f3;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }
        .btn:hover { background: #005bb5; }
        .btn:disabled { background: #ccc; cursor: not-allowed; }
        .error { color: #ff4d4f; font-size: 13px; margin-top: 12px; text-align: center; display: none; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>图床登录</h1>
        <form id="form">
            <div class="form-group">
                <label>用户名</label>
                <input type="text" name="username" required autofocus>
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn">登录</button>
            <div class="error" id="error"></div>
        </form>
    </div>
    <script>
        document.getElementById('form').onsubmit = async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const btn = e.target.querySelector('button');
            const error = document.getElementById('error');
            btn.disabled = true;
            btn.textContent = '登录中...';
            error.style.display = 'none';
            try {
                const res = await fetch('/api/login', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success) {
                    location.href = '/';
                } else {
                    error.textContent = data.message || '登录失败';
                    error.style.display = 'block';
                }
            } catch {
                error.textContent = '网络错误';
                error.style.display = 'block';
            }
            btn.disabled = false;
            btn.textContent = '登录';
        };
    </script>
</body>
</html>
`;

export const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图床</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #fafafa;
            color: #333;
            line-height: 1.5;
        }
        .container { max-width: 960px; margin: 0 auto; padding: 40px 20px; }
        
        header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
        header h1 { font-size: 24px; font-weight: 600; color: #111; }
        .logout-btn {
            background: none; border: 1px solid #ddd;
            padding: 6px 12px; border-radius: 4px;
            font-size: 12px; color: #666; cursor: pointer;
        }
        .logout-btn:hover { border-color: #ff4d4f; color: #ff4d4f; }

        .upload-section { 
            background: #fff; 
            border: 1px solid #e5e5e5; 
            border-radius: 8px; 
            padding: 20px; 
            margin-bottom: 24px; 
        }
        .folder-row {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        .folder-select {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
        }
        .folder-select:focus { border-color: #0070f3; }
        .new-folder-btn {
            padding: 8px 16px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
        }
        .new-folder-btn:hover { background: #eee; }

        .upload-box {
            border: 1px dashed #ddd;
            border-radius: 6px;
            padding: 32px;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.2s;
        }
        .upload-box:hover, .upload-box.active { border-color: #0070f3; background: #fafcff; }
        .upload-box svg { width: 32px; height: 32px; color: #999; margin-bottom: 8px; }
        .upload-box:hover svg { color: #0070f3; }
        .upload-box p { color: #666; font-size: 14px; }
        .upload-box .hint { color: #999; font-size: 12px; margin-top: 4px; }

        .section-header {
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 16px;
        }
        .section-title { font-size: 16px; font-weight: 600; color: #111; }
        .folder-tabs {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .folder-tab {
            padding: 4px 12px;
            background: #f5f5f5;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
        }
        .folder-tab:hover { background: #eee; }
        .folder-tab.active { background: #0070f3; color: #fff; border-color: #0070f3; }
        .refresh-btn {
            background: none; border: 1px solid #ddd;
            padding: 4px 12px; border-radius: 4px;
            font-size: 12px; color: #666; cursor: pointer;
        }
        .refresh-btn:hover { border-color: #999; }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
        }
        .grid-item {
            position: relative; aspect-ratio: 1;
            background: #f0f0f0; border-radius: 6px;
            overflow: hidden; cursor: pointer;
        }
        .grid-item::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        .grid-item.loaded::before { display: none; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .grid-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s; }
        .grid-item.loaded img { opacity: 1; }
        .grid-item .actions {
            position: absolute; bottom: 0; left: 0; right: 0;
            padding: 8px;
            background: linear-gradient(transparent, rgba(0,0,0,0.6));
            display: flex; gap: 6px;
            opacity: 0; transition: opacity 0.2s;
        }
        .grid-item:hover .actions { opacity: 1; }
        .actions button { flex: 1; padding: 6px; border: none; border-radius: 4px; font-size: 11px; cursor: pointer; }
        .btn-copy { background: #fff; color: #333; }
        .btn-del { background: #ff4d4f; color: #fff; }

        .empty { text-align: center; padding: 48px; color: #999; font-size: 14px; }
        .loading { text-align: center; padding: 32px; color: #999; }

        .toast {
            position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
            background: #333; color: #fff; padding: 12px 20px;
            border-radius: 6px; font-size: 14px; display: none; z-index: 100;
        }
        .toast.show { display: block; }

        .modal {
            position: fixed; inset: 0; background: rgba(0,0,0,0.85);
            display: none; align-items: center; justify-content: center; z-index: 200;
        }
        .modal.show { display: flex; }
        .modal img { max-width: 90%; max-height: 90%; border-radius: 4px; }
        .modal-close {
            position: absolute; top: 16px; right: 16px;
            width: 36px; height: 36px; background: #fff;
            border: none; border-radius: 50%; font-size: 20px; cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>图床</h1>
            <button class="logout-btn" id="logout">退出登录</button>
        </header>

        <div class="upload-section">
            <div class="folder-row">
                <select class="folder-select" id="upload-folder">
                    <option value="默认">默认</option>
                </select>
                <button class="new-folder-btn" id="new-folder">+ 新建文件夹</button>
            </div>
            <div class="upload-box" id="upload">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                </svg>
                <p>点击上传或拖拽图片</p>
                <p class="hint">支持粘贴截图</p>
                <input type="file" id="file" accept="image/*" multiple hidden>
            </div>
        </div>

        <div class="section-header">
            <div class="folder-tabs" id="folder-tabs"></div>
            <button class="refresh-btn" id="refresh">刷新</button>
        </div>
        <div id="gallery"></div>
    </div>

    <div class="toast" id="toast"></div>
    <div class="modal" id="modal">
        <button class="modal-close" id="close">×</button>
        <img id="preview" src="">
    </div>

    <script>
        const $ = id => document.getElementById(id);
        const upload = $('upload'), file = $('file'), gallery = $('gallery');
        const toast = $('toast'), modal = $('modal'), preview = $('preview');
        const uploadFolder = $('upload-folder');
        const folderTabs = $('folder-tabs');
        let currentFolder = '默认';

        function showToast(msg) {
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }

        $('logout').onclick = async () => {
            await fetch('/api/logout', { method: 'POST' });
            location.href = '/login';
        };

        // 新建文件夹
        $('new-folder').onclick = () => {
            const name = prompt('请输入文件夹名称：');
            if (name && name.trim()) {
                const opt = document.createElement('option');
                opt.value = name.trim();
                opt.textContent = name.trim();
                uploadFolder.appendChild(opt);
                uploadFolder.value = name.trim();
                loadFolders();
            }
        };

        // 加载文件夹列表
        async function loadFolders() {
            try {
                const res = await fetch('/api/folders');
                const data = await res.json();
                if (data.folders) {
                    uploadFolder.innerHTML = data.folders.map(f => 
                        '<option value="' + f + '">' + f + '</option>'
                    ).join('');
                    
                    folderTabs.innerHTML = data.folders.map(f => 
                        '<button class="folder-tab' + (f === currentFolder ? ' active' : '') + '" data-folder="' + f + '">' + f + '</button>'
                    ).join('');
                    
                    folderTabs.querySelectorAll('.folder-tab').forEach(btn => {
                        btn.onclick = () => {
                            currentFolder = btn.dataset.folder;
                            folderTabs.querySelectorAll('.folder-tab').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            loadGallery();
                        };
                    });
                }
            } catch {}
        }

        upload.onclick = () => file.click();
        upload.ondragover = e => { e.preventDefault(); upload.classList.add('active'); };
        upload.ondragleave = () => upload.classList.remove('active');
        upload.ondrop = e => {
            e.preventDefault();
            upload.classList.remove('active');
            handleFiles(e.dataTransfer.files);
        };
        file.onchange = e => handleFiles(e.target.files);
        document.onpaste = e => {
            for (let item of e.clipboardData.items) {
                if (item.type.startsWith('image/')) {
                    handleFiles([item.getAsFile()]);
                    break;
                }
            }
        };

        async function handleFiles(files) {
            const folder = uploadFolder.value;
            for (let f of files) {
                const fd = new FormData();
                fd.append('file', f);
                fd.append('folder', folder);
                try {
                    const res = await fetch('/upload', { method: 'POST', body: fd });
                    if (res.status === 401) { location.href = '/login'; return; }
                    const data = await res.json();
                    if (data.url) {
                        await navigator.clipboard.writeText(data.url);
                        showToast('已上传并复制链接');
                    }
                } catch { showToast('上传失败'); }
            }
            currentFolder = folder;
            loadFolders();
            loadGallery();
        }

        async function loadGallery() {
            gallery.innerHTML = '<div class="loading">加载中...</div>';
            try {
                const res = await fetch('/api/images?folder=' + encodeURIComponent(currentFolder));
                if (res.status === 401) { location.href = '/login'; return; }
                const data = await res.json();
                if (data.images && data.images.length) {
                    gallery.innerHTML = '<div class="grid"></div>';
                    const grid = gallery.querySelector('.grid');
                    data.images.forEach(img => {
                        const el = document.createElement('div');
                        el.className = 'grid-item';
                        
                        const imgEl = document.createElement('img');
                        const actionsDiv = document.createElement('div');
                        actionsDiv.className = 'actions';
                        actionsDiv.innerHTML = '<button class="btn-copy">复制</button><button class="btn-del">删除</button>';
                        
                        el.appendChild(imgEl);
                        el.appendChild(actionsDiv);
                        
                        const image = new Image();
                        image.onload = () => { imgEl.src = img.thumb; el.classList.add('loaded'); };
                        image.onerror = () => { imgEl.src = img.url; el.classList.add('loaded'); };
                        image.src = img.thumb;
                        
                        imgEl.onclick = () => { preview.src = img.url; modal.classList.add('show'); };
                        actionsDiv.querySelector('.btn-copy').onclick = async e => {
                            e.stopPropagation();
                            await navigator.clipboard.writeText(img.url);
                            showToast('已复制');
                        };
                        actionsDiv.querySelector('.btn-del').onclick = async e => {
                            e.stopPropagation();
                            if (!confirm('确定删除？')) return;
                            await fetch('/api/images/' + encodeURIComponent(img.key), { method: 'DELETE' });
                            showToast('已删除');
                            loadGallery();
                        };
                        grid.appendChild(el);
                    });
                } else {
                    gallery.innerHTML = '<div class="empty">暂无图片</div>';
                }
            } catch { gallery.innerHTML = '<div class="empty">加载失败</div>'; }
        }

        $('refresh').onclick = () => { loadFolders(); loadGallery(); };
        $('close').onclick = () => modal.classList.remove('show');
        modal.onclick = e => { if (e.target === modal) modal.classList.remove('show'); };

        loadFolders();
        loadGallery();
    </script>
</body>
</html>
`;

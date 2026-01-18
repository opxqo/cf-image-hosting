export const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloud Pixel - 云端图床</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☁️</text></svg>">
    <style>
        :root {
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --card-bg: rgba(255, 255, 255, 0.95);
            --text-main: #1e293b;
            --text-sub: #64748b;
            --border: #e2e8f0;
            --danger: #ef4444;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            min-height: 100vh;
            color: var(--text-main);
            padding: 2rem;
        }

        .app {
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 2rem;
            color: white;
        }
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        /* Upload Card */
        .upload-card {
            background: var(--card-bg);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }

        .upload-area {
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 3rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f8fafc;
        }
        .upload-area:hover, .upload-area.dragover {
            border-color: var(--primary);
            background: #f0f4ff;
            transform: translateY(-2px);
        }
        .upload-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            color: #94a3b8;
            transition: all 0.3s;
        }
        .upload-area:hover .upload-icon { color: var(--primary); transform: scale(1.1); }
        .upload-text { font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem; }
        .upload-hint { font-size: 0.85rem; color: var(--text-sub); }

        /* Result Toast */
        .toast {
            display: none;
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        }
        .toast.error { background: var(--danger); }
        @keyframes slideUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Gallery Section */
        .gallery-section {
            background: var(--card-bg);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(10px);
        }
        .gallery-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .gallery-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--text-main);
        }
        .refresh-btn {
            background: none;
            border: 1px solid var(--border);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            color: var(--text-sub);
            transition: all 0.2s;
        }
        .refresh-btn:hover { border-color: var(--primary); color: var(--primary); }

        /* Image Grid */
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
        }
        .image-item {
            position: relative;
            aspect-ratio: 1;
            border-radius: 12px;
            overflow: hidden;
            background: #f1f5f9;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .image-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .image-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }
        .image-item:hover img { transform: scale(1.05); }

        .image-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            opacity: 0;
            transition: opacity 0.2s;
            display: flex;
            align-items: flex-end;
            padding: 0.75rem;
            gap: 0.5rem;
        }
        .image-item:hover .image-overlay { opacity: 1; }

        .overlay-btn {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .copy-btn { background: white; color: var(--text-main); }
        .copy-btn:hover { background: #f1f5f9; }
        .delete-btn { background: var(--danger); color: white; }
        .delete-btn:hover { background: #dc2626; }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-sub);
        }
        .empty-state svg { width: 64px; height: 64px; margin-bottom: 1rem; opacity: 0.5; }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .modal.active { display: flex; }
        .modal img {
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
        }

        /* Loading Spinner */
        .spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #e2e8f0;
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 2rem auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
            body { padding: 1rem; }
            .header h1 { font-size: 1.8rem; }
            .upload-area { padding: 2rem 1rem; }
            .image-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        }
    </style>
</head>
<body>
    <div class="app">
        <header class="header">
            <h1>☁️ Cloud Pixel</h1>
            <p>极速、安全的云端图床</p>
        </header>

        <div class="upload-card">
            <div class="upload-area" id="drop-zone">
                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                <div class="upload-text">点击或拖拽图片到这里上传</div>
                <div class="upload-hint">支持粘贴截图 · JPG/PNG/GIF/WEBP · 最大 10MB</div>
                <input type="file" id="file-input" accept="image/*" multiple hidden>
            </div>
        </div>

        <div class="gallery-section">
            <div class="gallery-header">
                <h2 class="gallery-title">📷 图片列表</h2>
                <button class="refresh-btn" id="refresh-btn">🔄 刷新</button>
            </div>
            <div id="gallery-content">
                <div class="spinner"></div>
            </div>
        </div>
    </div>

    <div class="toast" id="toast"></div>

    <div class="modal" id="modal">
        <button class="modal-close" id="modal-close">×</button>
        <img id="modal-img" src="" alt="Preview">
    </div>

    <script>
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const galleryContent = document.getElementById('gallery-content');
        const refreshBtn = document.getElementById('refresh-btn');
        const toast = document.getElementById('toast');
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const modalClose = document.getElementById('modal-close');

        // Toast
        function showToast(message, isError = false) {
            toast.textContent = message;
            toast.className = 'toast' + (isError ? ' error' : '');
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 3000);
        }

        // Modal
        modalClose.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

        // Drag & Drop
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

        // Paste
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData.items;
            for (let item of items) {
                if (item.type.startsWith('image/')) {
                    handleFiles([item.getAsFile()]);
                    break;
                }
            }
        });

        async function handleFiles(files) {
            for (let file of files) {
                await uploadFile(file);
            }
            loadGallery();
        }

        async function uploadFile(file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/upload', { method: 'POST', body: formData });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                if (data.url) {
                    await navigator.clipboard.writeText(data.url);
                    showToast('上传成功，链接已复制！');
                }
            } catch (err) {
                showToast('上传失败: ' + err.message, true);
            }
        }

        async function loadGallery() {
            galleryContent.innerHTML = '<div class="spinner"></div>';
            try {
                const res = await fetch('/api/images');
                const data = await res.json();
                if (data.images && data.images.length > 0) {
                    renderGallery(data.images);
                } else {
                    galleryContent.innerHTML = \`
                        <div class="empty-state">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p>还没有图片，快来上传吧！</p>
                        </div>
                    \`;
                }
            } catch (err) {
                galleryContent.innerHTML = '<p style="text-align:center;color:#ef4444;">加载失败</p>';
            }
        }

        function renderGallery(images) {
            galleryContent.innerHTML = '<div class="image-grid"></div>';
            const grid = galleryContent.querySelector('.image-grid');
            images.forEach(img => {
                const item = document.createElement('div');
                item.className = 'image-item';
                item.innerHTML = \`
                    <img src="\${img.url}" alt="" loading="lazy">
                    <div class="image-overlay">
                        <button class="overlay-btn copy-btn" data-url="\${img.url}">复制</button>
                        <button class="overlay-btn delete-btn" data-key="\${img.key}">删除</button>
                    </div>
                \`;
                item.querySelector('img').addEventListener('click', () => {
                    modalImg.src = img.url;
                    modal.classList.add('active');
                });
                item.querySelector('.copy-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await navigator.clipboard.writeText(img.url);
                    showToast('链接已复制！');
                });
                item.querySelector('.delete-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('确定删除这张图片？')) {
                        try {
                            await fetch('/api/images/' + img.key, { method: 'DELETE' });
                            showToast('删除成功');
                            loadGallery();
                        } catch (err) {
                            showToast('删除失败', true);
                        }
                    }
                });
                grid.appendChild(item);
            });
        }

        refreshBtn.addEventListener('click', loadGallery);
        loadGallery();
    </script>
</body>
</html>
`;

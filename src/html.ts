export const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare R2 图床</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☁️</text></svg>">
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #1e293b;
            --text-sub: #64748b;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
            background-size: 24px 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            color: var(--text-main);
        }

        .container {
            width: 100%;
            max-width: 480px;
            padding: 2rem;
            animation: fadeIn 0.5s ease-out;
        }

        .card {
            background: var(--card-bg);
            border-radius: 24px;
            padding: 2.5rem;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            color: var(--text-sub);
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }

        .upload-area {
            border: 2px dashed var(--border);
            border-radius: 16px;
            padding: 3rem 1.5rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            background: #fdfdfd;
        }

        .upload-area:hover, .upload-area.dragover {
            border-color: var(--primary);
            background-color: #eff6ff;
            transform: scale(1.01);
        }

        .icon {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
            color: #94a3b8;
            transition: color 0.3s;
        }

        .upload-area:hover .icon {
            color: var(--primary);
        }

        .upload-text {
            font-weight: 500;
            color: var(--text-main);
            margin-bottom: 0.5rem;
        }

        .upload-hint {
            font-size: 0.85rem;
            color: var(--text-sub);
        }

        #token-input {
            width: 100%;
            padding: 12px 16px;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 0.9rem;
            transition: all 0.2s;
            outline: none;
            background: #f8fafc;
        }

        #token-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            background: white;
        }

        /* Result Section */
        #result-card {
            display: none;
            margin-top: 1.5rem;
            background: #f8fafc;
            border-radius: 16px;
            padding: 1rem;
            border: 1px solid var(--border);
            text-align: left;
        }

        .preview-container {
            width: 100%;
            height: 200px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 1rem;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .preview-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .url-box {
            display: flex;
            gap: 8px;
            background: white;
            padding: 4px;
            border: 1px solid var(--border);
            border-radius: 10px;
            align-items: center;
        }

        .url-input {
            flex: 1;
            border: none;
            padding: 8px 12px;
            font-size: 0.85rem;
            color: var(--text-sub);
            outline: none;
            background: transparent;
            width: 100%;
        }

        .copy-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .copy-btn:hover {
            background: var(--primary-hover);
        }

        .copy-btn.copied {
            background: #10b981;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }

        .loading {
            pointer-events: none;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1 class="title">Cloud Pixel</h1>
            <p class="subtitle">极速、安全的云端图床</p>
            
            <input type="password" id="token-input" placeholder="🔑 请输入 API Token (如有)" />
            
            <div class="upload-area" id="drop-zone">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <div class="upload-text">点击或拖拽图片到这里</div>
                <div class="upload-hint">支持 JPG, PNG, GIF, WEBP (最大 10MB)</div>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
            </div>

            <div id="result-card">
                <div class="preview-container">
                    <img id="preview-img" class="preview-image" src="" alt="Preview">
                </div>
                <div class="url-box">
                    <input type="text" class="url-input" id="url-input" readonly>
                    <button class="copy-btn" id="copy-btn">复制链接</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const tokenInput = document.getElementById('token-input');
        const resultCard = document.getElementById('result-card');
        const previewImg = document.getElementById('preview-img');
        const urlInput = document.getElementById('url-input');
        const copyBtn = document.getElementById('copy-btn');
        const card = document.querySelector('.card');

        // Load token
        const storedToken = localStorage.getItem('cf_auth_token');
        if (storedToken) tokenInput.value = storedToken;

        tokenInput.addEventListener('input', () => {
            localStorage.setItem('cf_auth_token', tokenInput.value);
        });

        // Copy functionality
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(urlInput.value);
                const originalText = copyBtn.innerText;
                copyBtn.innerText = '已复制!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                alert('复制失败，请手动复制');
            }
        });

        // Drag & Drop
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleUpload(e.target.files[0]);
        });

        // Paste upload
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    handleUpload(file);
                    break;
                }
            }
        });

        async function handleUpload(file) {
            // UI Loading state
            dropZone.style.opacity = '0.5';
            dropZone.style.pointerEvents = 'none';
            document.body.style.cursor = 'wait';
            
            // Local preview immediately
            const reader = new FileReader();
            reader.onload = (e) => {
               // Optional: show local preview before upload finishes? 
               // Let's verify upload first to be safe.
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('file', file);

            const headers = {};
            const token = tokenInput.value.trim();
            if (token) headers['Authorization'] = 'Bearer ' + token;

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });

                if (!response.ok) throw new Error(await response.text());

                const data = await response.json();
                if (data.url) {
                    showSuccess(data.url);
                }
            } catch (error) {
                alert('上传失败: ' + error.message);
            } finally {
                dropZone.style.opacity = '1';
                dropZone.style.pointerEvents = 'auto';
                document.body.style.cursor = 'default';
                fileInput.value = ''; // Reset input
            }
        }

        function showSuccess(url) {
            resultCard.style.display = 'block';
            urlInput.value = url;
            previewImg.src = url;
            
            // Scroll to bottom
            // resultCard.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>
`;

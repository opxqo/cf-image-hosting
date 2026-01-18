export const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CF R2 图床上传</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f7;
        }
        .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 300px;
        }
        .upload-area {
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 1rem;
        }
        .upload-area:hover, .upload-area.dragover {
            border-color: #007aff;
            background-color: #f0f9ff;
        }
        .upload-area p {
            margin: 0;
            color: #666;
        }
        #token-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        #result {
            margin-top: 1rem;
            word-break: break-all;
            font-size: 0.9rem;
            color: #333;
        }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h3>Cloudflare R2 图床</h3>
        <input type="password" id="token-input" placeholder="请输入 API Token (如有)" />
        <div class="upload-area" id="drop-zone">
            <p>点击或拖拽图片到此处上传</p>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
        </div>
        <div id="result"></div>
    </div>

    <script>
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const tokenInput = document.getElementById('token-input');
        const resultDiv = document.getElementById('result');

        // Load token from localStorage
        const storedToken = localStorage.getItem('cf_auth_token');
        if (storedToken) tokenInput.value = storedToken;

        tokenInput.addEventListener('change', () => {
            localStorage.setItem('cf_auth_token', tokenInput.value);
        });

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length) uploadFile(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) uploadFile(e.target.files[0]);
        });

        async function uploadFile(file) {
            resultDiv.innerHTML = '上传中...';
            resultDiv.className = '';
            
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
                    resultDiv.innerHTML = '上传成功!<br><a href="' + data.url + '" target="_blank">点击查看</a><br><input type="text" value="' + data.url + '" readonly onclick="this.select()" style="width:100%;margin-top:5px;">';
                    resultDiv.className = 'success';
                } else {
                    throw new Error('未返回 URL');
                }
            } catch (error) {
                resultDiv.innerText = '上传失败: ' + error.message;
                resultDiv.className = 'error';
                console.error(error);
            }
        }
    </script>
</body>
</html>
`;

<style>
.card-container {
    max-width: 100%;
    width: 900px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    display: flex;
    margin: 20px;
    overflow: hidden;
}

.content {
    flex: 1;
    padding: 24px;
}

.title {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #1f2328;
    margin-bottom: 16px;
}

.description {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: #656d76;
    margin-bottom: 16px;
    line-height: 1.5;
}

.github-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #656d76;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.github-icon {
    width: 24px;
    height: 24px;
}

.image-container {
    width: 200px;
    overflow: hidden;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
</head>
<body>
<div class="card-container">
    <div class="content">
        <h1 class="title">Devita</h1>
        <p class="description">kakaotech bootcamp project Devita<br>Follow their code on GitHub.</p>
        <a href="#" class="github-link">
            <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" class="github-icon">
                <path fill="#656d76" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            GitHub
        </a>
    </div>
    <div class="image-container">
        <img width="98" alt="image" src="https://github.com/user-attachments/assets/c699348e-9f38-40b7-8b0b-5ba686d52df2" />
    </div>
</div>
</body>
</html>
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            const codeBlock = document.querySelector(targetId);
            const textToCopy = codeBlock.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const button = this;
                button.classList.add('copied');
                showNotification('&#xe608;', '&nbsp;已复制到剪贴板');

                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1200);
            }).catch(err => {
                console.error('复制失败:', err);
                showNotification('&#xe6aa;', '&nbsp;复制失败，请手动选中');
            });
        });
    });

    // 搜索框功能：搜索已迁到 EdgeOne Makers（腾讯云边缘出口），
    // 那边不会被 Docker Hub 按 Cloudflare 出口 IP 限流
    function performSearch() {
        const query = document.getElementById('search-input').value;
        if (query) {
            window.location.href = 'https://search.oproxy.cc/search?q=' + encodeURIComponent(query);
        }
    }

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// 与 GitHub 加速页一致：页面上方居中浮出提示卡片
function showNotification(iconCode, message) {
    const el = document.getElementById('notification');
    if (!el) return;
    el.innerHTML = '<span class="iconfont">' + iconCode + '</span> ' + message;
    el.classList.add('show');
    setTimeout(() => {
        el.classList.remove('show');
    }, 3000);
}

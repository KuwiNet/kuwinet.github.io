document.addEventListener('DOMContentLoaded', function() {
    // 为所有复制按钮添加事件监听器
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            const codeBlock = document.querySelector(targetId);
            const textToCopy = codeBlock.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const button = this;
                button.classList.add('copied');

                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1500);
            }).catch(err => {
                console.error('复制失败:', err);
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

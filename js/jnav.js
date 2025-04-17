// 使用 fetch 方法加载导航栏
document.addEventListener('DOMContentLoaded', function() {
    fetch('navbar.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navbar-container').innerHTML = data;
})
.catch(error => {
    console.error('加载导航栏时出错:', error);
});
});
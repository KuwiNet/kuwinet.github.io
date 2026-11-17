function toSubmit(e) {
	e.preventDefault();
	const input = document.getElementsByName('q')[0];
	let userInput = input.value.trim();

	// 去掉协议头
	userInput = userInput.replace(/^https?:\/\//i, '');

	// 验证域名
	const validDomains = ['github.com', 'raw.githubusercontent.com', 'gist.githubusercontent.com', 'api.github.com'];
	const isValidDomain = validDomains.some(domain => userInput.startsWith(domain));

	if (!isValidDomain) {
		showNotification('&#xe6aa;', '&nbsp;请输入 Github 链接');
		input.value = '';
		return;
	}

	const baseUrl = location.origin + '/';
	const generatedUrl = baseUrl + userInput;

	// 一次性输出三个代码块：加速链接 / wget / curl
	document.getElementById('code-url').textContent = generatedUrl;
	document.getElementById('code-wget').textContent = 'wget ' + generatedUrl;
	document.getElementById('code-curl').textContent = 'curl -LO ' + generatedUrl;
	document.getElementById('result').style.display = 'block';

	// 清空输入框
	input.value = '';
}

function copyBlock(kind, btn) {
	const el = document.getElementById('code-' + kind);
	if (!el) return;
	const text = el.textContent;
	navigator.clipboard.writeText(text).then(() => {
		showNotification('&#xe63f;', '&nbsp;已复制到剪贴板');
		btn.classList.add('copied');
		setTimeout(() => btn.classList.remove('copied'), 1200);
	}, (err) => {
		console.error('复制失败:', err);
		showNotification('&#xe6aa;', '&nbsp;复制失败，请手动选中');
	});
}

function showNotification(iconCode, message) {
	const notification = document.getElementById('notification');
	notification.innerHTML = `<span class="iconfont">${iconCode}</span> ${message}`;
	notification.classList.add('show');
	setTimeout(() => {
		notification.classList.remove('show');
	}, 3000);
}

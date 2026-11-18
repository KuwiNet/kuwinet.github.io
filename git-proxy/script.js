function toSubmit(e) {
	e.preventDefault();
	const input = document.getElementsByName('q')[0];
	let userInput = input.value.trim();

	// 去掉协议头
	userInput = userInput.replace(/^https?:\/\//i, '');

	// 支持的域名（与 Worker 的 RULES 对齐）
	const validDomains = [
		'github.com',
		'raw.githubusercontent.com',
		'gist.githubusercontent.com',
		'api.github.com',
		'codeload.github.com',
		'objects.githubusercontent.com',
		'release-assets.githubusercontent.com',
		'media.githubusercontent.com',
		'github-cloud.githubusercontent.com'
	];
	const hasDomain = validDomains.some(domain => userInput.startsWith(domain));

	// 简写：owner/repo/archive/... 等，Worker 会自动补 github.com
	const shortRe = /^[^/?#\s]+\/[^/?#\s]+\/(archive|releases|blob|raw|tags|tree|info|git-)/i;
	// 简写：owner/repo.git，用于 git clone
	const shortGitRe = /^[^/?#\s]+\/[^/?#\s]+\.git\/?$/i;
	const isShort = shortRe.test(userInput) || shortGitRe.test(userInput);

	if (!hasDomain && !isShort) {
		showNotification('&#xe6aa;', '&nbsp;请输入 Github 链接');
		input.value = '';
		return;
	}

	const baseUrl = location.origin + '/';
	const generatedUrl = baseUrl + userInput;

	// 以 .git 结尾的是仓库地址，走 clone 场景；其余走下载场景
	const isGit = /\.git(\/|$|\?)/i.test(userInput);
	const codeUrl = document.getElementById('code-url');
	const codeWget = document.getElementById('code-wget');
	const codeCurl = document.getElementById('code-curl');
	const titleWget = document.getElementById('cb-title-wget');
	const titleCurl = document.getElementById('cb-title-curl');

	codeUrl.textContent = generatedUrl;

	if (isGit) {
		codeWget.textContent = 'git clone ' + generatedUrl;
		codeCurl.textContent = 'git clone --depth 1 ' + generatedUrl;
		if (titleWget) titleWget.textContent = 'git clone';
		if (titleCurl) titleCurl.textContent = '浅克隆（只取最新提交）';
	} else {
		codeWget.textContent = 'wget -c ' + generatedUrl;
		codeCurl.textContent = 'curl -LO ' + generatedUrl;
		if (titleWget) titleWget.textContent = 'wget 下载（可续传）';
		if (titleCurl) titleCurl.textContent = 'curl 下载';
	}

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

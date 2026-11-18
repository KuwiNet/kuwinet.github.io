function toSubmit(e) {
	e.preventDefault();
	const input = document.getElementsByName('q')[0];
	let userInput = input.value.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');

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
	const hasDomain = validDomains.some(domain => userInput === domain || userInput.startsWith(domain + '/'));

	// 简写形式。owner 段不允许点，避免 example.com/x 这类外站地址被误认为仓库
	const shortRe = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\//i;
	const shortGitRe = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\.git$/i;
	const shortRepoRe = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/i;
	const isShort = shortRe.test(userInput) || shortGitRe.test(userInput) || shortRepoRe.test(userInput);

	if (!hasDomain && !isShort) {
		showNotification('&#xe6aa;', '&nbsp;请输入 Github 链接');
		input.value = '';
		return;
	}

	// 简写统一补成完整形式，避免 Worker 端二段路径不识别
	let target = userInput;
	if (!hasDomain) {
		if (shortGitRe.test(target)) {
			target = 'github.com/' + target;
		} else if (shortRepoRe.test(target)) {
			target = 'github.com/' + target;
		} else {
			target = 'github.com/' + target;
		}
	}

	const kind = classify(target);

	// 仓库地址：第一块给可直接浏览的仓库页面（不带 .git），clone 命令单独带 .git
	let browseTarget = target;
	let cloneTarget = target;
	if (kind === 'git') {
		if (/\.git(\/|$|\?)/i.test(target)) {
			browseTarget = target.replace(/\.git(\/|$|\?)/i, '$1');
			cloneTarget = target;
		} else {
			cloneTarget = target + '.git';
		}
	}

	const generatedUrl = location.origin + '/' + browseTarget;
	const cloneUrl = location.origin + '/' + cloneTarget;

	const codeUrl = document.getElementById('code-url');
	const codeWget = document.getElementById('code-wget');
	const codeCurl = document.getElementById('code-curl');
	const titleWget = document.getElementById('cb-title-wget');
	const titleCurl = document.getElementById('cb-title-curl');
	const firstTitle = document.querySelectorAll('#result .cb .cb-title')[0];
	const note = document.getElementById('cb-note');
	const blocks = document.querySelectorAll('#result .cb');

	codeUrl.textContent = generatedUrl;
	if (firstTitle) firstTitle.textContent = '加速链接';
	for (let i = 0; i < blocks.length; i++) blocks[i].style.display = '';
	if (note) note.style.display = 'none';

	if (kind === 'git') {
		codeWget.textContent = 'git clone ' + cloneUrl;
		codeCurl.textContent = 'git clone --depth 1 ' + cloneUrl;
		if (titleWget) titleWget.textContent = 'git clone';
		if (titleCurl) titleCurl.textContent = '浅克隆（只取最新提交）';
		if (firstTitle) firstTitle.textContent = '仓库页面（浏览器打开）';
	} else if (kind === 'download') {
		codeWget.textContent = 'wget -c ' + generatedUrl;
		codeCurl.textContent = 'curl -LO ' + generatedUrl;
		if (titleWget) titleWget.textContent = 'wget 下载（可续传）';
		if (titleCurl) titleCurl.textContent = 'curl 下载';
	} else {
		// 网页与 API 不是可下载文件，不输出 wget / curl，只保留链接本身
		codeWget.textContent = '';
		codeCurl.textContent = '';
		for (let i = 1; i < blocks.length; i++) blocks[i].style.display = 'none';
		if (note) {
			note.textContent = kind === 'api'
				? '这是 GitHub API 地址，返回 JSON，可直接复制到程序中使用。'
				: '这是网页地址，点右上角图标在浏览器打开；页面样式可能不完整。';
			note.style.display = 'block';
		}
	}

	document.getElementById('result').style.display = 'block';

	// 清空输入框
	input.value = '';
}

// 判定链接类型：git 仓库 / 可下载文件 / API / 普通网页
function classify(u) {
	if (/^api\.github\.com\//i.test(u)) return 'api';
	if (/\.git(\/|$|\?)/i.test(u)) return 'git';
	if (/^github\.com\/[^/?#\s]+\/[^/?#\s]+$/i.test(u)) return 'git';
	if (/(releases\/download|releases\/assets|\/archive\/|\/blob\/|\/raw\/|raw\.githubusercontent\.com\/|gist\.githubusercontent\.com\/|codeload\.github\.com\/|objects\.githubusercontent\.com\/|release-assets\.githubusercontent\.com\/|media\.githubusercontent\.com\/|github-cloud\.githubusercontent\.com\/)/i.test(u)) return 'download';
	return 'page';
}

function openBlock(kind) {
	const el = document.getElementById('code-' + kind);
	if (!el) return;
	const url = (el.textContent || '').trim();
	if (url) window.open(url, '_blank', 'noopener');
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

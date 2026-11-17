// ---------Responsive-navbar-active-animation-----------
// 高亮块已改成 active 菜单项自身的背景（见 css/navbar.css 里的 ::before 规则），
// 不再靠 JS 去测量 li 的坐标，因此这里只保留交互：
//   1. 点击菜单切换 active；
//   2. 移动端汉堡按钮展开/收起；
//   3. 按 hostname 把当前页面对应的菜单标成 active。
// 好处：JS 没加载、加载了一半、或者被 CDN 返回了坏内容，高亮块依然是准的。
(function () {
    function navRoot() {
        return $('#navbarSupportedContent');
    }

    // 事件委托：绑在 ul 上一次即可，避免入口 reflow 时重复绑定
    navRoot().on('click', 'li', function () {
        navRoot().find('li').removeClass('active');
        $(this).addClass('active');
    });

    $('.navbar-toggler').on('click', function () {
        $('.navbar-collapse').slideToggle(300);
    });
})();

// --------------add active class-on another-page move----------
// 按 hostname 匹配当前页面所在的菜单项；没有匹配项时保留 HTML 里默认标好的那个
(function () {
    function markActive() {
        var current = location.hostname.replace(/^www\./, '');
        var matched = false;

        $('#navbarSupportedContent ul li a').each(function () {
            var $this = $(this);
            var link = ($this.attr('href') || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

            if (link && current === link) {
                $this.parent().addClass('active');
                $this.parents('.menu-submenu').addClass('show-dropdown');
                $this.parents('.menu-submenu').parent().addClass('active');
                matched = true;
            } else {
                $this.parent().removeClass('active');
            }
        });

        if (!matched) {
            var $first = $('.nav-item').first();
            if ($first.length) $first.addClass('active');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', markActive);
    } else {
        markActive();
    }
})();

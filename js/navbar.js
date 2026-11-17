// ---------Responsive-navbar-active-animation-----------
// 说明：原来的 test() 只在 DOM ready 里量一次，此时自定义字体（Co Headline / Comfortaa）
// 往往还没加载完，量出来的宽度是回退字体的，高亮块就会错位，刷新几次碰到字体缓存才正常。
// 现在的做法：
//   1. .hori-selector 默认 opacity:0（见 navbar.css），定位算准之后才淡入，不会闪错位框；
//   2. 字体就绪 / window.load / 容器尺寸变化（ResizeObserver）都会重算；
//   3. 对 NaN、0 宽高、多个 active 项做了防御；
//   4. click 处理只绑定一次，避免 reflow 次数多了叠加 handler。
(function () {
    var revealed = false;

    function navRoot() {
        return $('#navbarSupportedContent');
    }

    // 同一时刻只跟随一个 active 项：优先可见的，多个时取第一个
    function activeItem() {
        var $items = navRoot().find('li.active');
        var $visible = $items.filter(':visible');
        return ($visible.length ? $visible : $items).first();
    }

    function placeSelector() {
        var $item = activeItem();
        var $sel = $('.hori-selector');
        if (!$item.length || !$sel.length) return false;

        var pos = $item.position();
        var w = $item.innerWidth();
        var h = $item.innerHeight();
        if (!pos || !w || !h) return false;

        $sel.css({
            top: pos.top + 'px',
            left: pos.left + 'px',
            height: h + 'px',
            width: w + 'px'
        });
        return true;
    }

    function reveal() {
        if (revealed) return;
        if (!placeSelector()) return; // 还没量到有效值就继续藏着
        revealed = true;
        $('.hori-selector').css('opacity', 1);
    }

    // 多补几帧，覆盖字体替换、图片撑开、换行等回流
    var rafId = null;
    function reflow() {
        placeSelector();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(placeSelector);
        setTimeout(placeSelector, 120);
        setTimeout(placeSelector, 400);
        setTimeout(reveal, 0);
    }

    function bindClicks() {
        navRoot().off('click.navActive', 'li').on('click.navActive', 'li', function () {
            navRoot().find('ul li').removeClass('active');
            $(this).addClass('active');
            reflow();
        });
    }

    $(function () {
        bindClicks();
        reflow();

        $(window).on('load', function () {
            placeSelector();
            reveal();
        });

        if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
            document.fonts.ready.then(function () {
                placeSelector();
                reveal();
            });
        }

        // 兜底：字体到位太晚也要显示（否则整块高亮一直看不见）
        setTimeout(function () {
            placeSelector();
            reveal();
        }, 1200);

        // 容器或任一菜单项尺寸一变就重排：字体替换、缩放、换行都会触发
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function () {
                placeSelector();
                reveal();
            });
            var root = document.getElementById('navbarSupportedContent');
            if (root) ro.observe(root);
            navRoot().find('li').each(function () {
                ro.observe(this);
            });
        }
    });

    $(window).on('resize', function () {
        reflow();
        setTimeout(reflow, 500);
    });

    $('.navbar-toggler').click(function () {
        $('.navbar-collapse').slideToggle(300);
        setTimeout(reflow, 320);
    });
})();

// --------------add active class-on another-page move----------
// 按 hostname 匹配当前页面所在的菜单项
(function () {
    function markActive() {
        var current = location.hostname.replace(/^www\./, '');

        $('#navbarSupportedContent ul li a').each(function () {
            var $this = $(this);
            var link = ($this.attr('href') || '').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

            if (link && current === link) {
                $this.parent().addClass('active');
                $this.parents('.menu-submenu').addClass('show-dropdown');
                $this.parents('.menu-submenu').parent().addClass('active');
            } else {
                $this.parent().removeClass('active');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', markActive);
    } else {
        markActive();
    }
})();

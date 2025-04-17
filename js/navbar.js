// ---------Responsive-navbar-active-animation-----------
function test() {
    var tabsNewAnim = $('#navbarSupportedContent');
    var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    
    $(".hori-selector").css({
"top": itemPosNewAnimTop.top + "px",
"left": itemPosNewAnimLeft.left + "px",
"height": activeWidthNewAnimHeight + "px",
"width": activeWidthNewAnimWidth + "px"
    });
    
    $("#navbarSupportedContent").on("click", "li", function (e) {
$('#navbarSupportedContent ul li').removeClass("active");
$(this).addClass('active');

var activeWidthNewAnimHeight = $(this).innerHeight();
var activeWidthNewAnimWidth = $(this).innerWidth();
var itemPosNewAnimTop = $(this).position();
var itemPosNewAnimLeft = $(this).position();

$(".hori-selector").css({
    "top": itemPosNewAnimTop.top + "px",
    "left": itemPosNewAnimLeft.left + "px",
    "height": activeWidthNewAnimHeight + "px",
    "width": activeWidthNewAnimWidth + "px"
});
    });
}

$(document).ready(function () {
    setTimeout(function () { test(); });
});

$(window).on('resize', function () {
    setTimeout(function () { test(); }, 500);
});

$(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function () { test(); });
});

// --------------add active class-on another-page move----------
//jQuery(document).ready(function ($) {
//    var path = window.location.pathname.split("/").pop();
//    
//    if (path == '') {
//path = 'index.html';
//    }
//    
//    var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
//    target.parent().addClass('active');
//});
// 使用 JavaScript 为当前页面的导航项添加 active 类
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面的完整 URL
    var currentURL = window.location.href;
    // 去除协议头和斜杠
    currentURL = currentURL.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    // 遍历导航菜单中的所有链接
    $('#navbarSupportedContent ul li a').each(function () {
var $this = $(this);
// 获取链接的 href 属性值
var linkURL = $this.attr('href');
// 去除协议头和斜杠
linkURL = linkURL.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

// 如果当前页面 URL 和链接 URL 一致
if (currentURL === linkURL) {
    // 为当前链接的父元素添加 active 类
    $this.parent().addClass('active');
    // 如果有子菜单，添加相应的样式类
    $this.parents('.menu-submenu').addClass('show-dropdown');
    $this.parents('.menu-submenu').parent().addClass('active');
} else {
    // 如果不一致，移除 active 类
    $this.parent().removeClass('active');
}
    });
});
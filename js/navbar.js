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
jQuery(document).ready(function ($) {
    var path = window.location.pathname.split("/").pop();
    
    if (path == '') {
path = 'index.html';
    }
    
    var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
    target.parent().addClass('active');
});
// 使用 JavaScript 为当前页面的导航项添加 active 类
//document.addEventListener('DOMContentLoaded', function() {
//    var currentURL = window.location.href;
//    currentURL = currentURL.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
//    $('#navbarSupportedContent ul li a').each(function () {
//var $this = $(this);
//var linkURL = $this.attr('href');
//linkURL = linkURL.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
//if (currentURL === linkURL) {
//    $this.parent().addClass('active');
//    $this.parents('.menu-submenu').addClass('show-dropdown');
//    $this.parents('.menu-submenu').parent().addClass('active');
//} else {
//    $this.parent().removeClass('active');
//}
//    });
//});
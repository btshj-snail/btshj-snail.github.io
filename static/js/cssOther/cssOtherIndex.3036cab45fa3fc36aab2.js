webpackJsonp([17],{11:function(e,n,t){"use strict";function o(){var e=["#ff4400","#4b0","#1184CE","#c9c84b"];$(".co_cell_inner").each(function(){var n=a.a.getRandom(0,3);$(this).css({"background-color":e[n]})})}Object.defineProperty(n,"__esModule",{value:!0});var a=t(1);t(0);var c={doHeadSectionAnimate:function(){var e=$("#headSectionAnimate"),n=e.find("span").hide();e.addClass("animate_text_center"),setTimeout(function(){n.show(),e.addClass("animate_text_second"),setTimeout(function(){e.addClass("animate_text_finally")},1600)},1600)},doCellComeInAnimate:function(){var e=Math.max(document.body.scrollTop,document.documentElement.scrollTop),n=Math.max(document.body.clientHeight,document.documentElement.clientHeight);$(".co_cell[comeIn!='done']").each(function(t){var o=$(this);o.offset().top<=e+n&&o.attr("comeIn","done").css({"animation-delay":.1*t+"s"}).addClass("fadeInUp")})},listenCellComeIn:function(){$(window).scroll(function(){c.doCellComeInAnimate()})}};$(function(){o(),a.a.loadImagesComplete(function(){a.a.endLoading(),c.doHeadSectionAnimate(),c.doCellComeInAnimate(),c.listenCellComeIn()})})}},[11]);
//# sourceMappingURL=cssOtherIndex.3036cab45fa3fc36aab2.js.map
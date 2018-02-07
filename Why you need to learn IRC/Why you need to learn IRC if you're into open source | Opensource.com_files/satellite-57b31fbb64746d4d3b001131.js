_satellite.pushAsyncScript(function(event, target, $variables){
  //set new max scroll value to cookie
if (typeof jQuery !== 'undefined') {
  var $documentInfo = jQuery(document);
  var $windowInfo = jQuery(window);
  var pageHeight = $documentInfo.height();
  var viewportHeight = $windowInfo.height();
  var initialPercent = viewportHeight / pageHeight;
  var maxInterval = 0;
  if (initialPercent > 1) {
    initialPercent = 100;
  } else {
    initialPercent = Math.round(initialPercent * 100);
  }
  var maxScroll = Math.floor(initialPercent);
  window._sdi.util.setCookie('sat_ppv', maxScroll);
  jQuery(window).scroll(function() {
    var $windowData = jQuery(window);
    var $documentData = jQuery(document);
    var s = $windowData.scrollTop();
    var d = $documentData.height();
    var c = $windowData.height();
    var scrollPercent = (s / (d - c)) * 100;
    if (scrollPercent > maxScroll) {
      maxScroll = Math.floor(scrollPercent);
    }
    window._sdi.util.setCookie('sat_ppv', maxScroll);
  });
}
});

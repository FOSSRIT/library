(function (w, d, e, u) {
 w.newShareCountsLoaded=1;
 d.addEventListener("DOMContentLoaded", function () {
  var el = d.createElement (e);
  el.async = 1;
  el.src = u;
  var s = d.getElementsByTagName (e)[0];
  s.parentNode.insertBefore (el, s);
 });
}) (window, document, 'script', '//app.newsharecounts.com/nsc.js');

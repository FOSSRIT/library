(function ($) {
  /* Loops over urls and replaces them when found. */
  function loginlogoutAttach(context) {
    for(var url in login_destination = Drupal.settings.loginlogout.urls) {
      $("a[href='"+ url + "']").attr('href',  Drupal.settings.loginlogout.urls[url]);
    }
  }
  
Drupal.behaviors.loginlogout = {
  attach: function (context) {
    loginlogoutAttach(context);
  }
};

})(jQuery);

(function(window, $) {

  $.prototype.menuMobileDropdown = function(breakpoint) {
    $this = $(this);
    $this.data('breakpoint', breakpoint);
    !$this.hasClass('menu--mobile-dropdown') && $this.addClass('menu--mobile-dropdown');
    // Notify the css when none of the tabs are active so we can make the first
    // in the list visible by default.
    if (!$this.find('li a.active').length) {
      $('li', $this).addClass('none-active');
    }
    $('li a', $this).once('menu--mobile-dropdown').click(function(event) {
      $link = $(this);
      $li = $link.closest('li');
      $menu = $li.closest('.menu--mobile-dropdown');
      if ($(window).width() <= $menu.data('breakpoint')) {
        if (!$li.hasClass('is-expanded')) {
          event.preventDefault();
        } else {
          $menu.find('li.active a').removeClass('active');
          $menu.find('li.active').removeClass('active');
          $li.addClass('active');
          $link.addClass('active progress-disabled is-loading');
        }
        var $target = $menu.find('li'),
          action = 'is-expanded';
        $target.removeClass('none-active');
        $target.toggleClass(action);
        // Scroll to top
        if ($target.hasClass(action)) {
          $('html,body').animate({
            scrollTop: $target.offset().top - scroll_fuzz_factor
          }, 600);
        }
      }
    });
  };

  $(document).ready(function() {

    var addthis_config = addthis_config || {};
    addthis_config.data_track_clickback = false;

    $menuItems =  $('.sf-main-menu > li');
    $mainMenu = $('.sf-main-menu');

    if ($menuItems.size() == 5) {
      $mainMenu.addClass('sf-menu-5');
    }
    if ($menuItems.size() == 6) {
      $mainMenu.addClass('sf-menu-6');
    }
    var store = 0;
    var whole = 960;
    var list = jQuery('.sf-menu li.sf-depth-1');
    var count = jQuery('.sf-menu li.sf-depth-1').length;

    jQuery.each(list, function(index, item) {
      store += jQuery(item).width();
    });

    var diff = 960 - (store + (6 * (count -1)));

    jQuery.each(list, function(index, item) {
      jQuery(item).find('.sf-depth-1').css('padding', '12px ' + (diff/(count * 2)) + 'px');
    });

    $(".form-text").placeholder = "Search ... ";

    // When we scroll to the currently clicked text-toggle, make a fuzz factor
    // to account for nav bar for admins (which adds body padding) as well
    // as a 15 pixel whitespace barier.
    scroll_fuzz_factor = parseInt($('body').css('padding-top'), 10);
    scroll_fuzz_factor += 15;

    // Convert lander tabs to a dropdown menu at 850 pixel breakpoint (where
    // they start to wrap).
    if ($('.lander-tabs').length) {
      $('.lander-tabs').menuMobileDropdown(850);
    }
    // Convert sidebar menu on resources to a dropdown menu at 700 pixels.
    if ($('.pane-sidebar-menu').length) {
      $('.pane-sidebar-menu').menuMobileDropdown(700);
    }

    jQuery('.view-related-articles .views-row').once().each(function() {
      var link = $(this).find('a');
      link.attr('href', link.attr('href') + '?utm_campaign=intrel');
    })

  });

})(window, jQuery);

/**
 * Events to run as early as possible, even before jQuery.
 */
document.addEventListener('DOMContentLoaded', function() {
  Element.prototype.toggleKlass = function(classToToggle) {
    if(this.classList) {
      this.classList.toggle(classToToggle);
    } else {
      var classes = this.className.split(' ');
      var existingIndex = -1;
      for(var i = classes.length; i--;) {
        if(classes[i] === classToToggle) {
          existingIndex = i;
        }
      }
      if(existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(classToToggle);
      }
      this.className = classes.join(' ');
    }
  };
  Element.prototype.containsKlass = function(classToToggle) {
    if(this.classList) {
      return this.classList.contains(classToToggle);
    } else {
      var classes = this.className.split(' ');
      var existingIndex = -1;
      for(var i = classes.length; i--;) {
        if(classes[i] === classToToggle) {
          existingIndex = i;
        }
      }
      if(existingIndex >= 0) {
        return true;
      } else {
        return false;
      }
    }
  };
  Element.prototype.removeKlass = function(classToRemove) {
    var reg = new RegExp('(\\s|^)'+classToRemove+'(\\s|$)');
    this.className = this.className.replace(reg,' ');
  };
  Element.prototype.prependChild = function(element) {
    this.insertBefore( element, this.firstChild );
  };

  // Mobile Main Menu and Search form
  var topMenuLinks = document.querySelectorAll('#block-system-main-menu .menu .menu__item'),
    header = document.querySelector('.js-mobile-header-buttons'),
    mobileSearchButton = document.createElement('a'),
    mobileMenuButton = document.createElement('a'),
    body = document.body;

  mobileSearchButton.className = 'mobile--search-button';
  mobileMenuButton.className = 'mobile--menu-button';
  header.prependChild(mobileSearchButton);
  header.prependChild(mobileMenuButton);
  mobileSearchButton.addEventListener('click', function(e) {
    e.preventDefault();
    body.removeKlass('show-mobile-menu');
    body.toggleKlass('show-mobile-search');
  });
  mobileMenuButton.addEventListener('click', function(e) {
    e.preventDefault();
    body.removeKlass('show-mobile-search');
    body.toggleKlass('show-mobile-menu');
  });

  Array.prototype.forEach.call(topMenuLinks, function(el, index) {
    var backButton = document.createElement('a');
    backButton.innerText = "Back";
    backButton.className += "back-button";
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      el.toggleKlass('is-active');
    });

    if(el.containsKlass('is-expanded')) {
      el.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.toggleKlass('is-active');
      });

      var subList = el.querySelector('ul');
      var mainLink = el.firstChild.cloneNode(true);
      mainLink.className += ' parent-link';
      subList.insertBefore(mainLink, subList.firstChild);
      subList.insertBefore(backButton, subList.firstChild);
    }

  });

  // Move images in DOM
  if (window.innerWidth < 640 && document.querySelector('.section-open-organization')) {
    var images = document.querySelectorAll('.views-field-field-lead-image');

    Array.prototype.forEach.call(images, function(image, index) {
      var parent = image.parentElement;
      parent.insertBefore(image, parent.firstChild);
    });
  }
});

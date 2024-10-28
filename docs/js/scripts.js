'use strict';

(function app() {
  var tabletBreak = 1024;
  var mobileBreak = 768;
  var mobileXSBreak = 375;
  var pageOffsetX = window.scrollX;
  var pageOffsetY = window.scrollY;
  var frozeException = null;
  var isWindowFrozen = false;
  var isHeaderActive = false;
  var isHeaderStickEnable = true;

  function detectBrowser() {
    var html = $('html');
    function init() {
      var userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg/') <= -1) {
        html.addClass('is-chrome');
      } else {
        html.removeClass('is-chrome');
      }
      if (
        userAgent.indexOf('safari') > -1
        && userAgent.indexOf('chrome') <= -1
      ) {
        html.addClass('is-safari');
      } else {
        html.removeClass('is-safari');
      }
      if (userAgent.indexOf('firefox') > -1) {
        html.addClass('is-firefox');
      } else {
        html.removeClass('is-firefox');
      }
      if (
        userAgent.indexOf('msie ') > -1
        || userAgent.indexOf('trident/') > -1
      ) {
        html.addClass('is-ie');
      } else {
        html.removeClass('is-ie');
      }
      if (userAgent.indexOf('edg/') > -1) {
        html.addClass('is-edge');
      } else {
        html.removeClass('is-edge');
      }
    }
    $(window).on('load resize', function onLoadWindow() {
      init();
    });
    init();
  }

  function detectDevice() {
    var html = $('html');
    function init() {
      var viewport = $('html head meta[name="viewport"]')[0];
      var userAgent = navigator.userAgent.toLowerCase();
      var orientation = window.matchMedia('(orientation: portrait)').matches;

      // System
      if (userAgent.indexOf('mac') > -1) {
        html.addClass('is-mac is-macos');
      } else {
        html.removeClass('is-mac is-macos');
      }
      if (userAgent.match(/(iphone|ipod|ipad)/)) {
        if (userAgent.match(/iphone/)) {
          if (window.screen.width < mobileBreak && window.screen.width >= 390) {
            html.addClass('is-iphone-12');
          } else {
            html.removeClass('is-iphone-12');
          }
          if (window.screen.width < mobileBreak && window.screen.width < 390) {
            html.addClass('is-iphone-10');
          } else {
            html.removeClass('is-iphone-10');
          }
          if (window.screen.width < mobileBreak && window.screen.width < 375) {
            html.addClass('is-iphone-5');
          } else {
            html.removeClass('is-iphone-5');
          }
          html.addClass('is-iphone');
        } else {
          html.removeClass('is-iphone-12 is-iphone-10 is-iphone-5 is-iphone');
        }
        if (userAgent.match(/ipod/)) {
          html.addClass('is-ipod');
        } else {
          html.removeClass('is-ipod');
        }
        if (userAgent.match(/ipad/)) {
          html.addClass('is-ipad');
        } else {
          html.removeClass('is-ipad');
        }
        html.addClass('is-ios');
      } else {
        html.removeClass('is-phone is-ipod is-ipad is-ios');
      }
      if (userAgent.indexOf('android') > -1) {
        html.addClass('is-android');
      } else {
        html.removeClass('is-android');
      }

      // Type
      if (
        navigator.maxTouchPoints === 1
        && userAgent.indexOf('Mobile') === -1
      ) {
        $('html').addClass('is-emulation');
      } else {
        $('html').removeClass('is-emulation');
      }
      if (
        (html.hasClass('is-mac')
          || html.hasClass('is-ios')
          || html.hasClass('is-android'))
        && navigator.maxTouchPoints
        && navigator.maxTouchPoints >= 1
      ) {
        $('html').addClass('is-touchable');
        $('html').removeClass('is-untouchable');
      } else {
        $('html').removeClass('is-touchable');
        $('html').addClass('is-untouchable');
      }

      // Media
      if ($(window).width() < mobileBreak) {
        if (window.screen.width < mobileXSBreak) {
          viewport.setAttribute(
            'content',
            'width=' + mobileXSBreak + ', user-scalable=0'
          );
        } else {
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1'
          );
        }
        $('html').removeClass('is-desktop is-tablet');
        $('html').addClass('is-mobile');
      } else {
        $('html').addClass('is-desktop');
        if (
          (window.screen.width >= mobileBreak
            && window.screen.width <= tabletBreak)
          || (window.screen.width < mobileBreak
            && window.screen.height >= mobileBreak
            && !orientation)
        ) {
          $('html').addClass('is-tablet');
        } else {
          $('html').removeClass('is-tablet');
        }
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
        );
        $('html').removeClass('is-mobile');
      }
    }
    $(window).on('load resize', function onLoadWindow() {
      init();
    });
    init();
  }

  function isMobile() {
    return $('html').hasClass('is-mobile');
  }

  function isTouchable() {
    return $('html').hasClass('is-touchable');
  }

  function isOutsideOfElement(event, target) {
    var container = $(target);
    if (
      !container.is(event.target)
      && container.has(event.target).length === 0
    ) {
      return true;
    }
    return false;
  }

  function scrollFix(target) {
    var windowScrollLeft = $(window).scrollLeft();
    if (windowScrollLeft > 0 && $(target).css('position') === 'fixed') {
      $(target).css('left', -windowScrollLeft + 'px');
    } else {
      $(target).css('left', 0);
    }
  }

  function frozeWindow(isDo, exception) {
    var classFrozenWindows = 'is-frozen-windows';
    var classFrozenOS = 'is-frozen-os';
    function freezeWindows() {
      if (isDo) {
        pageOffsetY = $(window).scrollTop();
        $('body').css({ top: -pageOffsetY + 'px', left: -pageOffsetX + 'px' });
        $('html').addClass(classFrozenWindows);
        isWindowFrozen = true;
      } else {
        isWindowFrozen = false;
        $('html').removeClass(classFrozenWindows);
        $('body').css({ top: 'auto', left: 'auto' });
        $(window).scrollLeft(pageOffsetX);
        $(window).scrollTop(pageOffsetY);
      }
    }
    function freezeOS() {
      if (isDo) {
        $('html').addClass(classFrozenOS);
        isWindowFrozen = true;
        if (exception.length) {
          frozeException = exception;
        } else {
          frozeException = null;
        }
        if (
          !$('html').attr('data-froze-state')
          || $('html').attr('data-froze-state') !== 'ready'
        ) {
          document.body.addEventListener(
            'touchmove',
            function onTouch(event) {
              if (isWindowFrozen) {
                if (
                  frozeException !== null
                  && frozeException.length
                  && isOutsideOfElement(event, frozeException)
                ) {
                  event.preventDefault();
                } else if (frozeException === null) {
                  event.preventDefault();
                }
              }
            },
            { passive: false }
          );
          $('html').attr('data-froze-state', 'ready');
        }
      } else {
        isWindowFrozen = false;
        $('html').removeClass(classFrozenOS);
      }
    }
    if (isDo) {
      if ($('html').hasClass('is-desktop') && !isTouchable()) {
        freezeWindows();
      } else {
        freezeOS();
      }
    } else if (!isDo && $('html').hasClass(classFrozenWindows)) {
      freezeWindows();
    } else if (!isDo && $('html').hasClass(classFrozenOS)) {
      freezeOS();
    }
  }

  function headerCommonOpen() {
    var classReady = 'is-ready';
    var classActive = 'is-active';
    var header = $('header');
    var navigationSitemap = header.find('.js-navigation');
    var buttonBurger = header.find('.js-button-menu');
    header.addClass(classReady);
    header.addClass(classActive);
    navigationSitemap.addClass(classReady);
    navigationSitemap.addClass(classActive);
    buttonBurger.addClass(classReady);
    buttonBurger.addClass(classActive);
    isHeaderActive = true;
    isHeaderStickEnable = false;
    header.removeClass('is-on-top');
    header.css({
      top: 0
    });
    if (isWindowFrozen === false) {
      frozeWindow(true, $('.js-navigation'));
    }
  }

  function headerCommonClose() {
    var classReady = 'is-ready';
    var classActive = 'is-active';
    var header = $('header');
    var navigationSitemap = header.find('.js-navigation');
    var buttonBurger = header.find('.js-button-menu');
    header.addClass(classReady);
    header.removeClass(classActive);
    navigationSitemap.addClass(classReady);
    navigationSitemap.removeClass(classActive);
    buttonBurger.addClass(classReady);
    buttonBurger.removeClass(classActive);
    isHeaderActive = false;
    isHeaderStickEnable = true;
    if (isWindowFrozen === true) {
      frozeWindow(false);
    }
  }

  function headerCommon() {
    var classReady = 'is-ready';
    var classActive = 'is-active';
    var classScrolled = 'is-scrolled';
    var header = $('header');
    var navigationSitemap = header.find('.js-navigation');
    var buttonBurger = header.find('.js-button-menu');
    var maskDefault = header.find('.mask-header-default');
    if (!$('header').length) return;
    buttonBurger.off().on('click', function onClickButton() {
      if (!buttonBurger.hasClass(classActive)) {
        headerCommonOpen();
      } else {
        headerCommonClose();
      }
    });
    maskDefault.on('click', function onClickMask() {
      headerCommonClose();
    });
    $(window).on('load scroll resize', function onLoadWindow() {
      if ($(document).scrollTop() > 1) {
        header.addClass(classScrolled);
      } else {
        header.removeClass(classScrolled);
      }
    });
    $(window).on('resize', function onLoadWindow() {
      header.removeClass(classReady);
      navigationSitemap.removeClass(classReady);
      buttonBurger.removeClass(classReady);
    });
    header.addClass(classReady);
    navigationSitemap.addClass(classReady);
    buttonBurger.addClass(classReady);
  }

  function headerSticky() {
    var lastScrollTop = 0;
    var header = $('header');
    var headerHeight = header.outerHeight();
    $(window).on('load scroll', function scrollHeader() {
      var currentScrollTop = $(this).scrollTop();
      if (isHeaderStickEnable) {
        headerHeight = header.outerHeight();
        if (currentScrollTop < 50) {
          header.addClass('is-on-top');
        } else {
          header.removeClass('is-on-top');
        }
        if (currentScrollTop > lastScrollTop) {
          header.css({
            top: -headerHeight
          });
        } else {
          header.css({
            top: 0
          });
        }
        lastScrollTop = currentScrollTop;
      } else {
        header.removeClass('is-on-top');
        header.css({
          top: 0
        });
      }
    });
  }

  function smoothScroll() {
    var anchors = $('a[href*="#"]:not([href="#"])');
    var speed = 500;
    var delay = 0;
    var timeout = 0;
    function getPosition(target) {
      var position = $(target).offset().top;
      var positionOffset = 0;
      if ($(target).attr('data-smoothscroll-offset') !== undefined) {
        position += parseInt($(target).attr('data-smoothscroll-offset'), 10);
      } else if (
        $(target).attr('data-smoothscroll-offset-pc') !== undefined
        && !isMobile()
      ) {
        position += parseInt($(target).attr('data-smoothscroll-offset-pc'), 10);
      } else if (
        $(target).attr('data-smoothscroll-offset-sp') !== undefined
        && isMobile()
      ) {
        position
          += parseFloat($(target).attr('data-smoothscroll-offset-sp'))
          * $('html').css('font-size');
      }
      position -= positionOffset;
      return position;
    }
    function triggerScroll(context) {
      var href = typeof context === 'string'
        ? context
        : '#' + $(context).attr('href').split('#')[1];
      if (!$(context).hasClass('no-scroll') && $(href).length) {
        if (isHeaderActive === true) {
          delay = 500;
          headerCommonClose();
        }
        if (isWindowFrozen === true) {
          delay = 500;
          frozeWindow(false);
        }
        setTimeout(function onTimeout() {
          $('body, html').animate(
            { scrollTop: getPosition($(href)) },
            speed,
            'swing'
          );
        }, delay);
        return false;
      }
      return true;
    }
    setTimeout(function setTimerHTMLVisibility() {
      window.scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);
    if (window.location.hash) {
      window.scroll(0, 0);
      if (
        navigator.userAgent.indexOf('MSIE ') > -1
        || navigator.userAgent.indexOf('Trident/') > -1
      ) {
        timeout = 0;
      } else {
        timeout = 500;
      }
      setTimeout(function setTimerTriggerScroll() {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on('click', function onClickAnchor() {
      return triggerScroll(this);
    });
  }

  function keyvisualSlider() {
    if (!$('.js-slider-keyvisual').length) return;
    $('.js-slider-keyvisual').each(function keyvisualSlide() {
      var slider = $(this);
      var sliderViewport = slider.find('.slider-viewport');
      var sliderSettings = {
        autoplay: {
          delay: 3000
        },
        speed: 800,
        simulateTouch: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next.is-keyvisual',
          prevEl: '.swiper-button-prev.is-keyvisual'
        },
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto'
      };
      // eslint-disable-next-line no-new
      new Swiper(sliderViewport[0], sliderSettings);
    });
  }

  function initWow() {
    if ($('.wow').length) {
      new WOW().init();
    }
    if ($('.js-offset').length) {
      $('.js-offset').each(function wowOffset() {
        $(this).attr('data-wow-offset', $(this).innerHeight() / 2);
      });
    }
  }

  function promotion() {
    var block = $('.header-common');
    var element = block.find('.promotion-header');
    var button = element.find('.button-promotion');
    var blockPaddingTop = parseInt(block.css('padding-top'), 10);
    var elementHeight = element.outerHeight();

    function updatePadding() {
      if (block.hasClass('promotion-ready')) {
        if (isMobile()) {
          var viewportWidth = $(window).width();
          var remValue = viewportWidth / 3.9;
          block.css('padding-top', (elementHeight + 20) / remValue + 'rem');
        } else {
          block.css('padding-top', elementHeight + 24);
        }
      }
    }

    $(window).on('load scroll resize', function () {
      elementHeight = element.outerHeight();
      updatePadding();
    });

    button.click(function () {
      if (block.hasClass('promotion-ready')) {
        block.removeClass('promotion-ready');
        block.animate(
          {
            paddingTop: blockPaddingTop
          },
          0,
          function () {
            if (isMobile()) {
              var viewportWidth = $(window).width();
              var remValue = viewportWidth / 3.9;
              block.animate({ paddingTop: 20 / remValue + 'rem' }, 300);
            } else {
              block.animate({ paddingTop: 24 }, 300);
            }
          }
        );
      }
    });
  }

  !(function (e) {
    'use strict';

    function placeholderTypewriter(input, options) {
      var settings = e.extend(
        {
          delay: 50,
          pause: 1000,
          text: [],
          cursor: '|'
        },
        options
      );

      function typePlaceholder(input, textIndex) {
        input.attr('placeholder', '');

        (function typeText(input, textIndex, charIndex, callback) {
          var currentText = settings.text[textIndex];
          var currentPlaceholder = input
            .attr('placeholder')
            .replace(settings.cursor, '');
          if (charIndex < currentText.length) {
            input.attr(
              'placeholder',
              currentPlaceholder + currentText[charIndex] + settings.cursor
            );
            setTimeout(function () {
              typeText(input, textIndex, charIndex + 1, callback);
            }, settings.delay);
          } else {
            callback();
          }
        }(input, textIndex, 0, function () {
          setTimeout(function () {
            (function deleteText(input) {
              var currentPlaceholder = input
                .attr('placeholder')
                .replace(settings.cursor, '');
              var placeholderLength = currentPlaceholder.length;
              if (placeholderLength > 0) {
                input.attr(
                  'placeholder',
                  currentPlaceholder.substr(0, placeholderLength - 1)
                    + settings.cursor
                );
                setTimeout(function () {
                  deleteText(input);
                }, settings.delay);
              } else {
                input.attr('placeholder', settings.cursor);
                typePlaceholder(input, (textIndex + 1) % settings.text.length);
              }
            }(input));
          }, settings.pause);
        }));
      }

      typePlaceholder(input, 0);
    }

    e.fn.placeholderTypewriter = function (options) {
      return this.each(function () {
        placeholderTypewriter(e(this), options);
      });
    };
  }(jQuery));

  function animatePlaceholder() {
    var placeholderData = $('.js-search-placeholder').data('placeholder');
    var placeholderText = placeholderData ? placeholderData.split(',') : [];
    $('.js-search-placeholder .input-wrapper').placeholderTypewriter({
      text: placeholderText,
      cursor: '_'
    });
  }

  $(function init() {
    detectBrowser();
    detectDevice();
    headerCommon();
    headerSticky();
    smoothScroll();
    keyvisualSlider();
    initWow();
    promotion();
    animatePlaceholder();
  });

  $(window).on('load scroll resize', function onLoadWindow() {
    pageOffsetX = $(window).scrollLeft();
    if (isWindowFrozen === true) {
      scrollFix($('body'));
    }
  });
}());

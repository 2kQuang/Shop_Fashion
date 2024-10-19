"use strict";

(function app() {
  var spBreak = 767.98;

  function isMobile() {
    return window.matchMedia("(max-width: " + spBreak + "px)").matches;
  }

  function detectBrowsers() {
    var html = $("html");
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("mac") >= 0) {
      html.addClass("is-mac");
    }
    if (ua.indexOf("safari") !== -1) {
      if (ua.indexOf("chrome") > -1) {
        html.addClass("is-chrome");
      } else {
        html.addClass("is-safari");
      }
    }
    if (ua.indexOf("msie ") > -1 || ua.indexOf("trident/") > -1) {
      html.addClass("is-ie");
    }
    if (ua.indexOf("firefox") > -1) {
      html.addClass("is-firefox");
    }
    if (ua.indexOf("android") > -1) {
      html.addClass("is-android");
    }
    if (ua.match(/(iphone|ipod|ipad)/)) {
      html.addClass("is-ios");
    }
    if (ua.indexOf("edg/") > -1) {
      html.removeClass("is-chrome");
      html.addClass("is-chromium");
    }
  }

  function tabletViewport() {
    var viewport = document.getElementById("viewport");
    var ua = "";

    function setViewport() {
      var portrait = window.matchMedia("(orientation: portrait)").matches;
      if (window.screen.width < 375 && portrait) {
        viewport.setAttribute("content", "width=375, user-scalable=0");
      } else if (
        (window.screen.width >= 768 && window.screen.width <= 1199) ||
        (window.screen.width < 768 && window.screen.height >= 768 && !portrait)
      ) {
        viewport.setAttribute("content", "width=1300, user-scalable=0");
        ua = navigator.userAgent.toLowerCase();
        if (
          (/macintosh/i.test(ua) &&
            navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 1) ||
          (ua.match(/(iphone|ipod|ipad)/) && !isMobile()) ||
          (ua.indexOf("android") > -1 && !isMobile())
        ) {
          $("html").addClass("is-tablet");
        }
      } else {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0",
        );
        $("html").removeClass("is-tablet");
      }
    }
    setViewport();
    $(window).on("load resize", setViewport);
  }

  function smoothScroll() {
    var anchors = $('a[href*="#"]:not([href="#"])');
    var headerHeight = 0;
    var speed = 500;
    var timeout = 0;
    var position = 0;

    function triggerScroll(context) {
      var href =
        typeof context === "string"
          ? context
          : "#" + $(context).attr("href").split("#")[1];
      if (!$(context).hasClass("no-scroll") && $(href).length) {
        position = $(href).offset().top - headerHeight;
        $("body, html").animate(
          {
            scrollTop: position,
          },
          speed,
          "swing",
        );
        return false;
      }
      return true;
    }
    setTimeout(function setTimerHTMLVisibility() {
      window.scroll(0, 0);
      $("html").removeClass("is-loading").addClass("is-visible");
    }, 1);
    if (window.location.hash) {
      window.scroll(0, 0);
      if (
        navigator.userAgent.indexOf("MSIE ") > -1 ||
        navigator.userAgent.indexOf("Trident/") > -1
      ) {
        timeout = 0;
      } else {
        timeout = 500;
      }
      setTimeout(function setTimerTriggerScroll() {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on("click", function onClickAnchor() {
      return triggerScroll(this);
    });
  }

  function promotion() {
    var block = $(".header-common");
    var element = block.find(".promotion-header");
    var button = element.find(".button-promotion");
    var blockPaddingTop = parseInt(block.css("padding-top"), 10);
    var elementHeight = element.outerHeight();

    function updatePadding() {
      if (block.hasClass("is-ready")) {
        if (isMobile()) {
          var viewportWidth = $(window).width();
          var remValue = viewportWidth / 3.9;
          block.css("padding-top", (elementHeight + 24) / remValue + "rem");
        } else {
          block.css("padding-top", elementHeight + 24);
        }
      }
    }

    $(window).on("load resize", function () {
      elementHeight = element.outerHeight();
      updatePadding();
    });

    button.click(function () {
      if (block.hasClass("is-ready")) {
        block.removeClass("is-ready");
        block.animate(
          {
            paddingTop: blockPaddingTop,
          },
          300,
          function () {
            block.removeAttr("style");
          },
        );
      }
    });
  }

  !(function (e) {
    "use strict";

    function placeholderTypewriter(input, options) {
      var settings = e.extend(
        {
          delay: 50,
          pause: 1000,
          text: [],
          cursor: "|",
        },
        options,
      );

      function typePlaceholder(input, textIndex) {
        input.attr("placeholder", "");

        (function typeText(input, textIndex, charIndex, callback) {
          var currentText = settings.text[textIndex];
          var currentPlaceholder = input
            .attr("placeholder")
            .replace(settings.cursor, "");
          if (charIndex < currentText.length) {
            input.attr(
              "placeholder",
              currentPlaceholder + currentText[charIndex] + settings.cursor,
            );
            setTimeout(function () {
              typeText(input, textIndex, charIndex + 1, callback);
            }, settings.delay);
          } else {
            callback();
          }
        })(input, textIndex, 0, function () {
          setTimeout(function () {
            (function deleteText(input) {
              var currentPlaceholder = input
                .attr("placeholder")
                .replace(settings.cursor, "");
              var placeholderLength = currentPlaceholder.length;
              if (placeholderLength > 0) {
                input.attr(
                  "placeholder",
                  currentPlaceholder.substr(0, placeholderLength - 1) +
                    settings.cursor,
                );
                setTimeout(function () {
                  deleteText(input);
                }, settings.delay);
              } else {
                input.attr("placeholder", settings.cursor);
                typePlaceholder(input, (textIndex + 1) % settings.text.length);
              }
            })(input);
          }, settings.pause);
        });
      }

      typePlaceholder(input, 0);
    }

    e.fn.placeholderTypewriter = function (options) {
      return this.each(function () {
        placeholderTypewriter(e(this), options);
      });
    };
  })(jQuery);

  function animatePlaceholder() {
    var placeholderData = $(".js-search-placeholder").data("placeholder");
    var placeholderText = placeholderData ? placeholderData.split(",") : [];
    $(".js-search-placeholder .input-wrapper").placeholderTypewriter({
      text: placeholderText,
      cursor: "_",
    });
  }

  $(function init() {
    detectBrowsers();
    tabletViewport();
    smoothScroll();
    promotion();
    animatePlaceholder();
  });
})();

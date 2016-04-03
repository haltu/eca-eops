// STRUCTURE
// category
//  - id (integer)
//  - title (string)
//  - description (string)
//  - connections (array of category ids)
//  - articles (array of article ids)
//  - color (string)
// article
//  - id (integer)
//  - title (string)
//  - content (string)
//  - categories (array of category ids)
//
// var data = {
//   categories: {},
//   articles: {}
// };
palikka
.define(['jQuery', '_', 'snabbt', 'Hogan'], function () {

  return window[this.id];

})
.define('domReady', ['jQuery'], function ($) {

  return palikka.defer($);

})
.define('app.templates', ['Hogan'], function (Hogan) {

  // USAGE
  // tpl.main.render({categories: categoriesData });
  // tpl.category.render({categories: categoriesData, category: categoryData, article: articleData });
  // tpl.article.render({article: articleData });

  return {
    main: Hogan.compile(document.getElementById('tpl-view-main').innerHTML),
    category: Hogan.compile(document.getElementById('tpl-view-category').innerHTML),
    article: Hogan.compile(document.getElementById('tpl-article').innerHTML)
  };

})
.define('app.render', ['_', 'app.data', 'app.templates'], function (_, data, tpl) {

  // USAGE
  // render('main');
  // render('category', catId, articleId);
  // render('article', articleId);

  return function (type, arg1, arg2) {

    var template = tpl[type];

    // Render main view.
    if (type === 'main') {

      var tplData = _.merge({}, {
        categories: _.values(data.categories)
      });

      return template.render(tplData);

    }

    // Render article view.
    else if (type === 'category') {

      var tplData = _.merge({}, {
        categories: _.values(data.categories),
        category: data.categories[arg1],
        article: data.articles[arg2],
      });

      // Populate category articles.
      var articles = [];
      _.forEach(tplData.category.articles, function (articleId) {
        articles.push(_.merge({}, data.articles[articleId]));
      });
      articles[0].active = true;
      tplData.category.articles = articles;

      return template.render(tplData);

    }

    else if (type === 'article') {

      var tplData = _.merge({}, {
        article: data.articles[arg1]
      });

      return template.render(tplData);

    }

  };

})
.define('app.color', function (_) {

  var palette = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'];
  var length = palette.length;
  var pointer = null;

  return function () {
    pointer = pointer === null || pointer === (length - 1) ? 0 : pointer + 1;
    return palette[pointer];
  };

})
.define('app.transitionend', function () {

  var transitions = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition' : 'transitionend',
    'OTransition' : 'otransitionend',
    'transition' : 'transitionend'
  };

  for (var t in transitions){
    if (document.body.style[t] !== undefined){
      return transitions[t];
    }
  }

})
.define('app.createWords', ['jQuery'], function ($) {

  return function createWords($element) {

    var element = $element.get(0);
    var text = element.textContent.trim();
    var textParts = text.split(' ');

    element.textContent = '';

    textParts.forEach(function (textPart, i) {

      var word = document.createElement('span');

      word.className = 'word';
      word.textContent = textPart;
      element.appendChild(word);

      if (i !== textParts.length - 1) {
        word.insertAdjacentHTML('afterEnd', ' ');
      }

    });

  };

})
.define('app.removeWords', ['jQuery'], function ($) {

  return function removeWords($items) {
    $items.each(function () {
      this.textContent = this.textContent;
    });
  };

})
.define('app.animateWords', ['jQuery', 'snabbt'], function ($, snabbt) {

  return function animateWords($elements, callback) {

    snabbt($elements.find('.word').get(), {
      fromScale: [2, 2],
      scale: [1, 1],
      delay: function (i) {
        return i * 30
      },
      duration: 300,
      fromOpacity: 0,
      opacity: 1,
      easing: 'ease',
      allDone: function () {
        if (typeof callback === 'function') {
          callback();
        }
      }
    });

  };

})
.define('app', [
  'jQuery',
  '_',
  'snabbt',
  'app.render',
  'app.color',
  'app.createWords',
  'app.removeWords',
  'app.animateWords',
  'app.transitionend',
  'domReady'
], function ($, _, snabbt, render, color, createWords, removeWords, animateWords, transitionend) {

  // Elems.
  var $docElem = $(document.documentElement);
  var $header = $('header');
  var $actionInfo = $('.action-info');
  var $actionMain = $('.action-main');
  var $info = $('#info');
  var $mainView = $('#view-main');
  var $mainViewContainer = $('#view-main-container');
  var $articleView = $('#view-article');
  var $articleViewContainer = $('#view-article-container');

  // State data.
  var isMain = true;
  var activeCategory = null;
  var activeArticle = null;
  var isTransitioningView = true;

  // Hover timeout.
  var hoverTimeout = undefined;

  //
  // Init
  //

  initMain(function () {
    isTransitioningView = false;
    initEvents();
    hoverCheck();
  });

  //
  // Helpers
  //

  function initEvents() {

    $(document)
    .on('mouseenter', '.category-item-link', function (e) {

      if (isTransitioningView) {
        return;
      }

      var $this = $(this);
      var $item = $this.closest('.category-item');
      var $others = $('.category-item').not($item);

      hoverTimeout = clearTimeout(hoverTimeout);
      $item.removeClass('unhover').addClass('hover');
      $others.removeClass('hover').addClass('unhover');

    })
    .on('mouseleave', '.category-item-link', function (e) {

      if (isTransitioningView) {
        return;
      }

      var $items = $('.category-item');

      $items.removeClass('hover');

      hoverTimeout = clearTimeout(hoverTimeout);
      hoverTimeout = window.setTimeout(function () {
        $items.removeClass('unhover');
      }, 200);

    })
    .on('click', '.action-main', showMain)
    .on('click', '.action-info', toggleInfo)
    .on('click', '.category-item-link', showCategory)
    .on('click', '.category-article:not(.active)', showArticle);

  }

  function initMain(callback) {

    // Generate content.
    var $content = $(render('main'));
    var $items = $content.find('.category-item-link');
    var itemsLength = $items.length;
    var animData = [];
    var itemsDone = palikka.defer();
    var containerDone = palikka.defer();

    // Add content to DOM.
    $mainViewContainer.html($content);

    // Setup elements for animation.
    $items.each(function () {

      // Set element's position.
      var matrix = snabbt.createMatrix();
      var startPosition = [0, 0, _.random(-1500, 1000)];
      matrix.translate(startPosition[0], startPosition[1], startPosition[2]);
      snabbt.setElementTransform(this, matrix);

      // Hide element.
      $(this).css('opacity', 0);

      // Prepare element's text content form animation.
      createWords($(this).find('.category-item-td'));

      // Setup item's animation data.
      animData.push({
        elem: this,
        position: startPosition
      });

    });

    // Activate the view.
    $mainView.addClass('active');

    // Start the container animation.
    snabbt($mainViewContainer.get(0), {
      fromPosition: [0, 0, -2000],
      position: [0, 0, 0],
      fromRotation: [-0.24434609528, -0.97738438112, 0],
      rotation: [0, 0, 0],
      duration: 3000,
      perspective: 1000,
      easing: 'easeOut',
      allDone: function () {
        containerDone.resolve();
      }
    });

    // Start the item animations.
    _.forEach(_.shuffle(animData), function (data, i) {
      snabbt(data.elem, {
        fromOpacity: 0,
        opacity: 1,
        fromPosition: data.position,
        position: [0, 0, 0],
        delay: i * ((3000 - 400) / itemsLength),
        duration: 400,
        easing: 'ease',
        allDone: function () {
          if (i === itemsLength - 1) {
            window.setTimeout(function () {
              animateWords($items, function () {
                removeWords($items.find('.category-item-td'));
                itemsDone.resolve();
              });
            }, 100);
          }
        }
      });
    });

    // Start the header animation.
    snabbt($header.get(0), {
      fromRotation: [0.24434609528, 0.97738438112, 0],
      rotation: [0, 0, 0],
      fromPosition: [0, -$header.height(), 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      perspective: 1000,
      delay: 2000,
      duration: 1000,
      easing: 'easeOut',
      allDone: function () {
        snabbt($actionInfo.get(0), {
          fromOpacity: 0,
          opacity: 1,
          fromPosition: [$actionInfo.width(), 0, 0],
          position: [0, 0, 0],
          duration: 400,
          easing: 'spring'
        });
      }
    });

    // Call the final callback.
    if (typeof callback === 'function') {
      palikka.when([itemsDone, containerDone]).then(callback);
    }

  }

  function showCategory() {

    if (isTransitioningView || !isMain) {
      return;
    }

    // Setup states.
    isMain = false;
    isTransitioningView = true;

    // Get items and prepare data.
    var $targetLink = $(this);
    var $targetItem = $targetLink.closest('.category-item');
    var $categoryItems = $('.category-item');
    var $categoryLinks = $('.category-item-link');
    var $otherItems = $categoryItems.not($targetItem);
    var $otherLinks = $categoryLinks.not($targetLink);
    var categoryId = parseInt($targetItem.attr('data-id'));
    var articleId = parseInt($targetItem.attr('data-article'));
    var animDeferreds = [palikka.defer(), palikka.defer(), palikka.defer()];

    // Set active cateogry/article data.
    activeCategory = categoryId;
    activeArticle = articleId;

    // Add content to DOM.
    $articleViewContainer.html(render('category', categoryId, articleId));

    // Get article content data.
    var $categoryInfo = $('.category-info');
    var $categoryArticles = $('.category-articles');
    var $categoryArticlesItems = $categoryArticles.find('.category-article');
    var $articleDetail = $('.category-article-detail');

    // Prepare the article view for animations.
    $categoryInfo.children().css('opacity', 0);
    $categoryArticlesItems.css('opacity', 0);
    $articleDetail.css('opacity', 0);

    // Setup non-target cateogries for animation.
    $otherItems
    .css('opacity', $otherItems.first().css('opacity'))
    .css('transform', $otherItems.first().css('transform'))
    .css('transition', 'none');

    // Remove hover and unhonver classes.
    hoverTimeout = clearTimeout(hoverTimeout);
    $categoryItems.removeClass('hover unhover');

    // Hide all categories except the target category.
    snabbt(_.shuffle($otherLinks.get()), {
      fromOpacity: 1,
      opacity: 0,
      fromScale: [1, 1],
      scale: [0, 0],
      delay: function (i) { return i * 30; },
      duration: 300,
      easing: 'easeOut',
      allDone: function () {
        animDeferreds[0].resolve();
      }
    });

    palikka.defer(function (resolve) {

      if (parseFloat($targetItem.css('opacity')) !== 1) {
        $targetItem.get(0).addEventListener(transitionend, resolve, false);
      }
      else {
        resolve();
      }

    }).then(function () {

      // Mark the target item as active.
      $targetItem.addClass('active');

      // Get data for target link animation.
      var currentGBCR = $targetLink.get(0).getBoundingClientRect();
      var currentWidth = $targetLink.outerWidth();
      var currentHeight = $targetLink.outerHeight();
      var targetGBCR = $categoryInfo.get(0).getBoundingClientRect();
      var targetWidth = $categoryInfo.outerWidth();
      var targetHeight = $categoryInfo.outerHeight();
      var moveX = targetGBCR.left - currentGBCR.left;
      var moveY = targetGBCR.top - currentGBCR.top;

      // Animate target category into correct position.
      snabbt($targetLink.get(0), {
        fromWidth: currentWidth,
        width: targetWidth,
        fromHeight: currentHeight,
        height: targetHeight,
        fromRotation: [0, 0, 0],
        rotation: [Math.PI, 0, 0],
        fromPosition: [0, 0, 0],
        position: [moveX, moveY, 0],
        perspective: 1000,
        duration: 500,
        easing: 'ease',
        allDone: function() {

          // Switch views.
          $mainView.removeClass('active');
          $articleView.addClass('active');

          // Show back button.
          snabbt($actionMain.get(0), {
            fromOpacity: 0,
            opacity: 1,
            fromPosition: [-$actionMain.width(), 0, 0],
            position: [0, 0, 0],
            duration: 400,
            easing: 'spring'
          });

          // Animate categoryh info content into view.
          snabbt($categoryInfo.children().get(), {
            fromOpacity: 0,
            opacity: 1,
            duration: 300,
            easing: 'ease',
            allDone: function () {
              animDeferreds[1].resolve();
            }
          });

          // Animate category articles into view.
          snabbt($categoryArticlesItems.get(), {
            fromOpacity: 0,
            opacity: 1,
            fromPosition: [0, 100, 0],
            position: [0, 0, 0],
            delay: function (i) { return i * 30; },
            duration: 200,
            easing: 'ease'
          });

          // Animate article detail into view.
          snabbt($articleDetail.get(), {
            fromOpacity: 0,
            opacity: 1,
            fromPosition: [$articleDetail.width(), 0, 0],
            position: [0, 0, 0],
            delay: 100,
            duration: 400,
            easing: 'easeOut',
            allDone: function () {
              animDeferreds[2].resolve();
            }
          });

        }

      });

    });

    palikka.when(animDeferreds).then(function () {

      // Remove all animation related inline styles.
      $mainView
      .add($categoryItems)
      .add($categoryLinks)
      .add($articleView)
      .add($articleDetail)
      .add($categoryInfo.children())
      .add($categoryArticles)
      .add($articleDetail)
      .css({
        transition: '',
        transform: '',
        opacity: '',
        zIndex: '',
        width: '',
        height: ''
      });

      // Show articles list scrollbar.
      $categoryArticles.addClass('scrollbar-visible');

      // Transition done, booyah!
      isTransitioningView = false;

    });

  }

  function showMain() {

    if (isTransitioningView || isMain) {
      return;
    }

    // Setup states.
    isMain = true;
    isTransitioningView = true;

    // Reset categories view content.
    $mainViewContainer.html(render('main'));

    // Get data.
    var $categoryItems = $('.category-item');
    var $categoryLinks = $('.category-item-link');
    var $targetItem = $categoryItems.filter('[data-id="' + activeCategory + '"]');
    var $targetLink = $targetItem.find('.category-item-link');
    var $otherItems = $categoryItems.not($targetItem);
    var $otherLinks = $categoryLinks.not($targetLink);
    var animDeferreds = [palikka.defer(), palikka.defer(), palikka.defer(), palikka.defer()];

    // Get article content data.
    var $categoryInfo = $('.category-info');
    var $categoryArticles = $('.category-articles');
    var $articleDetail = $('.category-article-detail');

    // Get target items position data for animating the category info.
    var currentGBCR = $categoryInfo.get(0).getBoundingClientRect();
    var currentWidth = $categoryInfo.outerWidth();
    var currentHeight = $categoryInfo.outerHeight();
    var targetGBCR = $targetLink.get(0).getBoundingClientRect();
    var targetWidth = $targetLink.outerWidth();
    var targetHeight = $targetLink.outerHeight();
    var moveX = targetGBCR.left - currentGBCR.left;
    var moveY = targetGBCR.top - currentGBCR.top;

    // Setup items for animation.
    $categoryInfo.addClass('flip-back').css('zIndex', 2);
    $otherLinks.css('opacity', 0);
    $targetLink.children().css('opacity', 0);

    // Hide back button.
    snabbt($actionMain.get(0), {
      fromOpacity: 1,
      opacity: 0,
      fromPosition: [0, 0, 0],
      position: [-$actionMain.width(), 0, 0],
      duration: 400,
      easing: 'easeIn',
      allDone: function () {
        $actionMain.get(0).style.display = 'none';
        $actionMain.get(0).offsetHeight;
        $actionMain.get(0).style.display = '';
      }
    });

    // Animate category articles and article detail out of view.
    snabbt($articleDetail.get().concat($categoryArticles.get()), {
      fromOpacity: 1,
      opacity: 0,
      fromPosition: [0, 0, 0],
      position: [$articleDetail.width(), 0, 0],
      delay: function (i) { return i * 100 },
      duration: 400,
      easing: 'easeIn',
      allDone: function () {
        animDeferreds[0].resolve();
      }
    });

    // Fade out category info content.
    snabbt($categoryInfo.children().get(), {
      fromOpacity: 1,
      opacity: 0,
      duration: 300,
      easing: 'ease',
      allDone: function () {
        animDeferreds[1].resolve();
      }
    });

    // Flip category info to target category's place.
    snabbt($categoryInfo.get(0), {
      fromWidth: currentWidth,
      width: targetWidth,
      fromHeight: currentHeight,
      height: targetHeight,
      fromRotation: [0, 0, 0],
      rotation: [Math.PI, 0, 0],
      fromPosition: [0, 0, 0],
      position: [moveX, moveY, 0],
      perspective: 1000,
      duration: 500,
      easing: 'ease',
      allDone: function() {

        // Switch the views.
        $articleView.removeClass('active');
        $mainView.addClass('active');

        // Fade in category content.
        snabbt($targetLink.children().get(), {
          fromOpacity: 0,
          opacity: 1,
          duration: 300,
          easing: 'ease',
          allDone: function () {
            animDeferreds[2].resolve();
          }
        });

        // Hide all categories except the target category.
        snabbt(_.shuffle($otherLinks.get()), {
          fromOpacity: 0,
          opacity: 1,
          fromScale: [0, 0],
          scale: [1, 1],
          delay: function (i) { return i * 30; },
          duration: 300,
          easing: 'easeOut',
          allDone: function () {
            animDeferreds[3].resolve();
          }
        });

      }
    });

    palikka.when(animDeferreds).then(function () {

      // Empty container.
      $articleViewContainer.empty();

      // Transition done, boom!
      isTransitioningView = false;

    });

  }

  function showArticle() {

    // Get data.
    var $link = $(this);
    var articleId = parseInt($link.attr('data-id'));
    var $articleDetail = $('.category-article-detail');

    // Update currently active article.
    activeArticle = articleId;

    // Activate link.
    $link.addClass('active').siblings('.active').removeClass('active');

    // Update article detail content.
    $articleDetail.html($(render('article', articleId)).html());

  }

  function toggleInfo() {

    if (!$info.hasClass('animating')) {
      if (!$info.hasClass('active')) {
        showInfo();
      }
      else {
        hideInfo();
      }
    }

  }

  function showInfo () {

    var actionInfoWidth = $actionInfo.width();
    var infoWidth = $info.width();

    $info.addClass('animating');

    snabbt($actionInfo.get(0), {
      fromOpacity: 1,
      opacity: 0,
      fromRotation: [0, 0, 0],
      rotation: [0, 0, Math.PI],
      opacity: 0,
      fromPosition: [0, 0, 0],
      position: [actionInfoWidth, 0, 0],
      duration: 150,
      easing: 'ease',
      allDone: function () {

        $actionInfo.addClass('active');
        $actionInfo.get(0).style.display = 'none';
        $actionInfo.get(0).offsetHeight;
        $actionInfo.get(0).style.display = '';

        snabbt($info.get(0), {
          fromPosition: [infoWidth, 0, 0],
          position: [0, 0, 0],
          duration: 300,
          easing: 'easeOut',
          allDone: function () {
            $info
            .addClass('active')
            .removeClass('animating')
            .css('transform', '');
          }
        });

      }
    }).snabbt({
      fromOpacity: 0,
      opacity: 1,
      fromRotation: [0, 0, Math.PI],
      rotation: [0, 0, 0],
      fromPosition: [actionInfoWidth, 0, 0],
      position: [0, 0, 0],
      duration: 300,
      easing: 'ease'
    });

  }

  function hideInfo () {

    var actionInfoWidth = $actionInfo.width();
    var infoWidth = $info.width();

    $info.addClass('animating');

    snabbt($actionInfo.get(0), {
      fromOpacity: 1,
      opacity: 0,
      fromRotation: [0, 0, 0],
      rotation: [0, 0, Math.PI],
      opacity: 0,
      fromPosition: [0, 0, 0],
      position: [actionInfoWidth, 0, 0],
      duration: 300,
      easing: 'ease',
      allDone: function () {

        $actionInfo.removeClass('active');
        $actionInfo.get(0).style.display = 'none';
        $actionInfo.get(0).offsetHeight;
        $actionInfo.get(0).style.display = '';

      }
    }).snabbt({
      fromOpacity: 0,
      opacity: 1,
      fromRotation: [0, 0, Math.PI],
      rotation: [0, 0, 0],
      fromPosition: [actionInfoWidth, 0, 0],
      position: [0, 0, 0],
      duration: 150,
      easing: 'ease'
    });

    snabbt($info.get(0), {
      fromPosition: [0, 0, 0],
      position: [infoWidth, 0, 0],
      duration: 300,
      easing: 'easeIn',
      allDone: function () {
        $info
        .removeClass('active')
        .removeClass('animating')
        .css('transform', '');
      }
    });

  }

  function hoverCheck() {

    var $target = $('.category-item-link:hover');
    if ($target.length) {
      $target.trigger('mouseenter');
    }

  }

});

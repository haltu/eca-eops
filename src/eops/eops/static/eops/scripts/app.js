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
.define(['jQuery', '_', 'snabbt', 'Hogan', 'HUSL', 'tinycolor'], function () {

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
    connections: Hogan.compile(document.getElementById('tpl-view-main').innerHTML),
    category: Hogan.compile(document.getElementById('tpl-view-category').innerHTML),
    article: Hogan.compile(document.getElementById('tpl-article').innerHTML)
  };

})
.define('app.render', ['_', 'app.data', 'app.templates', 'app.color'], function (_, data, tpl, color) {

  // USAGE
  // render('main');
  // render('category', catId, articleId);
  // render('article', articleId);

  return function (type, arg1, arg2) {

    var maxCategories = 16;
    var maxConnections = 12;
    var template = tpl[type];

    // Render main view.
    if (type === 'main') {

      var tplData = _.merge({}, {
        categories: _.filter(_.values(data.categories), function isTop(category) {
          return _.indexOf(data.top, category.id) !== -1;
        }).slice(0, maxCategories)
      });

      _.forEach(tplData.categories, colorizeCategory);

      return template.render(tplData);

    }

    // Render category connections view.
    else if (type === 'connections') {

      var category = _.clone(data.categories[arg1]);
      var connections = category.connections.slice(0, maxConnections);
      var items = _.map(connections, function getCategory(categoryId) { return data.categories[categoryId]; });
      var spacingItem = {type: 'space'};
      var placeholderItem = {type: 'placeholder'};

      category.type = 'main-category';

      items.length = maxConnections;
      items = _.map(items, function fillUndefined(item) { return item || placeholderItem; });
      items.splice(5, 0, category, spacingItem);     // middle tiles on second row (6-7)
      items.splice(9, 0, spacingItem, spacingItem);  // middle tiles on third row (10-11)

      var tplData = _.merge({}, {
        categories: items
      });

      _.forEach(tplData.categories, colorizeCategory);

      return template.render(tplData);

    }

    // Render category articles view.
    else if (type === 'category') {

      var tplData = _.merge({}, {
        categories: _.values(data.categories),
        category: data.categories[arg1],
        article: data.articles[arg2]
      });

      _.forEach(tplData.categories, colorizeCategory);
      colorizeCategory(tplData.category);

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

    function colorizeCategory(category) {

      // if (category.cluster) {
      //   category.color = color(category.cluster);
      if (category.title) {
        category.color = color(category.title);
      }

    }

  };

})
.define('app.color', ['HUSL', 'tinycolor'], function (HUSL, tinycolor) {

  var palette = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'];
  var palette2 = [
    '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#9fa8da',                                  '#80cbc4', '#a5d6a7',                                  '#ffcc80', '#ffab91',
    '#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6',                       '#4db6ac', '#81c784', '#aed581',            '#ffd54f', '#ffb74d', '#ff8a65',
    '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#5c6bc0', '#42a5f5', '#29b6f6',            '#26a69a', '#66bb6a', '#9ccc65',            '#ffca28', '#ffa726', '#ff7043',
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A',            '#FFC107', '#FF9800', '#FF5722',
    '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#1e88e5', '#039be5', '#00acc1', '#00897b', '#43a047', '#7cb342',            '#ffb300', '#fb8c00', '#f4511e',
    '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c', '#689f38', '#fbc02d', '#ffa000', '#f57c00', '#e64a19',
    '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#283593', '#1565c0', '#0277bd', '#00838f', '#00695c', '#2e7d32', '#558b2f', '#f9a825', '#ff8f00', '#ef6c00', '#d84315',
    '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#1a237e', '#0d47a1', '#01579b', '#006064', '#004d40', '#1b5e20', '#33691e', '#f57f17', '#ff6f00', '#e65100', '#bf360c'
  ];
  var palette2 = [
    '#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6',                       '#4db6ac', '#81c784',                                  '#ffb74d', '#ff8a65', '#90a4ae',
    '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#5c6bc0', '#42a5f5', '#29b6f6',            '#26a69a', '#66bb6a', '#9ccc65',            '#ffca28', '#ffa726', '#ff7043', '#78909c',
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A',            '#FFC107', '#FF9800', '#FF5722', '#607d8b',
    '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#1e88e5', '#039be5', '#00acc1', '#00897b', '#43a047', '#7cb342',            '#ffb300', '#fb8c00', '#f4511e', '#546e7a',
    '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c', '#689f38',            '#ffa000', '#f57c00', '#e64a19', '#455a64',
    '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#283593', '#1565c0', '#0277bd', '#00838f', '#00695c', '#2e7d32', '#558b2f', '#f9a825', '#ff8f00', '#ef6c00', '#d84315', '#37474f',
    '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#1a237e', '#0d47a1', '#01579b', '#006064', '#004d40', '#1b5e20', '#33691e', '#f57f17', '#ff6f00', '#e65100', '#bf360c', '#263238'
  ];
  var paletteLength = palette.length;

  function colorFromString(string) {

    var ratio = 0.618033988749895;
    var hue = 0;
    var paletteIndex;
    var colorVariation;

    hue += ratio * hashCode(string);
    hue %= 1;

    // Color variations

    colorVariation = 5;

    if (colorVariation == 1) {
      // Color from palette
      paletteIndex = Math.round(hue * (paletteLength - 1));
      return palette[paletteIndex];
    }
    else if (colorVariation == 2) {
      // Color from palette
      paletteIndex = Math.round(hue * (palette2.length - 1));
      return palette2[paletteIndex];
    }
    else if (colorVariation == 3) {
      // Raw hue from 0 to 360 using HUSL to maintain legibility
      hue = Math.round(hue * 360);
      return HUSL.toHex(hue, 100, 60);
    }
    else if (colorVariation == 4) {
      // Raw hue from 0 to 360
      hue = Math.round(hue * 360);
      return 'hsl(' + hue + ', 100%, 60%)';
    }
    else if (colorVariation == 5) {
      // Raw hue from 0 to 360 using HUSL + WCAG 1.0 brightness
      var color, colorHUSL, brightness;
      hue = Math.round(hue * 360);
      color = tinycolor('hsl(' + hue + ', ' + 100 + '%, ' + 60 + '%)');
      colorHUSL = tinycolor(HUSL.toHex(hue, 100, 60));
      brightness = color.getBrightness() / 255;
      brightness = Math.max(brightness - 0.3, 0);
      color._r = color._r - (color._r - colorHUSL._r) * brightness;
      color._g = color._g - (color._g - colorHUSL._g) * brightness;
      color._b = color._b - (color._b - colorHUSL._b) * brightness;
      var colorString = color.toHexString();
      color.setAlpha(0.80);
      var colorStringTrans = color.toRgbString();
      return {
        transparent: colorStringTrans,
        toString: function toString() {
          return colorString;
        }
      };
    }

  }

  // hashcode.js | MIT (c) Stuart Bannerman 2013 | github.com/stuartbannerman/hashcode
  function hashCode(string) {

    var string = string.toString();
    var stringLength = string.length;
    var hash = 0;
    var i;

    for (i = 0; i < stringLength; i++) {
      hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
    }

    return hash >>> 0;

  }

  return function (string) {

    return colorFromString(string);

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
  var $actionBack = $('.action-back');
  var $info = $('#info');
  var $mainView = $('#view-main');
  var $mainViewContainer = $('#view-main-container');
  var $articleView = $('#view-article');
  var $articleViewContainer = $('#view-article-container');
  var $connectionsView = $('#view-connections');
  var $connectionsViewContainer = $('#view-connections-container');

  // State data.
  var activeView = $mainView;
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
    .on('mouseenter', '.category-item:not([data-type="placeholder"], [data-type="space"]) .category-item-link', function (e) {

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
    .on('click', '.action-back', backAction)
    .on('click', '.action-info', toggleInfo)
    .on('click', '#view-main .category-item-link', transitionMainToConnections)
    .on('click', '#view-connections .category-item:not([data-type="main-category"]) .category-item-link', transitionConnectionsToArticles)
    .on('click', '#view-connections .category-item[data-type="main-category"] .category-item-link', transitionConnectionsToArticles)
    .on('click', '.category-article:not(.active)', showArticle);

  }

  function backAction() {

    if (activeView == $connectionsView) {
      transitionConnectionsToMain();
    }
    else if (activeView == $articleView) {
      transitionArticlesToConnections();
    }

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

  function transitionMainToConnections() {

    if (isTransitioningView || activeView == $connectionsView) {
      return;
    }

    // Setup states.
    activeView = $connectionsView;
    isTransitioningView = true;

    // Get items and prepare data.
    var $targetLink = $(this);
    var $targetItem = $targetLink.closest('.category-item');
    var $categoryItems = $mainViewContainer.find('.category-item');
    var $categoryLinks = $mainViewContainer.find('.category-item-link');
    var $otherItems = $categoryItems.not($targetItem);
    var $otherLinks = $categoryLinks.not($targetLink);
    var categoryId = parseInt($targetItem.attr('data-id'));
    var animDeferreds = [palikka.defer(), palikka.defer()];

    // Set active cateogry/article data.
    activeCategory = categoryId;

    // Add content to DOM.
    $connectionsViewContainer.html(render('connections', categoryId));

    // Get article content data.
    var $connectionsTargetLink = $connectionsViewContainer.find('.category-item[data-type="main-category"] .category-item-link');
    var $connectionsTargetItem = $connectionsTargetLink.closest('.category-item');
    var $connectionsOtherLinks = $connectionsViewContainer.find('.category-item:not([data-type="space"]) .category-item-link').not($connectionsTargetLink);

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

      // Get data for target link animation.
      var currentBoundingRect = $targetLink.get(0).getBoundingClientRect();
      var targetBoundingRect = $connectionsTargetLink.get(0).getBoundingClientRect();
      var otherLinksData = [];
      var otherLinksElements = $connectionsOtherLinks.get();
      var viewWidth = activeView.outerWidth();
      var viewHeight = activeView.outerHeight();
      var viewPosX = viewWidth * 0.47;
      var viewPosY = viewHeight * 0.47;
      var targetLinkPos = {
        x: viewPosX - currentBoundingRect.left - currentBoundingRect.width / 2,
        y: viewPosY - currentBoundingRect.top - currentBoundingRect.height / 2
      };
      var connectionsTargetLinkPos = {
        x: viewPosX - targetBoundingRect.left - targetBoundingRect.width / 2,
        y: viewPosY - targetBoundingRect.top - targetBoundingRect.height / 2
      };

      $(otherLinksElements).each(function (index, element) {

        var boundingRect = element.getBoundingClientRect();
        otherLinksData[index] = {};
        otherLinksData[index].boundingRect = boundingRect;
        otherLinksData[index].animPos = {
          x: viewPosX - boundingRect.left - boundingRect.width / 2,
          y: viewPosY - boundingRect.top - boundingRect.height / 2,
        };
        element.style.zIndex = otherLinksElements.length - index;

      });

      $targetLink.css({
        zIndex: 20
      });

      // Animate target category into correct position.
      snabbt($targetLink.get(0), {
        fromRotation: [0, 0, 0],
        rotation: [degToRad(-30), degToRad(10), 0],
        fromPosition: [0, 0, 0],
        fromScale: [1, 1],
        scale: [1.01, 1.01],
        position: [targetLinkPos.x, targetLinkPos.y, 100],
        duration: 500,
        easing: 'easeOut',
        allDone: function () {

          $mainView.removeClass('active');
          $connectionsView.addClass('active');
          $connectionsTargetItem
          .css({
            transition: 'none',
            zIndex: 20
          })
          .attr('data-type', '');

          snabbt($connectionsTargetLink.get(0), {
            fromRotation: [degToRad(-30), degToRad(10), 0],
            rotation: [0, 0, 0],
            fromScale: [1.01, 1.01],
            scale: [1, 1],
            fromPosition: [connectionsTargetLinkPos.x + targetBoundingRect.width / 2 + 10, connectionsTargetLinkPos.y + targetBoundingRect.height / 2 + 10, 100],
            position: [targetBoundingRect.width / 2 + 10, targetBoundingRect.height / 2 + 10, 0],
            delay: $connectionsOtherLinks.get().length * 50 * 1.5,
            duration: 500,
            easing: 'easeIn',
            allDone: function () {
              $connectionsTargetItem
              .attr('data-type', 'main-category');
              $connectionsTargetLink.css({
                transition: '',
                transform: '',
                opacity: '',
                zIndex: '',
                width: '',
                height: ''
              });
              setTimeout(function () {
                animDeferreds[1].resolve();
              }, 10);
            }
          });

          snabbt(otherLinksElements, {
            fromRotation: [degToRad(-30), degToRad(10), 0],
            rotation: [degToRad(-30), degToRad(10), 0],
            fromOpacity: .3,
            opacity: .3,
            fromPosition: function (i, total) {
              return [otherLinksData[i].animPos.x, otherLinksData[i].animPos.y, 100];
            },
            position: function (i, total) {
              return [otherLinksData[i].animPos.x + (i + 1) * 10, otherLinksData[i].animPos.y + (i + 1) * 10, 100 - (i + 1) * 10];
            },
            duration: 250,
            easing: 'spring',
            springConstant: 0.7,
            springDeceleration: 0.7,
            allDone: function () {

              snabbt(otherLinksElements, {
                fromRotation: [degToRad(-30), degToRad(10), 0],
                rotation: [0, 0, 0],
                opacity: 1,
                fromPosition: function (i, total) {
                  return [otherLinksData[i].animPos.x + (i + 1) * 10, otherLinksData[i].animPos.y + (i + 1) * 10, 100 - (i + 1) * 10];
                },
                position: [0, 0, 0],
                delay: function (i, total) {
                  return (total - i - 1) * 50;
                },
                duration: 250,
                easing: 'easeIn'
              });

            }
          });

          // Show back button.
          snabbt($actionBack.get(0), {
            fromOpacity: 0,
            opacity: 1,
            fromPosition: [-$actionBack.width(), 0, 0],
            position: [0, 0, 0],
            duration: 400,
            easing: 'spring'
          });

        }

      });

    });

    palikka.when(animDeferreds).then(function () {

      // Remove all animation related inline styles.
      $mainView
      .add($otherItems)
      .add($connectionsTargetItem)
      .add($connectionsTargetLink)
      .add($connectionsOtherLinks)
      .css({
        transition: '',
        transform: '',
        opacity: '',
        zIndex: '',
        width: '',
        height: ''
      });

      // Transition done, booyah!
      isTransitioningView = false;

    });

  }

  function transitionConnectionsToConnections() {

    console.log('Moro!');

  }

  function transitionConnectionsToArticles() {

    if (isTransitioningView || activeView == $articleView) {
      return;
    }

    // Setup states.
    activeView = $articleView;
    isTransitioningView = true;

    // Get items and prepare data.
    var $targetLink = $(this);
    var $targetItem = $targetLink.closest('.category-item');
    var $categoryItems = $connectionsViewContainer.find('.category-item');
    var $categoryLinks = $connectionsViewContainer.find('.category-item-link');
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
      var currentBoundingRect = $targetLink.get(0).getBoundingClientRect();
      var currentWidth = $targetLink.outerWidth();
      var currentHeight = $targetLink.outerHeight();
      var targetBoundingRect = $categoryInfo.get(0).getBoundingClientRect();
      var targetWidth = $categoryInfo.outerWidth();
      var targetHeight = $categoryInfo.outerHeight();
      var moveX = targetBoundingRect.left - currentBoundingRect.left;
      var moveY = targetBoundingRect.top - currentBoundingRect.top;

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
          $connectionsView.removeClass('active');
          $articleView.addClass('active');

          // Animate category info content into view.
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
      $connectionsView
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

  function transitionConnectionsToMain() {

    if (isTransitioningView || activeView == $mainView) {
      return;
    }

    // Setup states.
    activeView = $mainView;
    isTransitioningView = true;

    // Reset categories view content.
    $mainViewContainer.html(render('main'));

    // Get mainview items items
    var $categoryItems = $mainViewContainer.find('.category-item');
    var $categoryLinks = $mainViewContainer.find('.category-item-link');
    var $targetItem = $categoryItems.filter('[data-id="' + activeCategory + '"]');
    var $targetLink = $targetItem.find('.category-item-link');
    var $otherItems = $categoryItems.not($targetItem);
    var $otherLinks = $categoryLinks.not($targetLink);
    var categoryId = parseInt($targetItem.attr('data-id'));

    // Get connectionsview items items
    var $currentCategoryItems = $connectionsViewContainer.find('.category-item');
    var $currentCategoryLinks = $connectionsViewContainer.find('.category-item-link');
    var $currentItem = $currentCategoryItems.filter('[data-type="main-category"]');
    var $currentLink = $currentItem.find('.category-item-link');
    var $currentOtherItems = $currentCategoryItems.not($currentItem);
    var $currentOtherLinks = $currentCategoryLinks.not($currentLink);

    // Get target items position data for animating the category info.
    var animDeferreds = [palikka.defer()];
    var currentBoundingRect = $currentLink.get(0).getBoundingClientRect();
    var currentOtherLinksData = [];
    var currentLinkOffset = {
      x: currentBoundingRect.width / 2 + 10,
      y: currentBoundingRect.height / 2 + 10
    };
    if ($targetLink.length) {
      var targetBoundingRect = $targetLink.get(0).getBoundingClientRect();
      var targetPos = {
        x: targetBoundingRect.left - currentBoundingRect.left + currentLinkOffset.x,
        y: targetBoundingRect.top - currentBoundingRect.top + currentLinkOffset.y
      };
    }

    $currentOtherLinks.each(function (index, element) {

      var boundingRect = element.getBoundingClientRect();
      currentOtherLinksData[index] = {};
      currentOtherLinksData[index].boundingRect = boundingRect;
      currentOtherLinksData[index].animPos = {
        x: currentBoundingRect.left - boundingRect.left,
        y: currentBoundingRect.top - boundingRect.top,
      };

    });

    // Remove hover and unhonver classes.
    hoverTimeout = clearTimeout(hoverTimeout);
    $currentCategoryItems.removeClass('hover unhover');

    // Hide back button.
    snabbt($actionBack.get(0), {
      fromOpacity: 1,
      opacity: 0,
      fromPosition: [0, 0, 0],
      position: [-$actionBack.width(), 0, 0],
      duration: 400,
      easing: 'easeIn',
      allDone: function () {
        $actionBack.get(0).style.display = 'none';
        $actionBack.get(0).offsetHeight;
        $actionBack.get(0).style.display = '';
      }
    });

    $currentItem.css({
      transition: 'none',
      zIndex: 20
    })

    // Hide all categories except the target category.
    snabbt($currentOtherLinks.get(), {
      fromOpacity: 1,
      opacity: 0,
      fromScale: [1, 1],
      scale: [0.7, 0.7],
      fromPosition: [0, 0, 0],
      position: function (i, total) {
        return [currentOtherLinksData[i].animPos.x, currentOtherLinksData[i].animPos.y, 0];
      },
      delay: function (i, total) {
        return i * 30;
      },
      duration: 300,
      easing: 'easeOut',
    });

    if ($targetItem.length) {
      $currentItem.attr('data-type', '');
      snabbt($currentItem.get(0), {
        fromPosition: [currentLinkOffset.x, currentLinkOffset.y, 0],
        position: [targetPos.x, targetPos.y, 0],
        delay: 300 + ($currentOtherLinks.get().length - 5) * 30,
        duration: 500,
        easing: 'ease',
        allDone: animateMainViewIn
      });

    }
    else {
      $currentItem.attr('data-type', '');
      snabbt($currentItem.get(0), {
        fromPosition: [currentLinkOffset.x, currentLinkOffset.y, 0],
        position: [-currentBoundingRect.width / 2, -currentBoundingRect.height / 2, 0],
        fromOpacity: 1,
        opacity: 0,
        fromScale: [1, 1],
        scale: [0, 0],
        delay: 300 + ($currentOtherLinks.get().length - 5) * 30,
        duration: 300,
        easing: 'easeIn',
        allDone: animateMainViewIn
      });
    }

    function animateMainViewIn() {

      // Switch the views.
      $connectionsView.removeClass('active');
      $mainView.addClass('active');

      // Animate in all categories except the target category.
      snabbt(_.shuffle($otherLinks.get()), {
        fromOpacity: 0,
        opacity: 1,
        fromScale: [0, 0],
        scale: [1, 1],
        delay: function (i) { return i * 30; },
        duration: 300,
        easing: 'easeOut',
        allDone: function () {
          animDeferreds[0].resolve();
        }
      });

    }

    palikka.when(animDeferreds).then(function () {

      // Remove all animation related inline styles.
      $mainView
      .add($otherLinks)
      .css({
        transition: '',
        transform: '',
        opacity: '',
        zIndex: '',
        width: '',
        height: ''
      });

      isTransitioningView = false;

    });

  }

  function transitionMainToArticles() {

    if (isTransitioningView || activeView == $articleView) {
      return;
    }

    // Setup states.
    activeView = $articleView;
    isTransitioningView = true;

    // Get items and prepare data.
    var $targetLink = $(this);
    var $targetItem = $targetLink.closest('.category-item');
    var $categoryItems = $mainViewContainer.find('.category-item');
    var $categoryLinks = $mainViewContainer.find('.category-item-link');
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
      var currentBoundingRect = $targetLink.get(0).getBoundingClientRect();
      var currentWidth = $targetLink.outerWidth();
      var currentHeight = $targetLink.outerHeight();
      var targetBoundingRect = $categoryInfo.get(0).getBoundingClientRect();
      var targetWidth = $categoryInfo.outerWidth();
      var targetHeight = $categoryInfo.outerHeight();
      var moveX = targetBoundingRect.left - currentBoundingRect.left;
      var moveY = targetBoundingRect.top - currentBoundingRect.top;

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

          // Animate category info content into view.
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

  function transitionArticlesToConnections() {

    if (isTransitioningView || activeView == $connectionsView) {
      return;
    }

    // Setup states.
    activeView = $connectionsView;
    isTransitioningView = true;

    // Reset categories view content.
    $connectionsViewContainer.html(render('connections', activeCategory));

    // Get data.
    var $categoryItems = $connectionsViewContainer.find('.category-item');
    var $categoryLinks = $connectionsViewContainer.find('.category-item-link');
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
    var currentBoundingRect = $categoryInfo.get(0).getBoundingClientRect();
    var currentWidth = $categoryInfo.outerWidth();
    var currentHeight = $categoryInfo.outerHeight();
    var targetBoundingRect = $targetLink.get(0).getBoundingClientRect();
    var targetWidth = $targetLink.outerWidth();
    var targetHeight = $targetLink.outerHeight();
    var moveX = targetBoundingRect.left - currentBoundingRect.left;
    var moveY = targetBoundingRect.top - currentBoundingRect.top;

    // Setup items for animation.
    $categoryInfo.addClass('flip-back').css('zIndex', 2);
    $otherLinks.css('opacity', 0);
    $targetLink.children().css('opacity', 0);

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
        $connectionsView.addClass('active');

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

        // Animate in all categories except the target category.
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

  function transitionArticlesToMain() {

    if (isTransitioningView || activeView == $mainView) {
      return;
    }

    // Setup states.
    activeView = $mainView;
    isTransitioningView = true;

    // Reset categories view content.
    $mainViewContainer.html(render('main'));

    // Get data.
    var $categoryItems = $mainViewContainer.find('.category-item');
    var $categoryLinks = $mainViewContainer.find('.category-item-link');
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
    var currentBoundingRect = $categoryInfo.get(0).getBoundingClientRect();
    var currentWidth = $categoryInfo.outerWidth();
    var currentHeight = $categoryInfo.outerHeight();
    var targetBoundingRect = $targetLink.get(0).getBoundingClientRect();
    var targetWidth = $targetLink.outerWidth();
    var targetHeight = $targetLink.outerHeight();
    var moveX = targetBoundingRect.left - currentBoundingRect.left;
    var moveY = targetBoundingRect.top - currentBoundingRect.top;

    // Setup items for animation.
    $categoryInfo.addClass('flip-back').css('zIndex', 2);
    $otherLinks.css('opacity', 0);
    $targetLink.children().css('opacity', 0);

    // Hide back button.
    snabbt($actionBack.get(0), {
      fromOpacity: 1,
      opacity: 0,
      fromPosition: [0, 0, 0],
      position: [-$actionBack.width(), 0, 0],
      duration: 400,
      easing: 'easeIn',
      allDone: function () {
        $actionBack.get(0).style.display = 'none';
        $actionBack.get(0).offsetHeight;
        $actionBack.get(0).style.display = '';
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

        // Animate in all categories except the target category.
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

  function degToRad(degrees) {

    return degrees * Math.PI / 180;

  }

});

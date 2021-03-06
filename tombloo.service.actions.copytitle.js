/**
 * Service.Actions.CopyTitle - Tombloo patches
 *
 * ページのタイトルやURLをクリップボードにコピーするだけのパッチ
 *
 * 機能:
 * --------------------------------------------------------------------------
 * [Service Actions Copy Title patch]
 *
 * - ページのタイトルやURLをクリップボードにコピーする
 * - Amazonの長いURLを短くしてコピーする
 *
 * --------------------------------------------------------------------------
 *
 * @version    1.01
 * @date       2012-08-09
 * @author     polygon planet <polygon.planet.aqua@gmail.com>
 *              - Blog    : http://polygon-planet-log.blogspot.com/
 *              - Twitter : http://twitter.com/polygon_planet
 *              - Tumblr  : http://polygonplanet.tumblr.com/
 * @license    Same as Tombloo
 * @updateURL  https://github.com/polygonplanet/tombloo/raw/master/tombloo.service.actions.copytitle.js
 *
 * Tombloo: https://github.com/to/tombloo/wiki
 */
(function(undefined) {


// Define language
const LANG = (function(n) {
    return ((n && (n.language || n.userLanguage     ||
            n.browserLanguage || n.systemLanguage)) ||
            'en').split(/[^a-zA-Z0-9]+/).shift().toLowerCase();
})(navigator);


// UI labels
const LABELS = {
    translate : function(name) {
        return LABELS[name][LANG === 'en' && LANG || 'ja'];
    },
    MENU_TOP : {
        ja : 'クリップボードにコピー',
        en : 'Copy to clipboard'
    },
    MENU_COPY_TITLE : {
        ja : 'このページのタイトルをコピー',
        en : 'Copy the page title'
    },
    MENU_COPY_URL : {
        ja : 'このページのURLをコピー',
        en : 'Copy the page URL'
    },
    MENU_COPY_AMAZON : {
        ja : 'AmazonのURLを短くしてコピー',
        en : 'Copy the short Amazon URL'
    }
};


// メニューを登録
Tombloo.Service.actions.register({
    name : LABELS.translate('MENU_TOP'),
    type : 'context',
    // icon: page_copy.png : http://www.famfamfam.com/
    icon : strip(<>
        data:image/png;base64,
        iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0
        U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIpSURBVDjLddM9aFRBFIbh98zM3WyybnYV
        f4KSQjBJJVZBixhRixSaShtBMKUoWomgnaCxsJdgIQSstE4nEhNREgyoZYhpkogkuMa4/3fuHIu7
        gpLd00wz52POMzMydu/Dy958dMwYioomIIgqDa+VnWrzebNUejY/NV6nQ8nlR4ufXt0fzm2WgxUg
        qBInAWdhemGbpcWNN9/XN27PPb1QbRdgjEhPqap2ZUv5+iOwvJnweT1mT5djZKjI6Ej/udz+wt1O
        JzAKYgWyDjJWyFghmzFsbtcY2gsTJwv09/Vc7RTgAEQgsqAKaoWsM8wu/z7a8B7vA8cHD3Fr+ktF
        gspO3a+vrdVfNEulJ/NT4zWngCBYY1oqSghKI465fvYwW+VAatPX07IZmF7YfrC0uDE8emPmilOF
        kHYiBKxAxhmSRPlZVVa2FGOU2Ad2ap4zg92MDBXJZczFmdflx05VEcAZMGIIClZASdesS2cU/dcm
        4sTBArNzXTcNakiCb3/HLRsn4Fo2qyXh3WqDXzUlcgYnam3Dl4Hif82dbOiyiBGstSjg4majEpl8
        rpCNUQUjgkia0M5GVAlBEBFUwflEv12b/Hig6SmA1iDtzhcsE6eP7LIxAchAtwNVxc1MnhprN/+l
        h0txErxrPZVdFdRDEEzHT6LWpTbtq+HLSDDiOm2o1uqlyOT37bIhHdKaXoL6pqhq24Dzd96/tUYG
        wPSBVv7atFglaFIu5KLuPxeX/xsp7aR6AAAAAElFTkSuQmCC
    </>),
    children : [{
        name  : LABELS.translate('MENU_COPY_TITLE'),
        type  : 'context',
        check : function(ctx) {
            return ctx && ctx.title;
        },
        execute : function(ctx) {
            copyString(ctx.title);
        }
    }, {
        name  : LABELS.translate('MENU_COPY_URL'),
        type  : 'context',
        check : function(ctx) {
            return ctx && ctx.href;
        },
        execute : function(ctx) {
            copyString(ctx.href);
        }
    }, {
        name  : LABELS.translate('MENU_COPY_AMAZON'),
        type  : 'context',
        check : function(ctx) {
            return ctx && ctx.href && /(?:^|\b)amazon\b/i.test(ctx.host);
        },
        execute : function(ctx) {
            let asin = function() {
                    return ctx.document.getElementById('ASIN') ||
                        ctx.document.getElementsByName('ASIN.0')[0] ||
                        {value : ''};
                }().value,
                href = ('' + ctx.href) || '',
                re = /^(https?:\/+[^\/]+\/).*$/,
                url = asin && href.replace(re, '$1dp/' + asin) || 'error';

            copyString(url);
        }
    }]
}, '----');


// -- Helper functions --

function stringify(x, ignoreBoolean) {
  var result = '', c, len = arguments.length;
  if (x !== null) {
    switch (typeof x) {
      case 'string':
      case 'number':
      case 'xml':
          result = x;
          break;
      case 'boolean':
          if (len >= 2 && !ignoreBoolean) {
            result = x;
          } else if (!ignoreBoolean) {
            result = x ? 1 : '';
          }
          break;
      case 'object':
          if (x) {
            // Fixed object valueOf. e.g. new String('hoge');
            c = x.constructor;
            if (c === String || c === Number ||
                (typeof XML !== 'undefined' && c === XML) ||
                (typeof Buffer !== 'undefined' && c === Buffer)) {
              result = x;
            } else if (c === Boolean) {
              if (len >= 2 && !ignoreBoolean) {
                result = x;
              } else if (!ignoreBoolean) {
                result = (x == true) ? 1 : '';
              }
            }
          }
          break;
      default:
          break;
    }
  }
  return result.toString();
}


function strip(s) {
    return stringify(s).replace(/[\s\u00A0\u3000]+/g, '');
}


})();


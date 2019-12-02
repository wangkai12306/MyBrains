/* global hexo */

'use strict';

var pathFn = require('path');
var _ = require('lodash');
var cheerio = require('cheerio');
const escape = require('lodash/escape');
var lunr = require('lunr');

function startsWith(str, start) {
  return str.substring(0, start.length) === start;
}


hexo.extend.helper.register('page_nav', function() {
  const type = this.page.canonical_path.split('/')[0];
  const sidebar = this.theme.sidebar[type];
  const lang = this.page.lang;
  const pagePath = this.path;
  const self = this;
  let pagePaths = {};

  function traverseSideBar(sidebar, sidebarParent, i18nParent) {
    _.each(sidebar, function(val, key) {
      let fullSidebarPathKey = sidebarParent ? sidebarParent + '/' + key : key;
      let fullI18nPathKey = i18nParent ? i18nParent + '.' + key : key;
      if (_.isObject(val) || _.isArray(val)) {
        fullI18nPathKey = (i18nParent ? i18nParent + '.' + key : key) + '.1';
        traverseSideBar(sidebar[key], fullSidebarPathKey, fullI18nPathKey);
      } else {
        let tittle = self.__(`sidebar.${type}.${fullI18nPathKey}`);
        pagePaths[`${lang}/${type}/${fullSidebarPathKey}.html`] = tittle;
      }
    });
  }
  traverseSideBar(sidebar);


  const keys = Object.keys(pagePaths);
  const index = keys.indexOf(pagePath);

  let result = '';

  if (index > 0) {
    const translatedPreviousTitle = pagePaths[keys[index - 1]];
    const prePageLinkLocation = `/${keys[index - 1]}`;
    result += `
        <a href="${this.config.root}${prePageLinkLocation}" class="article-footer-prev" title="${translatedPreviousTitle}">
            <i class="fa fa-chevron-left"></i>
            <span>${this.__('page.prev')}
                <span class="article-pre-title">${translatedPreviousTitle}</span>
            </span>
        </a>`;
  }

  if (index > -1 && index < keys.length - 1) {
    const translatedNextTitle = pagePaths[keys[index + 1]];
    const nextPageLinkLocation = `${this.config.root}${keys[index + 1]}`;
    result += `
        <a href="${nextPageLinkLocation}" class="article-footer-next" title="${translatedNextTitle}">
            <span>${this.__('page.next')}
                <span class="article-next-title">${translatedNextTitle}</span>
            </span>
            <i class="fa fa-chevron-right"></i>
        </a>`;
  }

  return result;
});


hexo.extend.helper.register('doc_sidebar', function(className) {
  let type = this.page.canonical_path.split('/')[0];
  let sidebar = this.theme.sidebar[type];
  let path = pathFn.basename(this.path);
  let pagePath = this.path;
  const lang = this.page.lang;
  let result = '<ol class="sidebar">';
  let self = this;
  let prefix = 'sidebar.' + type + '.';


  // 判断当前所在页面
  let currentSidebarItem;
  if (typeof path !== 'undefined') {
    currentSidebarItem = _.replace(path, '.html', '');
  }

  let navigationPath = [];

  function taverseNavigationPath(tree, path, depth, target) {
    depth++;
    let i = 0;
    const keys = Object.keys(tree);

    while (i < keys.length) {
      let key = keys[i];
      let value = tree[key];
      path[depth - 1] = key;

      if (_.isObject(value) || _.isArray(value)) {
        taverseNavigationPath(value, path, depth, target);
      } else {
        if (key === target) {
          navigationPath = path.slice();
          break;
        }
      }
      i += 1;
    }
  }

  taverseNavigationPath(sidebar, [], 0, currentSidebarItem);


  // https://gist.github.com/tushariscoolster/567c1d22ca8d5498cbc0
  function traverseSideBar(sidebar, result, sidebarParent, i18nParent) {
    if (Object.keys(sidebar).length === 0) {
      return result;
    }
    let output = '';
    _.each(sidebar, function(val, key) {
      let i18nFullPathKey = i18nParent ? i18nParent + '.' + key : key;
      let sidebarFullPathKey = sidebarParent ? sidebarParent + '/' + key : key;

      let sideBarItemClass = 'sidebar-item';
      let caretIconClass = 'fa-caret-right';

      let fullPagePath = `${lang}/${type}/${sidebarFullPathKey}`;
      if (pagePath.startsWith(fullPagePath)) {
        sideBarItemClass += ' open';
        caretIconClass = 'fa-caret-down';
      }


      if (_.isObject(val) || _.isArray(val)) {
        let tittle = self.__(`sidebar.${type}.${i18nFullPathKey}.0`);
        i18nFullPathKey = (i18nParent ? i18nParent + '.' + key : key) + '.1';
        output += `<li class="${sideBarItemClass}">
                        <a class="sidebar-link" href="#">
                          <i class="fa ${caretIconClass}"></i>
                          <span class="sidebar-text">${tittle}</span>
                        </a>
                        <ol>`;
        output += traverseSideBar(sidebar[key], output, sidebarFullPathKey, i18nFullPathKey);
        output += '</ol></li>';
      } else {
        let tittle = self.__(`sidebar.${type}.${i18nFullPathKey}`);
        let itemClass = 'sidebar-link';
        const sidebarItemPath = `${lang}/${type}/${sidebarFullPathKey}.html`;
        if (sidebarItemPath === pagePath) {
          itemClass += ' current';
        }
        output += ` <li class="${sideBarItemClass}">
                         <a class="${itemClass}" href="${self.config.root}${sidebarItemPath}">
                           <span class="sidebar-text">${tittle}</span>
                         </a>
                  </li>`;
      }
    });
    return output;
  }


  result += traverseSideBar(sidebar, 1);
  result += '</ol>';
  return result;
});


hexo.extend.helper.register('header_menu', function(className) {
  const menu = this.theme.menu;
  let result = '';
  const self = this;
  const lang = this.page.lang;
  const isEnglish = lang === 'en';


  function findFirstLeaf(tree, parent) {
    let i = 0;
    let keys = [];
    if (typeof tree !== 'undefined') {
      keys = Object.keys(tree);
    }

    while (i < keys.length) {
      let key = keys[i];
      let value = tree[key];
      i += 1;

      let currentKey = key;
      if (typeof parent !== 'undefined') {
        currentKey = parent + '/' + key;
      }

      if (_.isObject(value) || _.isArray(value)) {
        return findFirstLeaf(value, currentKey);
      }

      if (value == null) {
        return currentKey + '.html';
      }

      if (typeof parent !== 'undefined') {
        return parent + '/' + value;
      }
      return value;
    }
  }

  let firstPages = {};
  for (const title in menu) {
    const firstPage = findFirstLeaf(this.theme.sidebar[title]);
    firstPages[title] = firstPage;
  }

  _.each(menu, function(path, title) {
    if (!isEnglish /* && ~localizedPath.indexOf(title)*/) path = lang + path;
    let translatedTitle = self.__(`menu.${title}`);
    result += `<a href="${self.url_for(path)}${firstPages[title]}" class="${className}-link">${translatedTitle}</a>`;
  });

  return result;
});

hexo.extend.helper.register('canonical_url', function(lang) {
  var path = this.page.canonical_path;
  if (lang && lang !== 'en') path = lang + '/' + path;

  return this.config.url + '/' + path;
});

hexo.extend.helper.register('url_for_lang', function(path) {
  var lang = this.page.lang;
  var url = this.url_for(path);

  if (lang !== 'zh-cn' && url[0] === '/') url = '/' + lang + url;

  return url;
});

hexo.extend.helper.register('raw_link', function(path) {
  return 'http://gitlab.chiefclouds.cn/data-platform/data-team-docs/edit/master/source/' + path;
});

hexo.extend.helper.register('page_anchor', function(str) {
  var $ = cheerio.load(str, {decodeEntities: false});
  var headings = $('h1, h2, h3, h4, h5, h6');

  if (!headings.length) return str;

  headings.each(function() {
    var id = $(this).attr('id');

    $(this)
      .addClass('article-heading')
      .append('<a class="article-anchor" href="#' + id + '" aria-hidden="true"></a>');
  });

  return $.html();
});

hexo.extend.helper.register('lunr_index', function(data) {
  var index = lunr(function() {
    this.field('name', {boost: 10});
    this.field('tags', {boost: 50});
    this.field('description');
    this.ref('id');

    _.sortBy(data, 'name').forEach((item, i) => {
      this.add(_.assign({id: i}, item));
    });
  });

  return JSON.stringify(index);
});

hexo.extend.helper.register('canonical_path_for_nav', function() {
  var path = this.page.canonical_path;

  if (startsWith(path, 'dp-docs/') || startsWith(path, 'api/')) {
    return path;
  }
  return '';

});

hexo.extend.helper.register('lang_name', function(lang) {
  const data = this.theme.languages[lang];
  return data.name || data;
});

hexo.extend.helper.register('disqus_lang', function() {
  var lang = this.page.lang;
  var data = this.site.data.languages[lang];

  return data.disqus_lang || lang;
});

hexo.extend.helper.register('hexo_version', function() {
  return this.env.version;
});

// 自定义Toc渲染函数
hexo.extend.helper.register('fancy_toc', function(str, options) {
  const $ = cheerio.load(str);
  const headingsMaxDepth = options.hasOwnProperty('max_depth') ? options.max_depth : 6;
  const headingsSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, headingsMaxDepth).join(',');
  const headings = $(headingsSelector);

  if (!headings.length) return '';

  const className = options.class || 'toc';
  const listNumber = options.hasOwnProperty('list_number') ? options.list_number : true;
  let result = `<ol class="${className}">`;
  const lastNumber = [0, 0, 0, 0, 0, 0];
  let firstLevel = 0;
  let lastLevel = 0;

  function getId(ele) {
    const id = $(ele).attr('id');
    const $parent = $(ele).parent();
    return id
            || ($parent.length < 1 ? null
              : getId($parent));
  }

  let minLevel = Number.MAX_VALUE;
  headings.each(function() {
    const level = +this.name[1];
    if (level < minLevel) {
      minLevel = level;
      return false;
    }
  });

  headings.each(function() {
    const level = +this.name[1];
    const id = getId(this);
    const text = escape($(this).text());

    lastNumber[level - 1]++;

    for (let i = level; i <= 5; i++) {
      lastNumber[i] = 0;
    }

    if (firstLevel) {
      for (let i = level; i < lastLevel; i++) {
        result += '</li>';
      }

      if (level > lastLevel) {
        // result += `<li class="${className}-child">`;
      } else {
        result += '</li>';
      }
    } else {
      firstLevel = level;
    }

    result += `<li class="${className}-item ${className}-level-${level}">`;
    result += `<a class="${className}-link" href="#${id}" style="padding-left: ${(level - minLevel + 1) * 10}px">`;

    if (listNumber) {
      result += `<span class="${className}-number">`;

      for (let i = firstLevel - 1; i < level; i++) {
        result += `${lastNumber[i]}.`;
      }

      result += '</span> ';
    }

    result += `<span class="${className}-text">${text}</span></a>`;

    lastLevel = level;
  });

  for (let i = firstLevel - 1; i < lastLevel; i++) {
    result += '</li>';
  }

  return result;
});



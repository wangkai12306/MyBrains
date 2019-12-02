'use strict';

// TOC初始化
let isTocExists = false;
let articleHeadingLocations = [];
let tocItems = [];
let currentTocItem, lastTocItem, currentTocItemLi, lastTocItemLi, windowHeight, docHeight;

function updateArticleHeadingPosition() {
  windowHeight = document.documentElement.clientHeight;
  docHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );

  const articleHeadingLinks = document.querySelectorAll('.article-heading > a.headerlink');

  articleHeadingLocations = [];
  for (let i = 0; i < articleHeadingLinks.length; i++) {
    let startLocation = Math.round(articleHeadingLinks[i].getBoundingClientRect().top + window.pageYOffset);
    // console.log(startLocation);
    let endLocation;
    if (i < articleHeadingLinks.length - 1) {
      endLocation = Math.round(articleHeadingLinks[i + 1].getBoundingClientRect().top + window.pageYOffset);
    } else {
      endLocation = docHeight;
    }
    const tocItem = decodeURIComponent(articleHeadingLinks[i].href.split('#')[1]);
    articleHeadingLocations.push([startLocation, endLocation, tocItem]);
  }
}

(function() {
  const header = document.getElementById('header');
  const toc = document.getElementById('article-toc');
  const headerHeight = header.clientHeight;

  if (!toc) return;

  function updateSidebarPosition() {
    const scrollTop = document.scrollingElement.scrollTop;

    if (scrollTop > headerHeight) {
      toc.classList.add('fixed');
    } else {
      toc.classList.remove('fixed');
    }
  }

  window.addEventListener('scroll', function() {
    window.requestAnimationFrame(updateSidebarPosition);
  });

  updateSidebarPosition();

  updateArticleHeadingPosition();


  const articleHeadingLinks = document.querySelectorAll('.article-heading > a.headerlink');

  for (let i = 0; i < articleHeadingLinks.length; i++) {
    const tocItem = decodeURIComponent(articleHeadingLinks[i].href.split('#')[1]);
    tocItems.push(tocItem);
  }

  isTocExists = tocItems.length > 0;

  function activeTocItemByUrlHash() {
    if (isTocExists) {
      lastTocItem = currentTocItem;
      const urlHash = decodeURIComponent(window.location.hash.split('#')[1]);
      currentTocItem = tocItems.includes(urlHash) ? urlHash : tocItems[0];// 优先定位URL Hash
      if (currentTocItem) {
        currentTocItemLi = document.querySelector(`a.toc-link[href="#${currentTocItem}"]`).parentNode;
        currentTocItemLi.classList.add('active');
      }
      if (lastTocItem) {
        lastTocItemLi = document.querySelector(`a.toc-link[href="#${lastTocItem}"]`).parentNode;
        lastTocItemLi.classList.remove('active');
      }
    }
  }

  activeTocItemByUrlHash();

  // Back to  Top
  // const backToTop
  const backToTop = document.querySelector('.back-to-top > a');
  backToTop.addEventListener('click', function() {
    activeTocItemByUrlHash();
  });

  window.addEventListener('scroll', function(e) {
    // 重新获取文档和窗口高度，人为改变窗口大小时有机会触发页面滚动。
    updateArticleHeadingPosition();

    const scrollTop = window.pageYOffset;
    if (isTocExists && (scrollTop + windowHeight < docHeight)) {
      for (let tocItemLocation of articleHeadingLocations) {
        if (scrollTop >= tocItemLocation[0] && scrollTop < tocItemLocation[1]) {
          window.location.hash = `#${tocItemLocation[2]}`;
          break;
        }
      }
    }
    // Back To Top按钮设置
    const THRESHOLD = 50;
    const backToTopOverlay = document.getElementsByClassName('back-to-top')[0];
    if (scrollTop > THRESHOLD) {
      backToTopOverlay.classList.add('back-to-top-on');
    } else {
      backToTopOverlay.classList.remove('back-to-top-on');
    }
    const scrollPercent = scrollTop / (docHeight - windowHeight);
    const scrollPercentRounded = Math.round(scrollPercent * 100);
    document.querySelectorAll('#scrollpercent > span')[0].innerHTML = scrollPercentRounded.toString();
  });

  window.addEventListener('hashchange', function() {
    activeTocItemByUrlHash();
  });
}());



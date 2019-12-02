(function() {
  'use strict';

  const header = document.getElementById('header');
  const sidebar = document.getElementById('sidebar');
  const headerHeight = header.clientHeight;

  if (!sidebar) return;

  function updateSidebarPosition() {
    var scrollTop = document.scrollingElement.scrollTop;

    if (scrollTop > headerHeight) {
      sidebar.classList.add('fixed');
    } else {
      sidebar.classList.remove('fixed');
    }
  }

  window.addEventListener('scroll', function() {
    updateSidebarPosition();
  });

  updateSidebarPosition();

  const coll = document.getElementsByClassName('sidebar-link');

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener('click', function() {
      this.parentNode.classList.toggle('open');
      if (this.firstElementChild.classList.contains('fa-caret-right')) {
        this.firstElementChild.classList.replace('fa-caret-right', 'fa-caret-down');
      } else {
        this.firstElementChild.classList.replace('fa-caret-down', 'fa-caret-right');
      }
      // const content = this.nextElementSibling;
      // if (content.style.maxHeight) {
      //   content.style.maxHeight = null;
      // } else {
      //   content.style.maxHeight = content.scrollHeight + 'px';
      // }
    });
  }

}());

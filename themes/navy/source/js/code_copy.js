'use strict';

(function() {
  // Add copy icon
  var $copyIcon = $('<i class="fa fa-clipboard" aria-hidden="true"></i>');
  var $notice = $('<div class="copy-notice"></div>');


  // $('figure.highlight').prepend($copyIcon);
  // $('figure.highlight').prepend($notice);

  // $('figure.highlight').prepend(codeHeader);

  $('figure.highlight').each(function(i, el) {
    let codeLanguage = el.classList.length > 1 ? el.classList[1] : 'code';
    console.log(codeLanguage);

    let codeHeader = $($.trim(`
    <div class="code-header">
        <span class="code-language">${codeLanguage}</span>
		<span class="copy-notice"/>
		<div class="copy-button">
		    <i class="fa fa-clipboard" aria-hidden="true"></i>
        </div>
	</div>`)).toArray()[0];

    el.prepend(codeHeader);
  });

  // copy function
  function copy(text, ctx) {
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      try {
        document.execCommand('copy'); // Security exception may be thrown by some browsers.
        $(ctx).parent().prev('.copy-notice')
          .text('复制成功')
          .velocity('fadeIn', { duration: 500 })
          .velocity('fadeOut', { delay: 500, duration: 500 });
      } catch (ex) {
        $(ctx).parent().prev('.copy-notice')
          .text('复制失败')
          .velocity({
            translateX: -30,
            opacity: 1
          }, {
            loop: 1,
            duration: 750,
            easing: 'easeOutQuint'
          });
        return false;
      }
    } else {
      $(ctx).parent().prev('.copy-notice').text('浏览器不支持');
    }
  }
  // click events
  $('.highlight .fa-clipboard').on('click', function() {
    const selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents($(this).parent().parent().next('table').find('.code pre')[0]);
    selection.removeAllRanges();
    selection.addRange(range);
    var text = selection.toString();
    copy(text, this);
    selection.removeAllRanges();
  });
}());

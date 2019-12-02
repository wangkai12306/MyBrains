/* global hexo */

'use strict';

hexo.extend.tag.register('mood', function(args, content) {
  let date = args[0];
  let time = args[1];
  let logo = args[2];
  var result = '';
  result += '<blockquote>';
  logo = '<span class="fa-stack fa-lg"><i class="fa ' + logo + ' fa-stack-1x"></i></span>';
  result += hexo.render.renderSync({text: logo + content, engine: 'markdown'});
  let footer = '<span>' + date + ' ' + time + '</span>';
  result += '<footer>' + footer + '</footer>';
  result += '</blockquote>';
  return result;
}, {ends: true});

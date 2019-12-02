<div id="content-wrap">
  <div id="content" class="wrapper">
    <div id="content-inner">
      <article class="article-container" itemscope itemtype="http://schema.org/Article">
        <div class="article-inner">
          <div class="article">
            <div class="inner">
              <header class="article-header">
                <div class="article-title-overview">
                  <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
                  <a href="{{ raw_link(page.source) }}" class="article-edit-link" title="{{ __('page.improve') }}"><i class="fa fa-pencil"></i></a>
                </div>
                <div class="article-title-others">
                  <time class="article-header-updated" datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last_updated', date(page.updated, 'YYYY-MM-DD HH:mm:ss')) }}</time>
                </div>
              </header>
              <div class="article-content" itemprop="articleBody">
                {{ page_anchor(page.content) }}
              </div>
              <footer class="article-footer">
                {#<time class="article-footer-updated" datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last_updated', date(page.updated)) }}</time>#}
                {{ page_nav() }}
              </footer>
            </div>
          </div>
          <aside id="article-toc" role="navigation">
            <div id="article-toc-inner">
              <strong class="sidebar-title">{{ __('page.contents') }}</strong>
              {{ fancy_toc(page.content, {list_number: false}) }}
              {#<a href="#" id="article-toc-top">{{ __('page.back_to_top') }}</a>#}
            </div>
          </aside>
        </div>
      </article>
      {{ partial('partial/sidebar') }}
      <div class="back-to-top">
        <a href="#">
          <i class="fa fa-arrow-up"></i>
          <span id="scrollpercent"><span>0</span>%</span>
        </a>
      </div>
    </div>
  </div>
</div>

source "https://rubygems.org"

# Jekyll 버전 지정
gem "jekyll", "~> 4.3"

# Hydejack 테마
gem "jekyll-theme-hydejack", "~> 9.1"

# KaTeX 수식을 위한 kramdown 플러그인
gem "kramdown-math-katex"

# JavaScript runtime (KaTeX 사용을 위해 필요)
gem "duktape"

# Ruby 3 이상에서 `jekyll serve`를 위한 필수 플러그인
gem "webrick"

# Jekyll 관련 플러그인 그룹
group :jekyll_plugins do
  gem "jekyll-default-layout"
  gem "jekyll-feed"
  gem "jekyll-optional-front-matter"
  gem "jekyll-paginate"
  gem "jekyll-readme-index"
  gem "jekyll-redirect-from"
  gem "jekyll-relative-links"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-titles-from-headings"
  gem "jekyll-include-cache"
  
  # GitHub Pages에서 지원하지 않는 플러그인들
  gem "jekyll-last-modified-at"
  gem "jekyll-compose"
end

# Windows에서만 필요한 gem
gem 'wdm' if Gem.win_platform?
gem "tzinfo-data" if Gem.win_platform?

gem 'jekyll-spaceship'
gem "jekyll-mermaid"

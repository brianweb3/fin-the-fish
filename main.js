(function () {
  const sections = {
    game: document.getElementById('section-game'),
    tweets: document.getElementById('section-tweets'),
    articles: document.getElementById('section-articles')
  };

  const tabs = document.querySelectorAll('.tab');
  const tweetsTbody = document.getElementById('tweets-tbody');
  const articlesList = document.getElementById('articles-list');

  function showSection(name) {
    Object.keys(sections).forEach(function (key) {
      sections[key].classList.toggle('active', key === name);
    });
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === name);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = this.getAttribute('data-tab');
      if (name && sections[name]) showSection(name);
    });
  });

  function renderTweets() {
    if (!window.FIN_TWEETS || !tweetsTbody) return;
    tweetsTbody.innerHTML = window.FIN_TWEETS.map(function (t) {
      return (
        '<tr>' +
          '<td>' + t.date + '</td>' +
          '<td>' + escapeHtml(t.text) + '</td>' +
          '<td><a href="' + escapeAttr(t.url) + '" target="_blank" rel="noopener">Open</a></td>' +
          '<td>' + t.likes + '</td>' +
          '<td>' + t.retweets + '</td>' +
          '<td>' + formatViews(t.views) + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatViews(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  function renderArticles() {
    if (!window.FIN_ARTICLES || !articlesList) return;
    articlesList.innerHTML = window.FIN_ARTICLES.map(function (a) {
      return (
        '<button type="button" class="article-card" data-article-id="' + escapeAttr(a.id) + '">' +
          '<h3>' + escapeHtml(a.title) + '</h3>' +
          '<div class="meta">' + escapeHtml(a.date) + '</div>' +
          '<p>' + escapeHtml(a.excerpt) + '</p>' +
        '</button>'
      );
    }).join('');
    articlesList.querySelectorAll('.article-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-article-id');
        var a = window.FIN_ARTICLES && window.FIN_ARTICLES.find(function (x) { return x.id === id; });
        if (!a) return;
        var modal = document.getElementById('article-modal');
        var titleEl = modal && modal.querySelector('.article-modal-title');
        var metaEl = modal && modal.querySelector('.article-modal-meta');
        var contentEl = modal && modal.querySelector('.article-modal-content');
        if (!modal || !titleEl || !metaEl || !contentEl) return;
        titleEl.textContent = a.title;
        metaEl.textContent = a.date;
        var paras = (a.body || '').split(/\n\n+/).filter(Boolean);
        contentEl.innerHTML = paras.map(function (p) {
          return '<p>' + escapeHtml(p) + '</p>';
        }).join('');
        modal.classList.add('article-modal-open');
        modal.setAttribute('aria-hidden', 'false');
      });
    });
  }

  function closeArticleModal() {
    var modal = document.getElementById('article-modal');
    if (!modal) return;
    modal.classList.remove('article-modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  (function setupArticleModal() {
    var modal = document.getElementById('article-modal');
    if (!modal) return;
    modal.querySelector('.article-modal-backdrop').addEventListener('click', closeArticleModal);
    modal.querySelector('.article-modal-close').addEventListener('click', closeArticleModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('article-modal-open')) closeArticleModal();
    });
  })();

  function setupBotStats() {
    var stats = window.FIN_BOT_STATS;
    var tweets = window.FIN_TWEETS;
    var articles = window.FIN_ARTICLES;
    var thoughts = window.FIN_THOUGHTS;
    var tweetCount = tweets ? tweets.length : 0;
    var articleCount = articles ? articles.length : 0;
    var thoughtCount = thoughts ? thoughts.length : 0;

    var elTweets = document.getElementById('stat-tweets');
    if (elTweets) elTweets.textContent = (stats && stats.tweets != null) ? stats.tweets : (tweetCount > 0 ? tweetCount : '—');
    var elArticles = document.getElementById('stat-articles');
    if (elArticles) elArticles.textContent = (stats && stats.articles != null) ? stats.articles : articleCount;
    var elThoughts = document.getElementById('stat-thoughts');
    if (elThoughts) elThoughts.textContent = (stats && stats.thoughts != null) ? stats.thoughts : thoughtCount;
    var elFollowers = document.getElementById('stat-followers');
    if (elFollowers) elFollowers.textContent = (stats && stats.followers != null) ? formatStatsNum(stats.followers) : '—';
    var elSince = document.getElementById('stat-since');
    if (elSince) elSince.textContent = (stats && stats.since) ? stats.since : '2026';
  }

  function formatStatsNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  renderTweets();
  renderArticles();
  setupBotStats();

  (function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    var start = Date.now();
    var minTime = 9000;
    function hideLoader() {
      var delay = Math.max(0, minTime - (Date.now() - start));
      setTimeout(function () {
        loader.classList.add('loader-done');
        document.body.classList.add('site-ready');
      }, delay);
    }
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader);
  })();
})();

/**
 * Underwater GIF fish: spawn in random positions and keep swimming.
 */
(function () {
  var GIF_URLS = [
    'https://i.gifer.com/VAyP.gif'
  ];
  var NUM_FISH = 6;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function spawnGifFish() {
    var container = document.querySelector('.fish-bg-gifs');
    if (!container) return;

    for (var i = 0; i < NUM_FISH; i++) {
      var el = document.createElement('div');
      el.className = 'fish-gif';

      var url = GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)];
      el.style.backgroundImage = 'url(' + url + ')';

      var topPercent = random(5, 85);
      el.style.top = topPercent + '%';

      var swimRight = Math.random() > 0.5;
      var duration = random(24, 42);
      var delay = random(0, 18);

      if (swimRight) {
        el.style.left = '-8%';
        el.style.animation = 'fish-swim-right ' + duration + 's linear infinite ' + delay + 's';
      } else {
        el.style.left = '108%';
        el.style.transform = 'scaleX(-1)';
        el.style.animation = 'fish-swim-left ' + duration + 's linear infinite ' + delay + 's';
      }

      container.appendChild(el);
    }
  }

  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', spawnGifFish);
    } else {
      spawnGifFish();
    }
  }

  start();
})();


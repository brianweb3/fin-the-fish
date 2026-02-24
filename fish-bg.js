/**
 * Background fish swimming (sprite animation).
 * Adapted from fish-sprite-animation-in-javascript-and-css.
 */
(function () {
  var fishWidth = 27;
  var offScreen = '-27px';
  var animDurations = [1, 0.875, 0.75, 0.625, 0.5, 0.375, 0.25];
  var transitionBenchmarks = [20, 17.5, 15, 11.25, 7.5, 4.875, 3.25];
  var refWidth = 500;

  function setTransform(style, value) {
    style.webkitTransform = style.transform = value;
  }
  function setTransition(style, value) {
    style.webkitTransition = style.transition = value;
  }
  function setAnimation(style, value) {
    style.webkitAnimation = style.animation = value;
  }

  function spawnShoal() {
    var container = document.querySelector('.fish-bg');
    if (!container) return;

    var w = window.innerWidth;
    var h = window.innerHeight;
    var count = 2 + Math.floor(Math.random() * 4);
    var animWidth = w + fishWidth;
    var finished = 0;

    function onEnd() {
      finished++;
      if (finished >= count) {
        setTimeout(spawnShoal, 1500 + Math.random() * 2500);
      }
    }

    for (var i = 0; i < count; i++) {
      var idx = Math.floor(Math.random() * animDurations.length);
      var animDur = animDurations[idx];
      var transDur = animWidth * transitionBenchmarks[idx] / refWidth;
      var swimRight = Math.random() > 0.5;
      var scale = 1.2 + Math.random() * 1.1;
      var bottomPx = Math.round(h * (0.05 + Math.random() * 0.25));
      var yMove = -Math.round(h * 0.15 * (0.5 + Math.random() * 0.5));

      var c1 = document.createElement('div');
      var c2 = document.createElement('div');
      var c3 = document.createElement('div');
      var box = document.createElement('div');

      c1.className = 'shdoContaIner1';
      c2.className = 'shdoContaIner2';
      c3.className = 'shdoContaIner3';
      box.className = 'fidoBox';

      c1.appendChild(box);
      c2.appendChild(c1);
      c3.appendChild(c2);

      if (swimRight) {
        c3.style.left = offScreen;
        setTransform(box.style, 'scaleX(-1)');
      } else {
        c3.style.right = offScreen;
        c3.style.left = 'auto';
      }
      c3.style.bottom = bottomPx + 'px';
      setTransform(c3.style, 'scale(' + scale + ')');

      var animDelay = -Math.random() * animDur;
      setAnimation(box.style, 'fidoSwimForwards ' + animDur + 's steps(8) ' + animDelay + 's infinite');

      var xMove = Math.round(animWidth * (scale < 1 ? 1 / scale : 1));
      if (!swimRight) xMove = -xMove;

      c1.addEventListener('transitionend', function te() {
        c1.removeEventListener('transitionend', te);
        if (c3.parentNode) c3.parentNode.removeChild(c3);
        onEnd();
      });

      container.appendChild(c3);
      void c3.offsetHeight;
      setTransition(c1.style, 'transform ' + transDur + 's ease-in-out');
      setTransform(c1.style, 'translate3d(' + xMove + 'px, 0, 0)');
      setTransition(c2.style, 'transform ' + transDur + 's ease-in-out');
      setTransform(c2.style, 'translate3d(0, ' + yMove + 'px, 0)');
    }
  }

  function start() {
    var container = document.querySelector('.fish-bg');
    if (!container) return;
    setTimeout(spawnShoal, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

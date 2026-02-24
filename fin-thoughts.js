/**
 * Fin's live thoughts panel: typing animation and periodic new thoughts.
 */
(function () {
  var listEl = document.getElementById('fin-thoughts-list');
  var thoughts = window.FIN_THOUGHTS;
  var maxEntries = 8;
  var typingSpeed = 45;
  var minDelay = 12000;
  var maxDelay = 22000;

  function formatDateTime(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    var h = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d + ' ' +
      (h < 10 ? '0' : '') + h + ':' + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function typeText(container, fullText, onDone) {
    var i = 0;
    container.innerHTML = '';
    var textNode = document.createTextNode('');
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    container.appendChild(textNode);
    container.appendChild(cursor);

    function step() {
      if (i <= fullText.length) {
        textNode.textContent = fullText.slice(0, i);
        i++;
        setTimeout(step, typingSpeed);
      } else {
        cursor.remove();
        textNode.textContent = fullText;
        if (onDone) onDone();
      }
    }
    step();
  }

  function addThought() {
    if (!listEl || !thoughts || !thoughts.length) return;

    var text = thoughts[Math.floor(Math.random() * thoughts.length)];
    var now = new Date();
    var entry = document.createElement('div');
    entry.className = 'fin-thought-entry fin-thought-typing';

    var datetimeEl = document.createElement('div');
    datetimeEl.className = 'fin-thought-datetime';
    datetimeEl.textContent = formatDateTime(now);

    var textEl = document.createElement('div');
    textEl.className = 'fin-thought-text';

    entry.appendChild(datetimeEl);
    entry.appendChild(textEl);
    listEl.insertBefore(entry, listEl.firstChild);

    while (listEl.children.length > maxEntries) {
      listEl.removeChild(listEl.lastChild);
    }

    typeText(textEl, text, function () {
      entry.classList.remove('fin-thought-typing');
    });
  }

  function scheduleNext() {
    var delay = minDelay + Math.random() * (maxDelay - minDelay);
    setTimeout(function () {
      addThought();
      scheduleNext();
    }, delay);
  }

  function start() {
    if (!listEl || !thoughts || !thoughts.length) return;
    setTimeout(function () {
      addThought();
      scheduleNext();
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

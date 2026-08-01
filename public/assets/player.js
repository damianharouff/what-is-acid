/**
 * Static replacement for the YTMND loader/player.
 *
 * The original site fetched /info/103657/json at runtime and streamed the
 * media into blob URLs; none of that survives a "save page" or works on
 * static hosting. This reproduces the behavior with local assets:
 * tiled animated GIF foreground + looping MP3, kept in sync by the
 * restart button (blob-URL swap restarts the GIF from frame one).
 */
(function () {
  var GIF_URL = 'assets/fg.gif';
  var SOUND_URL = 'assets/sound.mp3';

  var fg = document.getElementById('foreground_image');
  var playScreen = document.getElementById('play_screen');
  var restartButton = document.getElementById('restart_button');
  var restartRotation = 0;

  var gifBlob = null;
  var gifObjectUrl = null;

  var audio = new Audio(SOUND_URL);
  audio.loop = true;
  audio.preload = 'auto';

  function setForeground() {
    if (gifObjectUrl) {
      URL.revokeObjectURL(gifObjectUrl);
    }
    gifObjectUrl = URL.createObjectURL(gifBlob);
    fg.style.backgroundImage = 'url("' + gifObjectUrl + '")';
    fg.style.backgroundRepeat = 'repeat';

    // Tile past the first viewport if the page ends up taller than it.
    var pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    fg.style.minHeight = pageHeight + 'px';
    fg.style.height = '100%';
  }

  function start() {
    setForeground();
    try {
      audio.currentTime = 0;
    } catch (e) { /* not seekable yet; it will start from 0 anyway */ }
    audio.play();
  }

  function restart(event) {
    restartRotation = (restartRotation + 90) % 360;
    restartButton.style.transform = 'rotate(' + restartRotation + 'deg)';

    audio.pause();
    start();

    if (event) {
      event.preventDefault();
    }
  }

  function dismissPlayScreenAndStart() {
    playScreen.style.display = 'none';
    start();
  }

  /**
   * Info bar open/close, as in the original site template.
   */
  var corner = document.getElementById('corner');
  var infobar = document.getElementById('infobar');
  var siteInfo = document.getElementById('site_info');
  var siteInfoRight = document.getElementById('site_info_right');

  corner.addEventListener('click', function (event) {
    var windowWidth = window.innerWidth;

    if (windowWidth >= 610 && windowWidth < 1180) {
      var maxWidth = (windowWidth - 150) + 'px';
      siteInfo.style.width = maxWidth;
      siteInfo.style.maxWidth = maxWidth;
      siteInfo.style.minWidth = maxWidth;
      siteInfoRight.style.display = 'none';
    } else {
      siteInfo.style.width = '1180px';
      siteInfo.style.maxWidth = '1180px';
      siteInfo.style.minWidth = '1180px';
      siteInfoRight.style.display = 'block';
    }

    infobar.style.visibility = 'visible';
    infobar.style.display = 'block';
    corner.style.display = 'none';
    event.preventDefault();
  });

  document.getElementById('info_box_closer').addEventListener('click', function (event) {
    infobar.style.display = 'none';
    corner.style.display = 'block';
    event.preventDefault();
  });

  restartButton.addEventListener('click', restart);

  /**
   * Preload the GIF as a blob (needed for restart), then either autoplay
   * or wait for a click if the browser blocks audio autoplay.
   */
  fetch(GIF_URL)
    .then(function (response) { return response.blob(); })
    .then(function (blob) {
      gifBlob = blob;

      var attempt = audio.play();

      if (attempt && typeof attempt.then === 'function') {
        attempt.then(function () {
          // Autoplay allowed: restart cleanly so gif and audio sync.
          audio.pause();
          dismissPlayScreenAndStart();
        }).catch(function () {
          playScreen.addEventListener('click', dismissPlayScreenAndStart, { once: true });
        });
      } else {
        dismissPlayScreenAndStart();
      }
    });
})();

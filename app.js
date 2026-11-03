// Clips play muted while on screen and pause when scrolled away, so a phone only plays what you can see.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-auto]'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio > 0.35) {
          if (v.preload !== 'auto') v.preload = 'auto';
          play(v);
        } else {
          v.pause();
        }
      });
    }, { threshold: [0, 0.35, 0.7] });
    vids.forEach(function (v) { io.observe(v); });
  } else {
    vids.forEach(function (v) { v.controls = true; });
  }

  // Sound button for clips that have audio: unmutes this clip and mutes the others.
  Array.prototype.slice.call(document.querySelectorAll('.sound')).forEach(function (b) {
    var v = b.parentNode.querySelector('video');
    b.addEventListener('click', function () {
      var on = v.muted;
      vids.forEach(function (o) { if (o !== v) { o.muted = true; var ob = o.parentNode.querySelector('.sound'); if (ob) ob.textContent = 'Sound on'; } });
      v.muted = !on ? true : false;
      if (on) { v.currentTime = 0; play(v); }
      b.textContent = v.muted ? 'Sound on' : 'Sound off';
    });
  });

  // Tap a clip to open it full screen with controls.
  vids.forEach(function (v) {
    v.addEventListener('click', function () {
      var fs = v.requestFullscreen || v.webkitEnterFullscreen || v.webkitRequestFullscreen;
      if (fs) { try { fs.call(v); } catch (err) {} }
    });
  });
})();

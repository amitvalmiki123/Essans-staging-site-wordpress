/* Home only: hold the current photo/card position while Read More is open. */
(function () {
  'use strict';

  function setup() {
    var hero = document.querySelector('body.home #wrapper #main #content .luxury-hero');
    if (!hero || hero.hasAttribute('data-essen-image-still')) return;
    var visual = hero.querySelector('.luxury-hero-visual');
    var photo = hero.querySelector('.luxury-hero-photo');
    var more = hero.querySelector('.hero-lead .more-text');
    var button = hero.querySelector('.hero-lead button.read-more');
    if (!visual || !photo || !more || !button) return;
    hero.setAttribute('data-essen-image-still', '');
    var lockClass = 'essen-image-still';
    var desktop = window.matchMedia('(min-width: 1280px)');
    var resizeTimer;
    var releaseTimer;

    function unlock() {
      hero.classList.remove(lockClass);
      hero.style.removeProperty('--essen-image-visual-height');
      hero.style.removeProperty('--essen-image-photo-height');
      hero.style.removeProperty('--essen-image-background-position');
      hero.style.removeProperty('--essen-image-background-size');
    }

    function captureClosedLayout() {
      var previousStyle = more.getAttribute('style');
      hero.classList.remove(lockClass);
      more.style.setProperty('display', 'none', 'important');
      var visualHeight = visual.getBoundingClientRect().height;
      var photoHeight = photo.getBoundingClientRect().height;
      var photoStyle = window.getComputedStyle(photo);
      var backgroundPosition = photoStyle.backgroundPosition;
      var backgroundSize = photoStyle.backgroundSize;
      if (previousStyle === null) more.removeAttribute('style');
      else more.setAttribute('style', previousStyle);
      if (!visualHeight || !photoHeight) return;
      hero.style.setProperty('--essen-image-visual-height', visualHeight + 'px');
      hero.style.setProperty('--essen-image-photo-height', photoHeight + 'px');
      hero.style.setProperty('--essen-image-background-position', backgroundPosition);
      hero.style.setProperty('--essen-image-background-size', backgroundSize);
      hero.classList.add(lockClass);
    }

    hero.addEventListener('click', function (event) {
      if (!button.contains(event.target) || !desktop.matches) return;
      window.clearTimeout(releaseTimer);
      if (!hero.classList.contains(lockClass) && window.getComputedStyle(more).display === 'none') {
        captureClosedLayout();
      }
    }, true);

    new MutationObserver(function () {
      if (!hero.classList.contains(lockClass) || window.getComputedStyle(more).display !== 'none') return;
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(function () {
        if (window.getComputedStyle(more).display === 'none') unlock();
      }, 60);
    }).observe(more, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });

    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (!desktop.matches) unlock();
        else if (window.getComputedStyle(more).display !== 'none') captureClosedLayout();
        else unlock();
      }, 350);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
}());

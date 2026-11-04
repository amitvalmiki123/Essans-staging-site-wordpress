/* 29.10 Point 7 — WPCode JavaScript snippet, Site Wide Footer. */
(function () {
  'use strict';

  function initTreatmentReadMore() {
    if (!document.body.classList.contains('parent-pageid-576')) return;

    var rows = Array.from(document.querySelectorAll('#main .row.row-large'));
    var row = rows.find(function (item) {
      return item.querySelector('h1') &&
        item.querySelector('.wpcf7[data-wpcf7-id="6643"]');
    });
    if (!row) return;

    var heading = row.querySelector('h1');
    var area = heading.parentElement;
    if (!area || !area.matches('.col-inner, .text') ||
        area.querySelector('.essen-treatment-readmore')) return;

    var children = Array.from(area.children);
    var afterHeading = children.slice(children.indexOf(heading) + 1);
    var content = [];
    for (var i = 0; i < afterHeading.length; i++) {
      var child = afterHeading[i];
      if (child.matches('a.button[href="#Contact"]') ||
          child.querySelector('a.button[href="#Contact"]')) break;
      content.push(child);
    }

    var firstIndex = content.findIndex(function (node) {
      return node.tagName === 'P' && node.textContent.trim();
    });
    if (firstIndex < 0) return;

    var extra = content.slice(firstIndex + 1).filter(function (node) {
      return /^(P|UL|OL)$/.test(node.tagName) &&
        !node.hasAttribute('hidden') && node.textContent.trim();
    });
    if (!extra.length) return;

    var controls = extra.map(function (node, index) {
      if (!node.id) {
        var id = 'essen-treatment-extra-' + (index + 1);
        while (document.getElementById(id)) id += '-x';
        node.id = id;
      }
      node.classList.add('essen-treatment-extra');
      return node.id;
    });

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'essen-treatment-readmore';
    button.textContent = 'Read More +';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', controls.join(' '));
    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') === 'true';
      extra.forEach(function (node) { node.hidden = expanded; });
      button.setAttribute('aria-expanded', String(!expanded));
      button.textContent = expanded ? 'Read More +' : 'Read Less −';
    });

    extra[extra.length - 1].insertAdjacentElement('afterend', button);
    extra.forEach(function (node) { node.hidden = true; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTreatmentReadMore, { once: true });
  } else {
    initTreatmentReadMore();
  }
})();


/* 03 Nov updates: catalog heading, theme icons, treatment scope and Home image ratio. */
(function () {
  'use strict';

  function addThemeIcon(parent, iconClass) {
    if (!parent || parent.querySelector('.' + iconClass)) return;
    var icon = document.createElement('i');
    icon.className = iconClass + ' essen-topbar-icon';
    icon.setAttribute('aria-hidden', 'true');
    parent.insertBefore(icon, parent.firstChild);
  }

  function setupHomeHero(body) {
    if (!body.classList.contains('home')) return;
    var photo = document.querySelector('#main .luxury-hero .luxury-hero-photo');
    if (!photo || photo.hasAttribute('data-essen-hero-setup')) return;
    photo.setAttribute('data-essen-hero-setup', '');
    var currentUrl = '';
    var resizeTimer;

    function readImage() {
      var background = window.getComputedStyle(photo).backgroundImage;
      var match = /^url\(\s*(?:(["'])(.*?)\1|([^"'].*?))\s*\)$/i.exec(background);
      var url = match ? (match[2] || match[3]) : '';
      if (url === currentUrl) return;
      currentUrl = url;
      body.classList.remove('essen-hero-ready');
      photo.style.removeProperty('--essen-hero-ratio');
      if (!url) return;

      var image = new Image();
      image.onload = function () {
        if (currentUrl !== url || !image.naturalWidth || !image.naturalHeight) return;
        photo.style.setProperty('--essen-hero-ratio', image.naturalWidth + ' / ' + image.naturalHeight);
        body.classList.add('essen-hero-ready');
      };
      image.src = url;
    }

    readImage();
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(readImage, 150);
    });
  }

  function run() {
    var body = document.body;
    if (!body) return;

    addThemeIcon(document.querySelector('#header #top-bar .html_topbar_left a[href^="tel:"]'), 'icon-phone');
    addThemeIcon(document.querySelector('#header #top-bar .html_top_right_text p'), 'icon-clock');

    if (body.classList.contains('page-id-6243')) {
      var list = document.querySelector('#main .treatment-catalog .catalog-list');
      if (list) {
        if (!list.querySelector('.essen-catalog-title')) {
          var title = document.createElement('h2');
          var italic = document.createElement('em');
          title.className = 'essen-catalog-title';
          title.appendChild(document.createTextNode('Our '));
          italic.textContent = 'Treatments';
          title.appendChild(italic);
          list.insertBefore(title, list.firstChild);
        }
        list.classList.add('essen-title-ready');
      }
    }

    setupHomeHero(body);

    var isTreatment = body.classList.contains('page') && !body.classList.contains('home') && (
      body.classList.contains('parent-pageid-576') || (
        document.querySelector('#main section.faq-section') &&
        document.querySelector('#main .row.row-large:has(>.col>.col-inner h1):has(>.col>.col-inner .wpcf7[data-wpcf7-id="6643"])')
      )
    );
    if (!isTreatment) return;
    body.classList.add('essen-treatment-scope');
    document.querySelectorAll('#main section.section').forEach(function (section) {
      var heading = Array.prototype.find.call(section.querySelectorAll('h2'), function (h2) {
        return /^understanding\b/i.test(h2.textContent.trim());
      });
      if (heading) section.classList.add('essen-understanding');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}());

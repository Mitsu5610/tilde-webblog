/* ============================================================
   DJM Tour — load-content.js
   Loads CMS content from localStorage (saved by admin dashboard).
   Falls back silently to page defaults if nothing is saved.
   ============================================================ */
(function () {
    var day = document.body.dataset.day;
    if (!day || day === 'home') return;

    var data;
    try {
        data = JSON.parse(localStorage.getItem('djmContent_' + day) || 'null');
    } catch(e) {
        return;
    }
    if (!data) return;

    /* ── Hero text ────────────────────────────────────────── */
    _setText('.hero-title',    data.heroTitle);
    _setText('.hero-subtitle', data.heroSubtitle);
    _setText('.intro-band p',  data.introText);

    /* ── Accent / theme color ─────────────────────────────── */
    if (data.accentColor) {
        var r = document.documentElement;
        r.style.setProperty('--accent',      data.accentColor);
        r.style.setProperty('--accent-dk',   shadeColor(data.accentColor, -30));
        r.style.setProperty('--accent-glow', hexToRgba(data.accentColor, 0.32));
        if (data.heroGradient) {
            var hero = document.querySelector('.hero-section');
            if (hero) hero.style.background = data.heroGradient;
        }
    }

    /* ── Stops ────────────────────────────────────────────── */
    if (Array.isArray(data.stops)) {
        data.stops.forEach(function(stop) {
            var article = document.getElementById(stop.id);
            if (!article) return;

            _setTextIn(article, '.card-banner h3', stop.title);
            _setTextIn(article, '.card-body > p',  stop.description);

            if (stop.bannerGradient) {
                var banner = article.querySelector('.card-banner');
                if (banner) banner.style.background = stop.bannerGradient;
            }

            if (Array.isArray(stop.images) && stop.images.length) {
                var gallery = article.querySelector('.photo-grid');
                if (gallery) {
                    stop.images.forEach(function(url) {
                        var item = document.createElement('div');
                        item.className = 'photo-item';
                        var img = document.createElement('img');
                        img.src = url;
                        img.alt = 'Tour photo';
                        img.loading = 'lazy';
                        img.addEventListener('click', function() {
                            if (typeof openLightbox === 'function') openLightbox(url);
                        });
                        item.appendChild(img);
                        gallery.prepend(item);
                    });
                }
            }
        });
    }

    /* ── Helpers ──────────────────────────────────────────── */
    function _setText(selector, value) {
        if (!value) return;
        var el = document.querySelector(selector);
        if (el) el.textContent = value;
    }

    function _setTextIn(scope, selector, value) {
        if (!value) return;
        var el = scope.querySelector(selector);
        if (el) el.textContent = value;
    }

    function shadeColor(hex, pct) {
        var n = parseInt(hex.replace('#',''), 16);
        var r = Math.min(255, Math.max(0, (n >> 16) + pct));
        var g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
        var b = Math.min(255, Math.max(0, (n & 0xff) + pct));
        return '#' + [r, g, b].map(function(v){ return v.toString(16).padStart(2,'0'); }).join('');
    }

    function hexToRgba(hex, a) {
        var n = parseInt(hex.replace('#',''), 16);
        return 'rgba(' + (n>>16) + ',' + ((n>>8)&0xff) + ',' + (n&0xff) + ',' + a + ')';
    }
}());

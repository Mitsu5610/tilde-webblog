/* ============================================================
   DJM Tour — load-content.js
   Fetches custom content from /api/content?day=X and patches
   the DOM of the day page. Falls back silently to defaults.
   ============================================================ */
(async function () {
    const day = document.body.dataset.day;
    if (!day || day === 'home') return;

    let data;
    try {
        const res = await fetch('/api/content?day=' + day);
        if (!res.ok) return;
        data = await res.json();
        if (!data) return;
    } catch {
        return; // No network / KV not set up — show defaults
    }

    /* ── Hero text ────────────────────────────────────────── */
    _setText('.hero-title',    data.heroTitle);
    _setText('.hero-subtitle', data.heroSubtitle);
    _setText('.intro-band p',  data.introText);

    /* ── Accent / theme color ─────────────────────────────── */
    if (data.accentColor) {
        const r = document.documentElement;
        r.style.setProperty('--accent',      data.accentColor);
        r.style.setProperty('--accent-dk',   data.accentDark  || shadeColor(data.accentColor, -30));
        r.style.setProperty('--accent-glow', hexToRgba(data.accentColor, 0.32));
        // Also update hero gradient
        if (data.heroGradient) {
            const hero = document.querySelector('.hero-section');
            if (hero) hero.style.background = data.heroGradient;
        }
    }

    /* ── Stops ────────────────────────────────────────────── */
    if (Array.isArray(data.stops)) {
        data.stops.forEach(stop => {
            const article = document.getElementById(stop.id);
            if (!article) return;

            // Title
            _setText(article, '.card-banner h3', stop.title);
            // Description (first <p> inside .card-body)
            _setText(article, '.card-body > p', stop.description);
            // Banner gradient
            if (stop.bannerGradient) {
                const banner = article.querySelector('.card-banner');
                if (banner) banner.style.background = stop.bannerGradient;
            }
            // CMS-uploaded images (prepend before any user-uploaded ones)
            if (Array.isArray(stop.images) && stop.images.length) {
                const gallery = article.querySelector('.photo-grid');
                if (gallery) {
                    stop.images.forEach(url => {
                        const item = document.createElement('div');
                        item.className = 'photo-item';
                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = 'Tour photo';
                        img.loading = 'lazy';
                        img.addEventListener('click', () => {
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
    function _setText(scopeOrSelector, selectorOrValue, value) {
        let el;
        if (typeof scopeOrSelector === 'string') {
            // Called as _setText(selector, value)
            if (!selectorOrValue) return;
            el = document.querySelector(scopeOrSelector);
            if (el) el.textContent = selectorOrValue;
        } else {
            // Called as _setText(articleEl, selector, value)
            if (!value) return;
            el = scopeOrSelector.querySelector(selectorOrValue);
            if (el) el.textContent = value;
        }
    }

    function shadeColor(hex, pct) {
        const n = parseInt(hex.replace('#',''), 16);
        const r = Math.min(255, Math.max(0, (n >> 16) + pct));
        const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
        const b = Math.min(255, Math.max(0, (n & 0xff) + pct));
        return '#' + [r, g, b].map(v => v.toString(16).padStart(2,'0')).join('');
    }

    function hexToRgba(hex, a) {
        const n = parseInt(hex.replace('#',''), 16);
        return `rgba(${n>>16},${(n>>8)&0xff},${n&0xff},${a})`;
    }
})();

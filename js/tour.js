/* ============================================================
   DJM EDUCATIONAL TOUR — tour.js
   Shared JavaScript for all 6 day pages.
   ============================================================ */

// ── Elements ──────────────────────────────────────────────
const plane       = document.getElementById('travel-plane');
const bus         = document.getElementById('travel-bus');
const stickyNav   = document.getElementById('sticky-nav');
const progressBar = document.getElementById('progress-bar');

// ── Scroll-Driven Plane & Bus ─────────────────────────────
let rafPending = false;

function updateOnScroll() {
    rafPending = false;
    const scrolled  = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress  = Math.min(scrolled / maxScroll, 1);
    const vw        = window.innerWidth;

    // Plane flies left → right as you scroll
    if (plane) plane.style.left = (-220 + progress * (vw + 440)) + 'px';

    // Bus drives left → right as you scroll
    if (bus) bus.style.left = (-280 + progress * (vw + 560)) + 'px';

    // Progress bar fills
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    // Show sticky nav after passing the hero
    if (stickyNav) {
        stickyNav.classList.toggle('visible', scrolled > window.innerHeight * 0.55);
    }

    // Highlight active nav link
    updateActiveNav();
}

window.addEventListener('scroll', () => {
    if (!rafPending) {
        requestAnimationFrame(updateOnScroll);
        rafPending = true;
    }
}, { passive: true });

window.addEventListener('resize', () => {
    rafPending = false;
    updateOnScroll();
});

// Run once on load
updateOnScroll();

// ── Active Nav Link ────────────────────────────────────────
function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    const sections = document.querySelectorAll('article[id], section[id]');
    let current = '';
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= 130) {
            current = sec.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === current);
    });
}

// ── Scroll Reveal (Intersection Observer) ─────────────────
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('revealed'), 90);
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Lightbox ───────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbClose  = document.getElementById('lb-close');

function openLightbox(src) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 300);
}

if (lbClose)  lbClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── "Fly the Route" back-button on day pages ───────────────
(function () {
    var day = document.body.getAttribute('data-day');
    if (!day || day === 'home') return;          // hub page — skip

    var btn = document.createElement('a');
    btn.href = '/fly/?day=' + day;
    btn.title = 'Fly the Route — Day ' + day;
    btn.style.cssText = [
        'position:fixed',
        'bottom:24px',
        'left:24px',
        'z-index:990',
        'display:flex',
        'align-items:center',
        'gap:9px',
        'padding:11px 20px',
        'border-radius:50px',
        'background:linear-gradient(135deg,#04091E 0%,#0B1D4E 55%,#1565C0 100%)',
        'color:#fff',
        'font-family:Poppins,sans-serif',
        'font-size:.74rem',
        'font-weight:600',
        'letter-spacing:2px',
        'text-decoration:none',
        'box-shadow:0 4px 24px rgba(21,101,192,.55)',
        'transition:transform .25s,box-shadow .25s',
        'white-space:nowrap'
    ].join(';');
    btn.innerHTML = '&#9992;&#128652; FLY TO DAY ' + day;

    btn.addEventListener('mouseenter', function () {
        btn.style.transform  = 'translateY(-3px)';
        btn.style.boxShadow  = '0 8px 32px rgba(21,101,192,.75)';
    });
    btn.addEventListener('mouseleave', function () {
        btn.style.transform  = '';
        btn.style.boxShadow  = '0 4px 24px rgba(21,101,192,.55)';
    });

    document.body.appendChild(btn);
}());
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

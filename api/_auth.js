/* ── Auth helper (not a public route) ───────────────────── */
const jwt = require('jsonwebtoken');

function verifyAuth(req) {
    try {
        const cookie = req.headers.cookie || '';
        const match  = cookie.match(/(?:^|;\s*)djm_admin=([^;]+)/);
        if (!match) return null;
        const secret = process.env.JWT_SECRET || 'djm-tour-secret-2026';
        return jwt.verify(match[1], secret);
    } catch {
        return null;
    }
}

module.exports = { verifyAuth };

const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body || {};

    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPass = process.env.ADMIN_PASSWORD || 'djmtour2026';
    const secret    = process.env.JWT_SECRET     || 'djm-tour-secret-2026';

    if (username === validUser && password === validPass) {
        const token  = jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '7d' });
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        res.setHeader(
            'Set-Cookie',
            `djm_admin=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Strict${secure}`
        );
        return res.json({ success: true });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
};

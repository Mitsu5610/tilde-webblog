const { verifyAuth } = require('./_auth');

module.exports = function handler(req, res) {
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    return res.json({ username: user.username, role: user.role });
};

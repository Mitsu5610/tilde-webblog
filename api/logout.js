module.exports = function handler(req, res) {
    res.setHeader('Set-Cookie', 'djm_admin=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
    res.json({ success: true });
};

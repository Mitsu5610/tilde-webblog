const { verifyAuth } = require('./_auth');
const { getSupabase } = require('./_supabase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { day } = req.query;
    if (!day) return res.status(400).json({ error: 'day param required' });

    const supabase = getSupabase();

    /* ── GET — public, used by day pages to load custom content ── */
    if (req.method === 'GET') {
        if (!supabase) return res.json(null); // not configured → use defaults
        try {
            const { data, error } = await supabase
                .from('day_content')
                .select('content')
                .eq('day', day)
                .single();
            if (error || !data) return res.json(null);
            return res.json(data.content);
        } catch {
            return res.json(null);
        }
    }

    /* ── PUT — admin only ── */
    if (req.method === 'PUT') {
        if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
        if (!supabase) return res.status(503).json({
            error: 'Supabase not configured. Add SUPABASE_URL and SUPABASE_SERVICE_KEY in environment variables.'
        });
        try {
            const { error } = await supabase
                .from('day_content')
                .upsert({ day, content: req.body, updated_at: new Date().toISOString() });
            if (error) throw error;
            return res.json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Save failed: ' + e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};

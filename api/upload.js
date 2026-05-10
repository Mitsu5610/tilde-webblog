const { verifyAuth } = require('./_auth');
const { getSupabase } = require('./_supabase');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!verifyAuth(req))      return res.status(401).json({ error: 'Unauthorized' });

    let supabase;
    try { supabase = getSupabase(); } catch { supabase = null; }
    if (!supabase) {
        return res.status(503).json({
            error: 'Supabase not configured. Add SUPABASE_URL and SUPABASE_SERVICE_KEY to Vercel environment variables.'
        });
    }

    try {
        const { filename, data, type } = req.body || {};
        if (!data) return res.status(400).json({ error: 'No image data received.' });

        const base64   = data.includes(',') ? data.split(',')[1] : data;
        const buffer   = Buffer.from(base64, 'base64');
        const base     = (filename || 'photo').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeName = `tours/${Date.now()}-${base}.webp`;

        const { error: uploadError } = await supabase.storage
            .from('tour-photos')
            .upload(safeName, buffer, { contentType: 'image/webp', upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('tour-photos')
            .getPublicUrl(safeName);

        return res.json({ url: urlData.publicUrl });
    } catch (e) {
        return res.status(500).json({ error: e.message || 'Upload failed' });
    }
};

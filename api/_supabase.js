const { createClient } = require('@supabase/supabase-js');

let _client = null;

function getSupabase() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;
    if (!_client) {
        try {
            _client = createClient(url, key);
        } catch {
            return null;
        }
    }
    return _client;
}

module.exports = { getSupabase };

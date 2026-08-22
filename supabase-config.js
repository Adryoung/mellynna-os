const SUPABASE_URL = "https://lnnqooumefwdstqhdxgg.supabase.co";

const SUPABASE_KEY = "sb_publishable_KBo1mqsQpwtK7-DYTbKyGA_7827iLi_";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("SUPABASE CONNECTED");
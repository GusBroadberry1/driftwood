import { createClient } from "@supabase/supabase-js";

// These are safe to have directly in frontend code -- the "publishable" key
// is specifically designed to be public. Real security comes from the Row
// Level Security policies set up on the itineraries table in Supabase itself,
// not from hiding this key.
const supabaseUrl = "https://woxnkxvryjbrejsojgsm.supabase.co";
const supabaseKey = "sb_publishable_inDTEJInLqMg60atNjExig_P4eGWGOE";

export const supabase = createClient(supabaseUrl, supabaseKey);

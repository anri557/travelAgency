require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: b } = await supabase.from('bundles').select('*').limit(1);
  console.log('Bundles:', b[0]);
  const { data: d } = await supabase.from('destinations').select('*').limit(1);
  console.log('Destinations:', d[0]);
}
check();

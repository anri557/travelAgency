const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) {
    // If rpc doesn't exist, try querying a standard catalog
    console.log("RPC get_tables failed, attempting direct query...");
    const { data: queryData, error: queryError } = await supabase
      .from('bundles')
      .select('id')
      .limit(1);
    
    console.log("Bundles select success:", !!queryData, "Error:", queryError);

    // Let's also check if we can query 'inquiries'
    const { data: inqData, error: inqError } = await supabase
      .from('inquiries')
      .select('*')
      .limit(1);
    console.log("Inquiries select success:", !inqError, "Error details:", inqError);
  } else {
    console.log("Tables:", data);
  }
}
run();

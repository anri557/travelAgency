import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request, { params }) {
  // Await params for compatibility with Next.js 15/16
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing ID param' }, { status: 400 });
  }

  const { data: bundle, error } = await supabaseAdmin
    .from('bundles')
    .select(`
      id,
      title,
      vibe_category,
      description,
      destinations (
        id,
        country_name,
        city_name,
        iata_code,
        image_urls,
        cached_flight_cost,
        cached_hotel_cost,
        average_hotel_commission_rate,
        target_bundle_margin_fixed
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (!bundle) {
    return NextResponse.json({ success: false, error: 'Bundle not found' }, { status: 404 });
  }

  const dest = bundle.destinations;
  const item = {
    id: bundle.id,
    title: bundle.title,
    vibe: bundle.vibe_category,
    duration: '4 დღე 5 ღამე', // 4 days 5 nights standard
    city: dest?.city_name || '',
    country: dest?.country_name || '',
    iata: dest?.iata_code || '',
    images: dest?.image_urls || [],
    description: bundle.description,
    baseFlightCost: dest?.cached_flight_cost || 250,
    baseHotelCost: dest?.cached_hotel_cost || 180
  };

  return NextResponse.json({ success: true, bundle: item });
}

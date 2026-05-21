import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SKY_ID_MAP = {
  'FCO': 'ROME'
};

const USD_TO_GEL = 2.70;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bundleId = searchParams.get('bundleId');
  const dateStr = searchParams.get('date'); // YYYY-MM-DD

  if (!bundleId || !dateStr) {
    return NextResponse.json({ success: false, error: 'Missing bundleId or date parameters' }, { status: 400 });
  }

  // Parse and validate date
  const travelDate = new Date(dateStr);
  if (isNaN(travelDate.getTime())) {
    return NextResponse.json({ success: false, error: 'Invalid date format' }, { status: 400 });
  }

  // Fetch bundle and destination info
  const { data: bundle, error } = await supabaseAdmin
    .from('bundles')
    .select(`
      id,
      title,
      destinations (
        id,
        city_name,
        iata_code,
        cached_flight_cost,
        cached_hotel_cost
      )
    `)
    .eq('id', bundleId)
    .single();

  if (error || !bundle) {
    return NextResponse.json({ success: false, error: 'Bundle not found' }, { status: 404 });
  }

  const dest = bundle.destinations;
  if (!dest) {
    return NextResponse.json({ success: false, error: 'Destination details not found for this package' }, { status: 404 });
  }

  const cityCode = dest.iata_code;
  const skyId = SKY_ID_MAP[cityCode] || cityCode;
  
  let flightCostUSD = 0;
  let isFallback = false;

  // 1. Try fetching from Skyscanner API first
  const searchMonth = dateStr.substring(0, 7); // YYYY-MM
  try {
    const apiResponse = await fetch(
      `https://skyscanner-flights-travel-api.p.rapidapi.com/flights/getCheapestOneway?originSkyId=TBS&destinationSkyId=${skyId}&month=${searchMonth}&currency=USD`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'skyscanner-flights-travel-api.p.rapidapi.com'
        }
      }
    );

    const apiData = await apiResponse.json();
    
    // Check if the API was successful and returned cheapest flight dates
    if (apiData && Array.isArray(apiData.cheapest)) {
      // Find the price for the specific date if present
      const dayStr = dateStr; // e.g. "2026-06-15"
      const datePriceMatch = apiData.cheapest.find(item => item.date === dayStr);
      
      if (datePriceMatch && !isNaN(Number(datePriceMatch.price))) {
        flightCostUSD = Number(datePriceMatch.price);
        console.log(`[Pricing API] Live rate match found for ${dest.city_name} on ${dayStr}: $${flightCostUSD}`);
      } else {
        // Find closest date price or get the minimum in the month
        const prices = apiData.cheapest
          .map(item => Number(item.price))
          .filter(price => !isNaN(price) && price > 0);
        
        if (prices.length > 0) {
          flightCostUSD = Math.min(...prices);
          console.log(`[Pricing API] Exact date match not found. Using cheapest month rate for ${dest.city_name}: $${flightCostUSD}`);
        } else {
          isFallback = true;
        }
      }
    } else {
      isFallback = true;
    }
  } catch (err) {
    console.error('[Pricing API] Failed to fetch Skyscanner live price:', err);
    isFallback = true;
  }

  // 2. Premium Pricing Fallback Simulator
  if (isFallback || flightCostUSD === 0) {
    console.log(`[Pricing API] Using fallback simulation for ${dest.city_name} on ${dateStr}`);
    
    // Base flight cost in USD (derived from database cached GEL price, or default to $100 USD)
    const baseGEL = dest.cached_flight_cost || 250;
    let baseUSD = baseGEL / USD_TO_GEL;

    // Apply multipliers based on travelDate properties
    let multiplier = 1.0;

    // A. Weekday departure multiplier (Friday, Saturday, Sunday = +15%)
    const dayOfWeek = travelDate.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
      multiplier += 0.15;
    }

    // B. Seasonality multiplier (June, July, August = +25%; May, September, October = +10%)
    const month = travelDate.getMonth(); // 0-indexed: 4 = May, 5 = Jun, 6 = Jul, 7 = Aug, 8 = Sep, 9 = Oct
    if (month === 5 || month === 6 || month === 7) {
      multiplier += 0.25;
    } else if (month === 4 || month === 8 || month === 9) {
      multiplier += 0.10;
    }

    // C. Booking proximity multiplier (comparing travel date vs now)
    const now = new Date();
    const msDiff = travelDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 7) {
      multiplier += 0.40; // less than 7 days: +40%
    } else if (daysDiff < 14) {
      multiplier += 0.20; // less than 14 days: +20%
    } else if (daysDiff < 30) {
      multiplier += 0.10; // less than 30 days: +10%
    }

    flightCostUSD = baseUSD * multiplier;
  }

  // Calculate final costs in GEL
  const liveFlightCostGEL = Number((flightCostUSD * USD_TO_GEL).toFixed(2));
  const roundtripFlightGEL = liveFlightCostGEL * 2;
  const hotelCostGEL = dest.cached_hotel_cost || 180;

  // Business formula
  const truePublicPrice = roundtripFlightGEL + hotelCostGEL;

  return NextResponse.json({
    success: true,
    price: Math.ceil(truePublicPrice),
    currency: '₾',
    breakdown: {
      roundtripFlight: Math.ceil(roundtripFlightGEL),
      hotelTotal: Math.ceil(hotelCostGEL),
      flightOneWay: Math.ceil(liveFlightCostGEL)
    },
    date: dateStr,
    destination: dest.city_name,
    isFallback
  });
}

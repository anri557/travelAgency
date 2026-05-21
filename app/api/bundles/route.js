import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Global Admin Supabase client to bypass request context cookies
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map of IATA codes to Skyscanner specific city-level SkyIds
const SKY_ID_MAP = {
  'FCO': 'ROME'
};

const USD_TO_GEL = 2.70;

async function revalidatePricesInBackground(destinationsToUpdate) {
  console.log(`[Revalidation] Starting background revalidation for ${destinationsToUpdate.length} destinations.`);
  
  for (const dest of destinationsToUpdate) {
    const cityCode = dest.iata_code;
    const skyId = SKY_ID_MAP[cityCode] || cityCode;
    const now = new Date();

    try {
      // Respect RapidAPI's 1-request-per-second limit
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const searchDate = new Date();
      searchDate.setMonth(searchDate.getMonth() + 1);
      const searchMonth = `${searchDate.getFullYear()}-${String(searchDate.getMonth() + 1).padStart(2, '0')}`;

      console.log(`[Revalidation] Fetching live rate for ${dest.city_name} (${skyId}) for ${searchMonth} in USD`);
      const apiResponse = await fetch(
        `https://skyscanner-flights-travel-api.p.rapidapi.com/flights/getCheapestOneway?originSkyId=TBS&destinationSkyId=${skyId}&month=${searchMonth}&currency=USD`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'skyscanner-flights-travel-api.p.rapidapi.com'
          }
        }
      );

      const apiData = await apiResponse.json();
      let apiSucceeded = false;
      let liveFlightCost = dest.cached_flight_cost;

      if (apiData && Array.isArray(apiData.cheapest)) {
        const prices = apiData.cheapest
          .map(item => Number(item.price))
          .filter(price => !isNaN(price) && price > 0);

        if (prices.length > 0) {
          const cheapestUSD = Math.min(...prices);
          liveFlightCost = Number((cheapestUSD * USD_TO_GEL).toFixed(2));
          apiSucceeded = true;
        }
      }

      if (apiSucceeded) {
        const { error } = await supabaseAdmin
          .from('destinations')
          .update({
            cached_flight_cost: liveFlightCost,
            last_price_update: now.toISOString()
          })
          .eq('id', dest.id);

        if (error) {
          console.error(`[Revalidation] Failed to update database cache for ${dest.city_name}:`, error.message);
        } else {
          console.log(`[Revalidation] Updated cache for ${dest.city_name}: ${liveFlightCost} GEL`);
        }
      } else {
        console.warn(`[Revalidation] Skyscanner API did not return prices for ${dest.city_name} (${skyId})`, apiData);
      }
    } catch (apiError) {
      console.error(`[Revalidation] Could not fetch live rates in background for ${dest.city_name} (${skyId}):`, apiError);
    }
  }
}

export async function GET() {
  // Fetch active bundles and destinations bypassing request-context cookies
  const { data: bundles, error } = await supabaseAdmin
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
        last_price_update,
        average_hotel_commission_rate,
        target_bundle_margin_fixed
      )
    `)
    .eq('is_active', true);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const livePriceBundles = [];
  const destinationsToRevalidate = [];
  const seenDestinationIds = new Set();

  for (const bundle of bundles) {
    const dest = bundle.destinations;
    if (!dest) continue;

    const now = new Date();
    const lastUpdate = dest.last_price_update ? new Date(dest.last_price_update) : new Date(0);
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);

    // If cache is older than 12 hours, schedule dynamic update in background
    if (hoursSinceUpdate > 12 && !seenDestinationIds.has(dest.id)) {
      destinationsToRevalidate.push(dest);
      seenDestinationIds.add(dest.id);
    }

    const liveFlightCost = dest.cached_flight_cost || 250;
    const liveHotelCost = dest.cached_hotel_cost || 180;
    const roundtripFlightCost = liveFlightCost * 2;

    const truePublicPrice = roundtripFlightCost + liveHotelCost;
    const bankFee = truePublicPrice * 0.025; // 2.5% Bank of Georgia fee

    const commissionRate = Number(dest.average_hotel_commission_rate || 0.12);
    const targetMargin = Number(dest.target_bundle_margin_fixed || 50.00);
    
    const wholesaleHotelDiscount = liveHotelCost * commissionRate;
    const netProfit = wholesaleHotelDiscount - bankFee;
    const isViable = netProfit >= targetMargin;

    livePriceBundles.push({
      id: bundle.id,
      title: bundle.title,
      vibe: bundle.vibe_category,
      duration: '4 gün 5 gece',
      price: Math.ceil(truePublicPrice),
      currency: '₾',
      city: dest.city_name,
      country: dest.country_name,
      image: dest.image_urls?.[0] || '',
      meta: {
        estimatedProfit: netProfit.toFixed(2),
        isViable: isViable
      }
    });
  }

  // Fire revalidation asynchronously without blocking the user
  if (destinationsToRevalidate.length > 0) {
    revalidatePricesInBackground(destinationsToRevalidate).catch((err) => {
      console.error('[Background] Error running revalidation task:', err);
    });
  }

  return NextResponse.json({ success: true, bundles: livePriceBundles });
}
import { NextResponse } from 'next/server';
import { getFallbackHotels } from '@/utils/hotelsData';

const IATA_MAP = {
  'rome': 'ROM',
  'istanbul': 'IST',
  'antalya': 'AYT',
  'bangkok': 'BKK',
  'phuket': 'HKT',
  'dubai': 'DXB',
  'venice': 'VCE',
  'florence': 'FLR',
  'athens': 'ATH',
  'santorini': 'JTR',
  'mykonos': 'JMK',
  'bodrum': 'BJV',
  'cappadocia': 'ASR'
};

const USD_TO_GEL = 2.70;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || 'Rome';
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const tourType = searchParams.get('tourType') || 'Adventure';

    if (!checkIn || !checkOut) {
      return NextResponse.json({
        success: false,
        error: "Missing required query parameters: checkIn, checkOut"
      }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 4;

    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    
    let amadeusSucceeded = false;
    let hotels = [];

    // 1. Attempt Amadeus API call if credentials exist
    if (clientId && clientSecret) {
      try {
        console.log(`[Amadeus API] Requesting token...`);
        const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;
          
          const iataCode = IATA_MAP[city.toLowerCase()] || 'ROM';
          console.log(`[Amadeus API] Searching hotels in ${city} (${iataCode})...`);
          
          const listResponse = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${iataCode}&radius=5&radiusUnit=KM&hotelSource=ALL`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });

          if (listResponse.ok) {
            const listData = await listResponse.json();
            const hotelIds = (listData.data || [])
              .slice(0, 10)
              .map(h => h.hotelId)
              .join(',');

            if (hotelIds) {
              console.log(`[Amadeus API] Fetching hotel offers for ${hotelIds}...`);
              const offersResponse = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=1&roomQuantity=1`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
              });

              if (offersResponse.ok) {
                const offersData = await offersResponse.json();
                
                if (offersData.data && offersData.data.length > 0) {
                  // Map Amadeus response structure to our clean schema
                  hotels = offersData.data.map((offer, idx) => {
                    const hotelObj = offer.hotel;
                    const pricingObj = offer.offers?.[0]?.price;
                    const basePriceUSD = Number(pricingObj?.total || 120);
                    const totalGEL = Math.ceil(basePriceUSD * USD_TO_GEL);
                    const ratePerNightGEL = Math.ceil(totalGEL / nights);

                    return {
                      id: hotelObj.hotelId || `amadeus-${idx}`,
                      name: hotelObj.name || "Amadeus Premium Hotel",
                      rating: 4.5, // Standard fallback as mock rating
                      reviewsCount: 320,
                      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
                      description: "Luxurious lodging with premium comfort and amenities verified by Amadeus Travel Network.",
                      amenities: hotelObj.amenities || ["Free WiFi", "Air Conditioning", "Room Service", "24/7 Desk"],
                      baseNightRateGel: ratePerNightGEL,
                      totalRateGel: totalGEL,
                      address: hotelObj.address?.lines?.join(', ') || city
                    };
                  });
                  amadeusSucceeded = true;
                  console.log(`[Amadeus API] Successfully loaded ${hotels.length} hotels.`);
                }
              }
            }
          }
        }
      } catch (amadeusErr) {
        console.error(`[Amadeus API] Failed processing request, falling back:`, amadeusErr.message);
      }
    }

    // 2. If Amadeus skipped, failed, or returned empty lists, trigger high-fidelity simulator fallback
    if (!amadeusSucceeded) {
      console.log(`[Amadeus API] Using fallback simulation for ${city} with style: ${tourType}`);
      const rawCatalog = getFallbackHotels(city, tourType);
      
      // Apply seasonality adjustment (Summer +25%, Spring/Autumn +10%)
      const month = checkInDate.getMonth();
      let seasonalityMultiplier = 1.0;
      if (month >= 5 && month <= 7) seasonalityMultiplier = 1.25; // June-August
      else if (month === 4 || month === 8 || month === 9) seasonalityMultiplier = 1.10; // May, September, October

      hotels = rawCatalog.map(hotel => {
        const adjustedNightRate = Math.ceil(hotel.baseNightRateGel * seasonalityMultiplier);
        const totalCost = adjustedNightRate * nights;

        return {
          ...hotel,
          baseNightRateGel: adjustedNightRate,
          totalRateGel: totalCost
        };
      });
    }

    return NextResponse.json({
      success: true,
      hotels,
      nights,
      isFallback: !amadeusSucceeded
    });

  } catch (error) {
    console.error("Hotels API Handler Error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

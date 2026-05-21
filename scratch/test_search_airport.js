const apiKey = process.env.RAPIDAPI_KEY;

async function test() {
  const query = 'Tbilisi';
  const url = `https://skyscanner-flights-travel-api.p.rapidapi.com/flights/searchAirport?query=${query}`;
  console.log('Fetching:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'skyscanner-flights-travel-api.p.rapidapi.com'
      }
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();

const apiKey = process.env.RAPIDAPI_KEY;

async function runTest(params) {
  const queryStr = new URLSearchParams(params).toString();
  const url = `https://skyscanner-flights-travel-api.p.rapidapi.com/flights/getCheapestOneway?${queryStr}`;
  console.log('Testing url:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'skyscanner-flights-travel-api.p.rapidapi.com'
      }
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Returned cheapest count:', data.cheapest ? data.cheapest.length : 'undefined');
    if (data.cheapest && data.cheapest.length > 0) {
      console.log('Cheapest preview:', data.cheapest.slice(0, 2));
    } else {
      console.log('Full data:', JSON.stringify(data));
    }
  } catch (err) {
    console.error('Error:', err);
  }
  console.log('------------------------------------');
}

async function testAll() {
  // Test 1: TBS to ROME with GEL
  await runTest({ originSkyId: 'TBS', destinationSkyId: 'ROME', month: '2026-06', currency: 'GEL' });

  // Test 2: TBS to ROME with USD
  await runTest({ originSkyId: 'TBS', destinationSkyId: 'ROME', month: '2026-06', currency: 'USD' });

  // Test 3: TBS to FCO with USD
  await runTest({ originSkyId: 'TBS', destinationSkyId: 'FCO', month: '2026-06', currency: 'USD' });

  // Test 4: TBS to IST (Istanbul) with GEL
  await runTest({ originSkyId: 'TBS', destinationSkyId: 'IST', month: '2026-06', currency: 'GEL' });

  // Test 5: TBS to ROME without month parameter
  await runTest({ originSkyId: 'TBS', destinationSkyId: 'ROME', currency: 'GEL' });
}

testAll();

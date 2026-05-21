async function run() {
  const searchMonth = "2026-06";
  const skyId = "ROME";
  
  try {
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
    console.log("Keys in response:", Object.keys(apiData));
    if (apiData && apiData.cheapest) {
      console.log("Number of items in cheapest:", apiData.cheapest.length);
      console.log("First item in cheapest:", apiData.cheapest[0]);
      console.log("Sample items:", apiData.cheapest.slice(0, 5));
    } else {
      console.log("No cheapest field or empty response:", apiData);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();

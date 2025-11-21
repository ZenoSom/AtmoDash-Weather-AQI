// Netlify Function: proxy.js
// Usage: deploy to Netlify functions. POST/GET with ?url= encoded target or use paths below.
// Example: fetch('/.netlify/functions/proxy?target=airvisual&lat=...&lon=...')
// This keeps your API keys server-side.

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const params = event.queryStringParameters || {};
  const target = params.target || '';
  // Example: /?target=airvisual&lat=...&lon=...
  try {
    if(target === 'airvisual'){
      const lat = params.lat, lon = params.lon;
      const IQAIR_KEY = process.env.IQAIR_API_KEY;
      const url = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${IQAIR_KEY}`;
      const res = await fetch(url);
      const body = await res.text();
      return { statusCode: 200, body };
    }
    if(target === 'openweather'){
      const lat = params.lat, lon = params.lon;
      const OWM_KEY = process.env.OWM_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`;
      const res = await fetch(url);
      const body = await res.text();
      return { statusCode: 200, body };
    }
    return { statusCode: 400, body: 'Missing target param' };
  } catch(err){
    return { statusCode: 500, body: err.message };
  }
};

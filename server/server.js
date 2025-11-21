/*
Simple Express proxy server example.
Install: npm install express node-fetch
Run: OWM_API_KEY=yourkey IQAIR_API_KEY=yourkey node server.js
*/
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy/airvisual', async (req, res) => {
  const { lat, lon } = req.query;
  const IQAIR_KEY = process.env.IQAIR_API_KEY;
  const url = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${IQAIR_KEY}`;
  const r = await fetch(url);
  const body = await r.text();
  res.send(body);
});

app.get('/proxy/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const OWM_KEY = process.env.OWM_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`;
  const r = await fetch(url);
  const body = await r.text();
  res.send(body);
});

app.listen(PORT, ()=>console.log('Server running on', PORT));

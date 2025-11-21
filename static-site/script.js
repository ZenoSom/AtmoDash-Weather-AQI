/* Static dashboard script (same as earlier) */
const OWM_API_KEY = "dfef7665bac1d521b9f2550a99f5d20d";
const IQAIR_API_KEY = "";

const videoMap = {
  Clear: "videos/clear.mp4",
  Clouds: "videos/clouds.mp4",
  PartlyCloudy: "videos/clouds.mp4",
  Rain: "videos/rain.mp4",
  Drizzle: "videos/rain.mp4",
  Thunderstorm: "videos/thunder.mp4",
  Snow: "videos/snow.mp4",
  Fog: "videos/fog.mp4",
  Mist: "videos/fog.mp4",
  Haze: "videos/haze.mp4",
  Smoke: "videos/haze.mp4",
  Dust: "videos/haze.mp4",
  Ash: "videos/haze.mp4"
};

function log(msg){
  const box = document.getElementById('logBox');
  const p = document.createElement('div');
  p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  box.prepend(p);
}

function pickVideo(weather){
  if(!weather) return videoMap.Clear;
  const main = weather.main || "";
  const desc = (weather.description || "").toLowerCase();
  if(main === "Clear") return videoMap.Clear;
  if(main === "Clouds") return videoMap.Clouds;
  if(main === "Rain" || desc.includes("rain")) return videoMap.Rain;
  if(main === "Drizzle") return videoMap.Drizzle;
  if(main === "Thunderstorm") return videoMap.Thunderstorm;
  if(main === "Snow") return videoMap.Snow;
  if(desc.includes("fog") || main==="Fog" || main==="Mist" ) return videoMap.Fog;
  if(desc.includes("haze")||desc.includes("smoke")||desc.includes("dust")) return videoMap.Haze;
  return videoMap.Clouds;
}

async function changeBackgroundVideo(src){
  const video = document.getElementById('bg-video');
  if(!src) return;
  if(video.dataset.src === src) { log('Background already set to ' + src); return; }
  log('Changing background to ' + src);
  const temp = document.createElement('video');
  temp.muted = true;
  temp.loop = true;
  temp.playsInline = true;
  temp.src = src;
  temp.preload = 'auto';
  try {
    await temp.play().catch(()=>{/*ignore*/});
    video.style.opacity = 0;
    await new Promise(r=>setTimeout(r, 600));
    video.src = src;
    video.dataset.src = src;
    await video.play().catch(()=>{/*ignore*/});
    video.style.opacity = 1;
    log('Background updated');
  } catch(e){
    log('Background video error: ' + e.message + ' (maybe missing file)');
  }
}

async function searchCity(cityInputValue){
  const city = cityInputValue || document.getElementById('cityInput').value.trim();
  if(!city){ log('Please enter a city'); return; }
  log('Searching: ' + city);
  const units = document.getElementById('unitsSelect').value || 'metric';
  try {
    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OWM_API_KEY}`);
    const geoData = await geoRes.json();
    if(!geoData || geoData.length === 0){ log('City not found via OpenWeatherMap'); return; }
    const { lat, lon, name, country, state } = geoData[0];
    const displayName = [name, state, country].filter(Boolean).join(', ');
    document.getElementById('cityName').textContent = displayName;

    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OWM_API_KEY}`);
    const weatherData = await weatherRes.json();
    const w = weatherData;
    document.getElementById('temp').textContent = Math.round(w.main.temp) + (units==='metric'?' °C':' °F');
    document.getElementById('humidity').textContent = w.main.humidity + ' %';
    document.getElementById('wind').textContent = (w.wind.speed || '--') + (units==='metric'?' m/s':' mph');
    document.getElementById('pressure').textContent = (w.main.pressure || '--') + ' hPa';
    document.getElementById('condition').textContent = (w.weather?.[0]?.description || '--').replace(/\b\w/g, c=>c.toUpperCase());
    log('Weather updated');

    let aqiValue = null;
    let aqiSource = null;
    if(IQAIR_API_KEY && IQAIR_API_KEY.trim() !== ''){
      try {
        log('Trying IQAir for AQI');
        const iqRes = await fetch(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${IQAIR_API_KEY}`);
        const iq = await iqRes.json();
        if(iq && iq.status === 'success' && iq.data && iq.data.current && iq.data.current.pollution){
          aqiValue = iq.data.current.pollution.aqius;
          aqiSource = 'IQAir';
        }
      } catch(e){
        log('IQAir error: ' + e.message);
      }
    }

    if(aqiValue === null){
      try {
        log('Using OpenWeatherMap Air Pollution API as AQI fallback');
        const aRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`);
        const aData = await aRes.json();
        if(aData && aData.list && aData.list[0] && aData.list[0].main && typeof aData.list[0].main.aqi !== 'undefined'){
          const owmIndex = aData.list[0].main.aqi;
          const mapToUS = {1:50,2:100,3:150,4:200,5:300};
          aqiValue = mapToUS[owmIndex] || '--';
          aqiSource = 'OpenWeatherMap';
        } else {
          log('OpenWeatherMap AQI data missing');
        }
      } catch(e){
        log('OpenWeatherMap AQI error: ' + e.message);
      }
    }

    if(aqiValue === null) { aqiValue = '--'; aqiSource = 'No data'; }
    document.getElementById('aqi').textContent = aqiValue;
    document.getElementById('aqiText').textContent = aqiSource;

    const aqiNum = (typeof aqiValue === 'number')? aqiValue : parseInt(aqiValue) || null;
    const aqiTextEl = document.getElementById('aqiText');
    if(aqiNum !== null){
      if(aqiNum <= 50) aqiTextEl.textContent = '🟢 Good <= 50';
      else if(aqiNum <= 100) aqiTextEl.textContent = '🟡 Moderate <= 100';
      else if(aqiNum <= 150) aqiTextEl.textContent = '🟠 Unhealthy for Sensitive <= 150';
      else if(aqiNum <= 200) aqiTextEl.textContent = '🔴 Unhealthy <= 200';
      else if(aqiNum <= 300) aqiTextEl.textContent = '🟤 Very Unhealthy<= 300';
      else aqiTextEl.textContent = '⚫️ Hazardous  😷';
    }

    const chosenVideo = pickVideo(w.weather?.[0]);
    await changeBackgroundVideo(chosenVideo);

  } catch(err){
    log('Search error: ' + err.message);
  }
}

document.getElementById('searchBtn').addEventListener('click', ()=>searchCity());
document.getElementById('cityInput').addEventListener('keydown', (e)=>{ if(e.key === 'Enter') searchCity(); });

window.addEventListener('load', ()=>{
  Object.values(videoMap).forEach(src=>{
    const v = document.createElement('video');
    v.src = src;
    v.preload = 'auto';
  });
  const bgv = document.getElementById('bg-video');
  bgv.src = 'videos/clear.mp4';
  bgv.dataset.src = 'videos/clear.mp4';
  bgv.muted = true;
  bgv.loop = true;
  bgv.playsInline = true;
  bgv.autoplay = true;
  bgv.play().catch(()=>{/*ignore*/});
  searchCity('Delhi');
});

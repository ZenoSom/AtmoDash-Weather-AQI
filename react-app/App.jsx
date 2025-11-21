import React, {useState, useEffect, useRef} from 'react'

const OWM_API_KEY = "REPLACE_WITH_OPENWEATHERMAP_KEY";
const IQAIR_API_KEY = "";

const videoMap = {
  Clear: "/videos/clear.mp4",
  Clouds: "/videos/clouds.mp4",
  Rain: "/videos/rain.mp4",
  Thunderstorm: "/videos/thunder.mp4",
  Snow: "/videos/snow.mp4",
  Fog: "/videos/fog.mp4",
  Haze: "/videos/haze.mp4"
};

export default function App(){
  const [city, setCity] = useState('Delhi');
  const [data, setData] = useState(null);
  const videoRef = useRef();

  useEffect(()=>{
    fetchCity(city);
    // preload videos
    Object.values(videoMap).forEach(src=>{
      const v = document.createElement('video'); v.src = src; v.preload='auto';
    });
  }, []);

  async function fetchCity(q){
    try{
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${OWM_API_KEY}`);
      const geoData = await geoRes.json();
      if(!geoData || geoData.length===0) return;
      const {lat, lon, name, country, state} = geoData[0];
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`);
      const w = await weatherRes.json();
      setData({name, country, w});
      const chosen = (w.weather?.[0]?.main) || 'Clear';
      const src = videoMap[chosen] || videoMap['Clouds'];
      if(videoRef.current){
        videoRef.current.src = src;
        videoRef.current.play().catch(()=>{});
      }
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div>
      <div id="bg-wrap">
        <video id="bg-video" ref={videoRef} autoPlay muted loop playsInline />
        <div id="bg-overlay"></div>
      </div>
      <div style={{position:'relative',zIndex:2,padding:20}}>
        <h1>React Weather Dashboard</h1>
        <input value={city} onChange={e=>setCity(e.target.value)} />
        <button onClick={()=>fetchCity(city)}>Search</button>
        <div>
          <h2>{data?.name}</h2>
          <pre>{JSON.stringify(data?.w?.main,null,2)}</pre>
        </div>
      </div>
    </div>
  )
}

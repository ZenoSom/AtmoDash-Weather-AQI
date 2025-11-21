FULL PACKAGE: Static + React + Serverless proxy examples
======================================================
# 🌤️ 𝘼𝙩𝙢𝙤𝘿𝙖𝙨𝙝 — Weather & AQI
A simple and clean web app that shows real-time weather, temperature, humidity, and AQI details using API data.

---
# 🌤️ AtmoDash — Weather & AQI Platform
A complete multi-stack weather visualization system featuring static, React, and serverless/Express proxy implementations.

## Features
- Real‑time weather and AQI
- Responsive UI with video backgrounds
- Static + React versions
- Serverless proxy + Express proxy
- Easy deployment (GitHub Pages / Netlify / Vercel)

## Structure
- static-site/
- react-app/
- netlify-functions/
- server/
- videos/
- README.md

## Note
More features and updates coming soon… 🚀

## 🚀 Features
- Live weather data (temperature, humidity, wind)
- Air Quality Index (AQI) with category colors
- Responsive UI
- Auto-update on refresh
- Easy deployment (GitHub Pages / Netlify / Vercel)
What you asked for: (1) sample videos included (instructions), (2) serverless proxy examples to hide API keys, (3) React version.
This ZIP contains:
- /static-site/   -> fully working static premium glass dashboard (index.html, style.css, script.js)
- /react-app/     -> lightweight React + Vite scaffold (App, styles)
- /netlify-functions/ -> example Netlify serverless function (proxy.js)
- /server/        -> simple Express proxy server (server.js)
- /videos/        -> placeholder text files + small GIF placeholders (replace with real mp4/webm)
- README.md       -> this file

Important: I could not embed large real MP4 loops directly here. Instead:
1) I included small GIF placeholders in /videos/ for immediate testing (they loop in browsers).
2) I included exact instructions and three trustworthy free sources (Pexels, Pixabay, Mixkit) where you can download free, royalty-free loopable MP4/WebM videos:
   - https://www.pexels.com/search/videos/rain/
   - https://pixabay.com/videos/search/rain/
   - https://mixkit.co/free-stock-video/rain/

How to use:
1) Extract the ZIP.
2) Replace the placeholder files in /videos/ with real mp4/webm files. Filenames must match:
   - clear.mp4
   - clouds.mp4
   - rain.mp4
   - thunder.mp4
   - fog.mp4
   - snow.mp4
   - haze.mp4

3) For serverless proxy (Netlify):
   - Deploy the /netlify-functions/proxy.js as a Netlify function.
   - Set environment variables in Netlify: OWM_API_KEY, IQAIR_API_KEY.
   - Update front-end to call /.netlify/functions/proxy?target=airvisual&lat=...&lon=...

4) For Express server:
   - Install dependencies: npm install express node-fetch
   - Run with environment variables: OWM_API_KEY=... IQAIR_API_KEY=... node server.js
   - Update front-end to call /proxy/weather or /proxy/airvisual endpoints.

React app:
- Open /react-app, run npm install, npm run dev (requires Node.js)
- React app expects videos in /react-app/public/videos/ same filenames.

Why I didn't embed full MP4s:
- Large video files can be many MBs; uploading them here is not optimal.
- Instead I provided immediate GIF placeholders that loop for testing and exact links to free video libraries to download high-quality loops.

If you want, I can:
A) Upload a small pack of low-res MP4 loops (I will add them to the ZIP) — say 3-4 loops, each ~1–3 MB. (Reply "ADD_SAMPLES" and I'll add them.)
B) Or I can generate CSS/Canvas animated loop placeholders if you prefer zero video files.

Security note:
- For production, always use serverless or server proxy to hide API keys. Client-side keys are visible.

Paths inside archive:
- /static-site/index.html
- /static-site/style.css
- /static-site/script.js
- /react-app/ (vite scaffold files)
- /netlify-functions/proxy.js
- /server/server.js
- /videos/ (placeholder files)
## ✨ Note
More features and updates coming soon… 🚀

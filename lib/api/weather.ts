export async function fetchLiveWeather(lat: number, lng: number) {
  const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  try {
    // 1. Fetch OpenWeather Data (Temp, Humidity, Wind, Icon)
    let weatherData = null;
    if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== "YOUR_OPENWEATHER_API_KEY_HERE") {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      if (weatherRes.ok) {
        const rawWeather = await weatherRes.json();
        weatherData = {
          temp: Math.round(rawWeather.main.temp),
          description: rawWeather.weather[0].description,
          icon: rawWeather.weather[0].icon,
          windSpeed: rawWeather.wind.speed,
          humidity: rawWeather.main.humidity,
        };
      }
    } else {
      // Real fallback when no OpenWeather key is configured.
      const fallbackRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );
      if (fallbackRes.ok) {
        const fallback = await fallbackRes.json();
        const current = fallback?.current;
        const weatherCode = Number(current?.weather_code ?? 1);
        const icon = weatherCode >= 51 ? "10d" : weatherCode >= 3 ? "03d" : "01d";
        weatherData = {
          temp: Math.round(current?.temperature_2m ?? 0),
          description: "Live weather (Open-Meteo)",
          icon,
          windSpeed: Number(current?.wind_speed_10m ?? 0),
          humidity: Number(current?.relative_humidity_2m ?? 0),
        };
      }
    }

    if (!weatherData) {
      weatherData = {
        temp: 0,
        description: "Weather unavailable",
        icon: "02d",
        windSpeed: 0,
        humidity: 0,
      };
    }

    // 2. Fetch Open-Meteo Data (UV Index) - Free, no API key needed!
    const uvRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=uv_index_max&timezone=auto`
    );
    let uvIndex = 0;
    if (uvRes.ok) {
      const rawUV = await uvRes.json();
      uvIndex = rawUV.daily.uv_index_max[0] || 0;
    }

    return { weather: weatherData, uvIndex };

  } catch (error) {
    console.error("Error fetching weather APIs:", error);
    throw new Error("Failed to load weather data");
  }
}

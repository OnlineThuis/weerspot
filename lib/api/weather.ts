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
      // Mock data if API key is missing
      weatherData = {
        temp: 18,
        description: "API Key Required",
        icon: "02d",
        windSpeed: 5.4,
        humidity: 65,
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


"use strict";

/* ========================================
   Uttarakhand Explorer — Live Weather
   File: ../js/weather.js
   API: Open-Meteo
======================================== */

const WEATHER_LOCATIONS = [
  {
    name: "Dehradun",
    region: "Garhwal",
    latitude: 30.3165,
    longitude: 78.0322
  },
  {
    name: "Mussoorie",
    region: "Queen of the Hills",
    latitude: 30.4598,
    longitude: 78.0644
  },
  {
    name: "Nainital",
    region: "Kumaon",
    latitude: 29.3919,
    longitude: 79.4542
  },
  {
    name: "Rishikesh",
    region: "Yoga Capital",
    latitude: 30.0869,
    longitude: 78.2676
  },
  {
    name: "Haridwar",
    region: "Holy City",
    latitude: 29.9457,
    longitude: 78.1642
  },
  {
    name: "Auli",
    region: "Mountain Destination",
    latitude: 30.5281,
    longitude: 79.5664
  },
  {
    name: "Joshimath",
    region: "Chamoli",
    latitude: 30.5550,
    longitude: 79.5644
  },
  {
    name: "Uttarkashi",
    region: "Upper Garhwal",
    latitude: 30.7268,
    longitude: 78.4354
  },
  {
    name: "Pithoragarh",
    region: "Eastern Kumaon",
    latitude: 29.5829,
    longitude: 80.2182
  },
  {
    name: "Tehri",
    region: "Tehri Garhwal",
    latitude: 30.3909,
    longitude: 78.4803
  }
];

const API_URL = "https://api.open-meteo.com/v1/forecast";

const weatherGrid = document.getElementById("weatherGrid");
const weatherStatus = document.getElementById("weatherStatus");
const refreshButton = document.getElementById("refreshWeather");

const weatherCodes = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Moderate drizzle", "🌦️"],
  55: ["Dense drizzle", "🌧️"],
  56: ["Light freezing drizzle", "🌧️"],
  57: ["Dense freezing drizzle", "🌧️"],
  61: ["Light rain", "🌦️"],
  63: ["Moderate rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  66: ["Light freezing rain", "🌧️"],
  67: ["Heavy freezing rain", "🌧️"],
  71: ["Light snowfall", "🌨️"],
  73: ["Moderate snowfall", "❄️"],
  75: ["Heavy snowfall", "❄️"],
  77: ["Snow grains", "🌨️"],
  80: ["Light rain showers", "🌦️"],
  81: ["Moderate rain showers", "🌧️"],
  82: ["Violent rain showers", "⛈️"],
  85: ["Light snow showers", "🌨️"],
  86: ["Heavy snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Severe thunderstorm with hail", "⛈️"]
};

function getWeatherInfo(code) {
  return weatherCodes[code] || ["Conditions unavailable", "🌡️"];
}

function formatNumber(value, suffix = "") {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return `${Math.round(value * 10) / 10}${suffix}`;
}

function formatDate(dateString, options) {
  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function setStatus(message, type = "") {
  weatherStatus.textContent = message;
  weatherStatus.className = "weather-status";

  if (type) {
    weatherStatus.classList.add(type);
  }
}

function getForecastRows(daily) {
  if (!daily || !Array.isArray(daily.time)) {
    return "";
  }

  return daily.time.map((date, index) => {
    const info = getWeatherInfo(daily.weather_code?.[index]);

    const day = index === 0
      ? "Today"
      : formatDate(date, { weekday: "short" });

    const high = formatNumber(daily.temperature_2m_max?.[index], "°");
    const low = formatNumber(daily.temperature_2m_min?.[index], "°");

    const rainValue = daily.precipitation_probability_max?.[index];
    const rain = rainValue === null || rainValue === undefined
      ? "Rain —"
      : `Rain ${Math.round(rainValue)}%`;

    return `
      <div class="forecast-day">
        <span class="forecast-day-name">${escapeHTML(day)}</span>
        <span class="forecast-icon" title="${escapeHTML(info[0])}">
          ${info[1]}
        </span>
        <span class="forecast-temperatures">
          <span>${escapeHTML(high)}</span>
          <span class="forecast-low">${escapeHTML(low)}</span>
        </span>
        <span class="forecast-rain">${escapeHTML(rain)}</span>
      </div>
    `;
  }).join("");
}

function renderWeatherCard(location, data) {
  const current = data.current || {};
  const info = getWeatherInfo(current.weather_code);

  const temperature = formatNumber(current.temperature_2m, "°C");
  const feelsLike = formatNumber(current.apparent_temperature, "°C");
  const humidity = formatNumber(current.relative_humidity_2m, "%");
  const wind = formatNumber(current.wind_speed_10m, " km/h");

  const forecast = getForecastRows(data.daily);

  return `
    <article class="weather-card">
      <div class="weather-card-header">
        <div>
          <h3 class="weather-location">${escapeHTML(location.name)}</h3>
          <p class="weather-region">${escapeHTML(location.region)}</p>
        </div>
        <span class="weather-icon" aria-label="${escapeHTML(info[0])}">
          ${info[1]}
        </span>
      </div>

      <div class="weather-current">
        <div class="weather-temperature">${escapeHTML(temperature)}</div>
        <div>
          <div class="weather-description">${escapeHTML(info[0])}</div>
          <div class="weather-feels-like">
            Feels like ${escapeHTML(feelsLike)}
          </div>
        </div>
      </div>

      <div class="weather-details">
        <div class="weather-detail">
          <span class="weather-detail-label">💧 Humidity</span>
          <span class="weather-detail-value">${escapeHTML(humidity)}</span>
        </div>

        <div class="weather-detail">
          <span class="weather-detail-label">💨 Wind</span>
          <span class="weather-detail-value">${escapeHTML(wind)}</span>
        </div>

        <div class="weather-detail">
          <span class="weather-detail-label">🌡️ Feels like</span>
          <span class="weather-detail-value">${escapeHTML(feelsLike)}</span>
        </div>
      </div>

      <div class="weather-forecast">
        <h3>📅 7-Day Forecast</h3>
        <div class="forecast-list">
          ${forecast || "<p>Forecast unavailable.</p>"}
        </div>
      </div>
    </article>
  `;
}

function renderErrorCard(location) {
  return `
    <article class="weather-card">
      <div class="weather-card-header">
        <div>
          <h3 class="weather-location">${escapeHTML(location.name)}</h3>
          <p class="weather-region">${escapeHTML(location.region)}</p>
        </div>
        <span class="weather-icon">⚠️</span>
      </div>
      <p class="weather-description">
        Weather data is currently unavailable for this destination.
        Please try refreshing the page.
      </p>
    </article>
  `;
}

async function fetchWeather(location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum"
    ].join(","),
    forecast_days: "7",
    timezone: "auto"
  });

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const data = await response.json();

  if (!data.current || !data.daily) {
    throw new Error("Weather data is incomplete");
  }

  return data;
}

async function loadWeather() {
  if (!weatherGrid || !weatherStatus || !refreshButton) {
    console.error("Weather page elements were not found.");
    return;
  }

  refreshButton.disabled = true;
  refreshButton.textContent = "↻ Loading...";
  setStatus("Fetching the latest weather data...");

  weatherGrid.innerHTML = WEATHER_LOCATIONS.map(() =>
    '<div class="weather-loading" aria-hidden="true"></div>'
  ).join("");

  try {
    const results = await Promise.allSettled(
      WEATHER_LOCATIONS.map(async location => ({
        location,
        data: await fetchWeather(location)
      }))
    );

    let successful = 0;

    weatherGrid.innerHTML = results.map((result, index) => {
      const location = WEATHER_LOCATIONS[index];

      if (result.status === "fulfilled") {
        successful++;
        return renderWeatherCard(
          result.value.location,
          result.value.data
        );
      }

      console.error(
        `Could not load weather for ${location.name}:`,
        result.reason
      );

      return renderErrorCard(location);
    }).join("");

    if (successful === WEATHER_LOCATIONS.length) {
      const updatedAt = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date());

      setStatus(
        `Weather loaded successfully for all ${successful} destinations. ` +
        `Updated on this page at ${updatedAt}.`,
        "success"
      );
    } else if (successful > 0) {
      setStatus(
        `Weather loaded for ${successful} of ${WEATHER_LOCATIONS.length} ` +
        "destinations. Some locations could not be reached. Try refreshing.",
        "error"
      );
    } else {
      setStatus(
        "Weather data could not be loaded. Check your internet connection " +
        "and try again.",
        "error"
      );
    }
  } catch (error) {
    console.error("Weather loading error:", error);

    weatherGrid.innerHTML = "";
    setStatus(
      "Something went wrong while loading weather data. Please try again.",
      "error"
    );
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "↻ Refresh weather";
  }
}

if (refreshButton) {
  refreshButton.addEventListener("click", loadWeather);
}

if (weatherGrid && weatherStatus && refreshButton) {
  loadWeather();
}
    
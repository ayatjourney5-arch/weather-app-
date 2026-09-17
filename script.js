const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const weatherContent = document.getElementById("weatherContent");
const welcome = document.getElementById("welcome");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDate = document.getElementById("weatherDate");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const cloudCover = document.getElementById("cloudCover");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");


// Weather code descriptions
const weatherCodes = {

    0: {
        text: "Clear Sky",
        icon: "☀️"
    },

    1: {
        text: "Mainly Clear",
        icon: "🌤️"
    },

    2: {
        text: "Partly Cloudy",
        icon: "⛅"
    },

    3: {
        text: "Overcast",
        icon: "☁️"
    },

    45: {
        text: "Foggy",
        icon: "🌫️"
    },

    48: {
        text: "Foggy",
        icon: "🌫️"
    },

    51: {
        text: "Light Drizzle",
        icon: "🌦️"
    },

    53: {
        text: "Drizzle",
        icon: "🌦️"
    },

    55: {
        text: "Heavy Drizzle",
        icon: "🌧️"
    },

    61: {
        text: "Light Rain",
        icon: "🌦️"
    },

    63: {
        text: "Rain",
        icon: "🌧️"
    },

    65: {
        text: "Heavy Rain",
        icon: "🌧️"
    },

    71: {
        text: "Light Snow",
        icon: "🌨️"
    },

    73: {
        text: "Snow",
        icon: "❄️"
    },

    75: {
        text: "Heavy Snow",
        icon: "❄️"
    },

    80: {
        text: "Rain Showers",
        icon: "🌦️"
    },

    81: {
        text: "Rain Showers",
        icon: "🌧️"
    },

    82: {
        text: "Heavy Rain Showers",
        icon: "⛈️"
    },

    95: {
        text: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        text: "Thunderstorm with Hail",
        icon: "⛈️"
    },

    99: {
        text: "Heavy Thunderstorm",
        icon: "⛈️"
    }

};


// Search form
searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);

});


// Popular city buttons
document.querySelectorAll(".city-btn").forEach(button => {

    button.addEventListener("click", function() {

        const city = this.dataset.city;

        cityInput.value = city;

        getWeather(city);

    });

});


// Main weather function
async function getWeather(city) {

    showLoading();
    clearError();

    try {

        // Step 1: Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to location service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`No location found for "${city}".`);
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to load weather information.");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData);

    } catch (error) {

        console.error(error);

        showError(error.message || "Something went wrong. Please try again.");

        weatherContent.classList.add("hidden");
        welcome.classList.remove("hidden");

    } finally {

        hideLoading();

    }

}


// Display weather
function displayWeather(location, data) {

    const current = data.current;

    const weatherInfo =
        weatherCodes[current.weather_code] || {
            text: "Unknown",
            icon: "🌤️"
        };


    // Location
    cityName.textContent = location.name;

    countryName.textContent =
        `${location.country}${location.admin1 ? " • " + location.admin1 : ""}`;


    // Temperature
    temperature.textContent =
        Math.round(current.temperature_2m);

    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;


    // Weather
    weatherCondition.textContent =
        weatherInfo.text;

    weatherIcon.textContent =
        weatherInfo.icon;


    // Details
    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    windSpeed.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    cloudCover.textContent =
        `${current.cloud_cover}%`;


    // Date
    const date = new Date(current.time);

    weatherDate.textContent =
        date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });


    // Sunrise & Sunset
    if (data.daily) {

        sunrise.textContent =
            formatTime(data.daily.sunrise[0]);

        sunset.textContent =
            formatTime(data.daily.sunset[0]);

    }


    // Show result
    weatherContent.classList.remove("hidden");
    welcome.classList.add("hidden");

}


// Format time
function formatTime(timeString) {

    if (!timeString) {
        return "--:--";
    }

    const date = new Date(timeString);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

}


// Loading state
function showLoading() {

    loading.classList.add("active");

    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";

}

function hideLoading() {

    loading.classList.remove("active");

    searchBtn.disabled = false;
    searchBtn.textContent = "Search";

}


// Error
function showError(message) {

    errorMessage.textContent = message;

}

function clearError() {

    errorMessage.textContent = "";

}


// Optional: Load Islamabad automatically
window.addEventListener("load", function() {

    getWeather("Islamabad");

});

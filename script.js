function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
document.getElementById("location").textContent = data.name.normalize("NFKD");
document.getElementById('location-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});

async function fetchWeather(location = null) {
    document.getElementById('error-message').style.display = 'none';
    if (!location) {
        location = document.getElementById('location-input').value;
    }
    if (!location) return;

    const apiKey = '933abea06bc7e1a1d8d3c77b1fc0af07';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        if (weatherData.cod !== "200") throw new Error(weatherData.message);

        document.getElementById('location').textContent = `${weatherData.city.name}, ${weatherData.city.country}`;
        document.getElementById('temperature').innerHTML = `${weatherData.list[0].main.temp}&deg;C`;
        document.getElementById('description').textContent = weatherData.list[0].weather[0].description;
        document.getElementById('humidity').textContent = `Humidity: ${weatherData.list[0].main.humidity}% | Wind: ${weatherData.list[0].wind.speed} kph`;

        const forecastEl = document.getElementById("forecast");

        for (let i = 0; i < 5; i++) {
            const weatherMain = weatherData.list[i].weather[0].main;
            const temperature = weatherData.list[i].main.temp;
            const date = new Date(weatherData.list[i].dt_txt).toLocaleDateString();

            // Map weather conditions to emojis
            let weatherIcon = "🌦️"; // default
            switch (weatherMain) {
                case "Clear":
                    weatherIcon = "☀️";
                    break;
                case "Clouds":
                    weatherIcon = "☁️";
                    break;
                case "Rain":
                    weatherIcon = "🌧️";
                    break;
                case "Thunderstorm":
                    weatherIcon = "⛈️";
                    break;
                case "Snow":
                    weatherIcon = "❄️";
                    break;
                case "Drizzle":
                    weatherIcon = "🌦️";
                    break;
                case "Mist":
                case "Fog":
                case "Haze":
                    weatherIcon = "🌫️";
                    break;
                default:
                    weatherIcon = "🌡️";
            }

            forecastEl.innerHTML += `<div>${date}<br>${weatherIcon} ${temperature}&deg;C</div>`;
        }
    }
    catch (error) {
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').style.display = 'block';
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '933abea06bc7e1a1d8d3c77b1fc0af07';
            const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
            const response = await fetch(reverseGeoUrl);
            const data = await response.json();
            if (data.length) fetchWeather(data[0].name);
        });
    }
}


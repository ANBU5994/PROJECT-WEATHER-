// script.js
// Handles weather search, API calls, and UI updates

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const weatherResult = document.getElementById('weather-result');
    const forecastCards = document.getElementById('forecast-cards');
    const spinner = document.getElementById('spinner');
    const developerInfo = document.getElementById('developer-info');

    function showSpinner(show) {
        spinner.style.display = show ? 'block' : 'none';
    }

    function fadeIn(element) {
        element.classList.add('fade-in');
    }

    function clearResults() {
    weatherResult.innerHTML = '';
    forecastCards.innerHTML = '';
    developerInfo.innerHTML = '';
    }

    searchBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') fetchWeather();
    });

    function fetchWeather() {
        const city = cityInput.value.trim();
        if (!city) {
            weatherResult.innerHTML = '<p style="color:red;">Please enter a city name.</p>';
            return;
        }
        clearResults();
        showSpinner(true);
        fetch('/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city })
        })
        .then(res => res.json())
        .then(data => {
            showSpinner(false);
            if (data.error) {
                weatherResult.innerHTML = `<p style='color:red;'>${data.error}</p>`;
                developerInfo.innerHTML = '';
                return;
            }
            displayCurrentWeather(data.current);
            displayForecast(data.forecast);
            if (data.developed_by && data.datetime) {
                developerInfo.innerHTML = `Developed by <strong>${data.developed_by}</strong> &mdash; <span>${data.datetime}</span>`;
            }
        })
        .catch(() => {
            showSpinner(false);
            weatherResult.innerHTML = '<p style="color:red;">Network error. Please try again.</p>';
        });
    }

    function displayCurrentWeather(current) {
        const html = `
        <div class="weather-card">
            <div class="weather-info">
                <h2>${current.city}</h2>
                <p><strong>${current.condition}</strong></p>
                <p>Temp: ${current.temperature_c}°C / ${current.temperature_f}°F</p>
                <p>Humidity: ${current.humidity}%</p>
                <p>Wind: ${current.wind_speed} m/s</p>
            </div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${current.icon}@2x.png" alt="icon">
        </div>
        `;
        weatherResult.innerHTML = html;
        fadeIn(weatherResult);
    }

    function displayForecast(forecast) {
        let html = '';
        forecast.forEach(day => {
            html += `
            <div class="forecast-card slide-in">
                <p><strong>${day.date}</strong></p>
                <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.icon}.png" alt="icon">
                <p>${day.condition}</p>
                <p>${day.temperature_c}°C</p>
            </div>
            `;
        });
        forecastCards.innerHTML = html;
        fadeIn(forecastCards);
    }
});

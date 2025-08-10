# Weather Prediction Program

A Python program that fetches and displays the current weather and a 3-day forecast for a given city using the OpenWeatherMap API.

## Features

- Takes a city name as input from the user.
- Retrieves current temperature (in Celsius and Fahrenheit).
- Shows weather condition (clear, cloudy, rainy, etc.).
- Displays humidity and wind speed.
- Provides a 3-day weather forecast.
- Handles errors such as invalid city names or API request failures.
- Formats output in a clean and readable way.
- Uses environment variables to securely manage the API key.

## Technologies Used

- Python 3.x
- `requests` library for HTTP requests
- `python-dotenv` for loading environment variables
- OpenWeatherMap API for weather data

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-prediction.git
   cd weather-prediction

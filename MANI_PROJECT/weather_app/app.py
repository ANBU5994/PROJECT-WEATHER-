from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = 'https://api.openweathermap.org/data/2.5/'

# Helper function to convert temperature
def kelvin_to_celsius_fahrenheit(kelvin):
    celsius = kelvin - 273.15
    fahrenheit = celsius * 9/5 + 32
    return round(celsius, 2), round(fahrenheit, 2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    city = data.get('city')
    if not city:
        return jsonify({'error': 'City name is required.'}), 400
    try:
        # Current weather
        weather_url = f"{BASE_URL}weather?q={city}&appid={API_KEY}"
        weather_res = requests.get(weather_url, timeout=5)
        if weather_res.status_code != 200:
            return jsonify({'error': 'City not found.'}), 404
        weather_data = weather_res.json()
        temp_c, temp_f = kelvin_to_celsius_fahrenheit(weather_data['main']['temp'])
        current = {
            'city': weather_data['name'],
            'temperature_c': temp_c,
            'temperature_f': temp_f,
            'condition': weather_data['weather'][0]['main'],
            'icon': weather_data['weather'][0]['icon'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed']
        }
        # 3-day forecast
        forecast_url = f"{BASE_URL}forecast?q={city}&appid={API_KEY}"
        forecast_res = requests.get(forecast_url, timeout=5)
        forecast_data = forecast_res.json()
        forecast_list = []
        days_added = set()
        for item in forecast_data['list']:
            date = item['dt_txt'].split(' ')[0]
            if date not in days_added and len(days_added) < 3:
                temp_c, temp_f = kelvin_to_celsius_fahrenheit(item['main']['temp'])
                forecast_list.append({
                    'date': date,
                    'temperature_c': temp_c,
                    'temperature_f': temp_f,
                    'condition': item['weather'][0]['main'],
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed']
                })
                days_added.add(date)
        from datetime import datetime
        developed_by = "Anbazhagan"
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return jsonify({
            'current': current,
            'forecast': forecast_list,
            'developed_by': developed_by,
            'datetime': now
        })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch weather data.'}), 500

if __name__ == '__main__':
    app.run(debug=True)

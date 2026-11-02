import streamlit as st
import requests
import pandas as pd
import plotly.express as px

st.set_page_config(
    page_title="Real-Time Weather Dashboard",
    layout="wide"
)

st.title("🌤️ Real-Time Weather Dashboard")

# --------------------------------
# City selection
# --------------------------------

cities = {
    "Coimbatore": (11.0168, 76.9558),
    "Chennai": (13.0827, 80.2707),
    "Bengaluru": (12.9716, 77.5946),
    "Mumbai": (19.0760, 72.8777)
}

city = st.selectbox("Select City", list(cities.keys()))
latitude, longitude = cities[city]

# --------------------------------
# API (cached for 10 minutes)
# --------------------------------

@st.cache_data(ttl=600)
def get_weather(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m",
        "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m",
        "forecast_days": 1,
        "timezone": "auto"          # local time instead of GMT
    }
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    return r.json()

try:
    data = get_weather(latitude, longitude)
except requests.RequestException as e:
    st.error(f"API request failed: {e}")
    st.stop()

# --------------------------------
# Current weather
# --------------------------------

current = data["current"]

st.subheader(f"Current Weather - {city}")
col1, col2, col3 = st.columns(3)
col1.metric("🌡️ Temperature", f"{current['temperature_2m']} °C")
col2.metric("💧 Humidity", f"{current['relative_humidity_2m']} %")
col3.metric("🌬️ Wind Speed", f"{current['wind_speed_10m']} km/h")

# --------------------------------
# DataFrame
# --------------------------------

hourly = data["hourly"]

df = pd.DataFrame({
    "Time": pd.to_datetime(hourly["time"]),
    "Temperature": hourly["temperature_2m"],
    "Humidity": hourly["relative_humidity_2m"],
    "Wind Speed": hourly["wind_speed_10m"]
})

# --------------------------------
# Charts
# --------------------------------

def line_chart(column, label, unit):
    st.subheader(label)
    fig = px.line(
        df,
        x="Time",
        y=column,
        markers=True,
        title=f"{column} Forecast - {city}",
        labels={column: f"{column} ({unit})"}
    )
    # No use_container_width: it's deprecated/removed in newer Streamlit,
    # and charts already stretch to full width by default.
    st.plotly_chart(fig)

line_chart("Temperature", "🌡️ Temperature Forecast", "°C")
line_chart("Humidity", "💧 Humidity Forecast", "%")
line_chart("Wind Speed", "🌬️ Wind Speed Forecast", "km/h")

# --------------------------------
# Data table
# --------------------------------

st.subheader("📊 Weather Data")
st.dataframe(df)    
    
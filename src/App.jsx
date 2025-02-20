import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaWind, FaTint, FaCompressArrowsAlt } from "react-icons/fa";
import "./app.css";

const App = () => {
  const [city, setCity] = useState("mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const API_KEY = "d6b1beb5cb617e15c941bbe565743b59"; 

  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather(null);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod === "200") {
        const dailyData = data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecast(dailyData);
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  return (
    <div className="weather-container">
      <div className="search-box d-flex justify-content-between mt-5 position-relative mb-3">
        <input
          type="text"
          className="form-control pr-5" 
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="btn btn-light search-btn position-absolute bottom-0 end-0"
          onClick={() => {
            fetchWeather();
            fetchForecast();
          }}
        >
          <FaSearch />
        </button>
      </div>

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <h5>{weather.weather[0].description}</h5>
          <h1>{weather.main.temp}°C</h1>
          <h6>Feels like: {weather.main.feels_like}°C</h6>

          <div className="weather-details">
            <div className="detail-box humidity">
              <FaTint className="detail-icon text-primary" />
              <p>{weather.main.humidity}%</p>
              <span>Humidity</span>
            </div>
            <div className="detail-box wind-speed">
              <FaWind className="detail-icon text-info" />
              <p>{weather.wind.speed} m/s</p>
              <span>Wind Speed</span>
            </div>
            <div className="detail-box pressure">
              <FaCompressArrowsAlt className="detail-icon text-warning" />
              <p>{weather.main.pressure} hPa</p>
              <span>Pressure</span>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div
          className="forecast-container mt-3"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <h3>5-Day Forecast</h3>
          <div
            className="forecast-cards d-flex justify-content-evenly"
            style={{ overflow: "hidden" }}
          >
            {forecast.map((day, index) => (
              <div
                className="forecast-card"
                key={index}
                style={{ width: "150px", margin: "0 10px" }}
              >
                <h5>
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </h5>
                <p>{day.main.temp}°C</p>
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

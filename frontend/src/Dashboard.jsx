import ChatBot from "./Chatbot";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import "./App.css";
function Dashboard() {
const API_URL = "https://forest-fire-prediction-5.onrender.com";
  const [form, setForm] = useState({
    city: "Delhi",
    temperature: "",
    humidity: "",
    wind: "",
    rain: "",
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showMap, setShowMap] = useState(false);

const [selectedPosition, setSelectedPosition] =
  useState([28.6139, 77.2090]);

  const humidityRef = useRef(null);
  const windRef = useRef(null);
  const rainRef = useRef(null);

    const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };
    const fetchHistory = async () => {
    try {
      const response = await axios.get(
  `${API_URL}/history`
);
      setHistory(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);
    const predictFire = async () => {

    try {

      const response = await axios.post(
  `${API_URL}/predict`,
        {
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          wind: Number(form.wind),
          rain: Number(form.rain),
        }
      );

      setResult(response.data);

      fetchHistory();

    } catch (error) {

      console.error(error);

      alert("Prediction Failed");

    }
  };
    const getCurrentWeather = async () => {

    try {

      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=a6783b3e0a794bc7b6f191506260806&q=${form.city}`
      );

      const data = response.data;

      setForm((prev) => ({
  ...prev,
  temperature: data.current.temp_c,
  humidity: data.current.humidity,
  wind: data.current.wind_kph,
  rain: data.current.precip_mm || 0,
}));

    } catch (error) {

      console.error(error);

      alert("Unable to fetch weather");

    }
  };
    const searchCities = async (query) => {

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {

      const response = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=a6783b3e0a794bc7b6f191506260806&q=${query}`
      );

      setSuggestions(response.data);

    } catch (error) {

      console.error(error);

    }
  };
    const getUserLocation = () => {

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {

          const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=a6783b3e0a794bc7b6f191506260806&q=${lat},${lon}`
          );

          const data = response.data;

          setForm({
            city: `${data.location.name}, ${data.location.region}`,
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            wind: data.current.wind_kph,
            rain: 0,
          });

        } catch (error) {

          console.error(error);

        }
      },

      (error) => {
        alert("Location access denied");
      }
    );
  };
  function LocationMarker() {
  useMapEvents({
    click(e) {
      setSelectedPosition([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  return (
    <Marker position={selectedPosition} />
  );
}
    const resetData = () => {

    if (window.confirm("Clear all data?")) {

      setForm({
        city: "Delhi",
        temperature: "",
        humidity: "",
        wind: "",
        rain: "",
      });

      setResult(null);

    }
  };
    const downloadReport = () => {

    if (!result) {

      alert("Generate prediction first");

      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(20);

    pdf.text(
      "Forest Fire Prediction Report",
      20,
      20
    );

    pdf.setFontSize(12);

    pdf.text(
      `Location: ${form.city}`,
      20,
      40
    );

    pdf.text(
      `Temperature: ${form.temperature} °C`,
      20,
      55
    );

    pdf.text(
      `Humidity: ${form.humidity}%`,
      20,
      65
    );

    pdf.text(
      `Wind Speed: ${form.wind} km/h`,
      20,
      75
    );

    pdf.text(
      `Rainfall: ${form.rain} mm`,
      20,
      85
    );

    pdf.text(
      `Probability: ${Number(
        result.probability
      ).toFixed(2)}%`,
      20,
      105
    );

    pdf.text(
      `Risk Level: ${result.risk_level}`,
      20,
      115
    );

    pdf.save(
      "Forest_Fire_Report.pdf"
    );
  };
  const getRecommendations = (risk) => {
  switch (risk?.toUpperCase()) {
    case "HIGH":
      return [
        "⚠ Avoid open flames and campfires",
        "⚠ Increase forest patrol frequency",
        "⚠ Alert nearby authorities",
        "⚠ Monitor dry vegetation closely",
      ];

    case "MEDIUM":
      return [
        "⚠ Monitor weather conditions",
        "⚠ Restrict unnecessary fire activity",
        "⚠ Keep emergency resources ready",
      ];

    default:
      return [
        "✅ Fire risk is currently low",
        "✅ Continue routine monitoring",
        "✅ Maintain standard safety practices",
      ];
  }
};

const chartData = [
  {
    name: "Temp",
    value: Number(form.temperature) || 0,
  },
  {
    name: "Humidity",
    value: Number(form.humidity) || 0,
  },
  {
    name: "Wind",
    value: Number(form.wind) || 0,
  },
  {
    name: "Rain",
    value: Number(form.rain) || 0,
  },
];
 return (
  
  <div className="app">
    <div className="grid-bg"></div>

    <nav className="navbar">
  <h1>
    🔥 <span className="title-text">
      Forest Fire Intelligence Dashboard
    </span>
  </h1>

  <div className="live">
    ● LIVE SYSTEM
  </div>
</nav>
    <div className="hero">

      <div className="badge">
        AI Powered Wildfire Risk Assessment
      </div>

      <h1>
        Forest Fire{" "}
        <span className="gradient-text">
          Intelligence
        </span>
      </h1>

      <p>
        Real-time wildfire prediction system using
        Machine Learning and weather parameters.
      </p>

    </div>
    <div className="stats-grid">

  <div className="stat-card">
    <h3>{history.length}</h3>
    <p>Total Predictions</p>
  </div>

  <div className="stat-card high">
    <h3>
      {history.filter(h => h.risk_level === "HIGH").length}
    </h3>
    <p>High Risk</p>
  </div>

  <div className="stat-card medium">
    <h3>
      {history.filter(h => h.risk_level === "MEDIUM").length}
    </h3>
    <p>Medium Risk</p>
  </div>

  <div className="stat-card low">
    <h3>
      {history.filter(h => h.risk_level === "LOW").length}
    </h3>
    <p>Low Risk</p>
  </div>

</div>

    <div className="main-container">

      {/* LOCATION */}

      <div className="section-title">
        <span></span>
        <h2>Location</h2>
        <span></span>
      </div>

      <div className="location-card">

        <div className="location-row">

  <input
    type="text"
    name="city"
    placeholder="📍 Search City, State"
    value={form.city}
    onChange={(e) => {
      handleChange(e);
      searchCities(e.target.value);
    }}
  />

  {/* GPS Button */}
  <button
    className="icon-btn"
    onClick={getUserLocation}
  >
    📍
  </button>

  {/* MAP Button */}
  <button
    className="icon-btn"
    onClick={() => setShowMap(true)}
  >
    🗺️
  </button>

</div>

        {suggestions.length > 0 && (

          <div className="suggestions-box">

            {suggestions.map((item) => (

              <div
                key={`${item.name}-${item.region}`}
                className="suggestion-item"
                onClick={() => {

                  setForm((prev) => ({
                    ...prev,
                    city: `${item.name}, ${item.region}`,
                  }));

                  setSuggestions([]);
                }}
              >
                {item.name}, {item.region}
              </div>

            ))}

          </div>

        )}

      </div>

      {/* WEATHER */}

      <div className="section-title">
        <span></span>
        <h2>Weather Parameters</h2>
        <span></span>
      </div>

      <div className="weather-grid">

        <div className="weather-card temp-card">

          <h3>🌡 Temperature</h3>

          <input
            type="number"
            name="temperature"
            value={form.temperature}
            placeholder="Enter °C"
            onChange={handleChange}
            onKeyDown={(e) =>
              handleKeyDown(e, humidityRef)
            }
          />

        </div>

        <div className="weather-card humidity-card">

          <h3>💧 Humidity</h3>

          <input
            ref={humidityRef}
            type="number"
            name="humidity"
            value={form.humidity}
            placeholder="Enter %"
            onChange={handleChange}
            onKeyDown={(e) =>
              handleKeyDown(e, windRef)
            }
          />

        </div>

        <div className="weather-card wind-card">

          <h3>🌬 Wind Speed</h3>

          <input
            ref={windRef}
            type="number"
            name="wind"
            value={form.wind}
            placeholder="Enter km/h"
            onChange={handleChange}
            onKeyDown={(e) =>
              handleKeyDown(e, rainRef)
            }
          />

        </div>

        <div className="weather-card rain-card">

          <h3>🌧 Rainfall</h3>

          <input
            ref={rainRef}
            type="number"
            name="rain"
            value={form.rain}
            placeholder="Enter mm"
            onChange={handleChange}
          />

        </div>

      </div>

      {/* BUTTONS */}

      <div className="button-group">

        <button
          className="weather-btn"
          onClick={getCurrentWeather}
        >
          🌍 Get Weather
        </button>

        <button
          className="predict-btn"
          onClick={predictFire}
        >
          🔥 Predict Risk
        </button>

        <button
          className="reset-btn"
          onClick={resetData}
        >
          Reset
        </button>

        <button
          className="pdf-btn"
          onClick={downloadReport}
        >
          PDF Report
        </button>

      </div>

      {/* RESULT */}

      <div className="result-panel">

        <h2>Prediction Result</h2>

        {result ? (
          <>

            <div className="probability">
              {Number(
                result.probability
              ).toFixed(2)}%
            </div>

            <div
              className={`risk ${
                result.risk_level === "HIGH"
                  ? "high-risk"
                  : result.risk_level === "MEDIUM"
                  ? "medium-risk"
                  : "low-risk"
              }`}
            >
              {result.risk_level}
            </div>
{result &&
 Number(result.probability) >= 70 && (

  <div className="risk-alert">
    🚨 HIGH FIRE RISK ALERT
    <br />
    Immediate precautions recommended.
  </div>

)}
            <div className="summary">

              <p>
                🌡 Temperature:
                <strong>
                  {" "}
                  {form.temperature} °C
                </strong>
              </p>

              <p>
                💧 Humidity:
                <strong>
                  {" "}
                  {form.humidity} %
                </strong>
              </p>

              <p>
                🌬 Wind:
                <strong>
                  {" "}
                  {form.wind} km/h
                </strong>
              </p>

              <p>
                🌧 Rain:
                <strong>
                  {" "}
                  {form.rain} mm
                </strong>
              </p>

            </div>

            {/* CHART */}

            <div className="chart-container">

              <h3>Weather Analytics</h3>

              <ResponsiveContainer
                width="100%"
                height={250}
              >

                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* RECOMMENDATIONS */}

            <div className="recommendations">

              <h3>Safety Recommendations</h3>

              {getRecommendations(
                result.risk_level
              ).map((tip, index) => (
                <p key={index}>{tip}</p>
              ))}

            </div>

            {/* HISTORY */}

            <div className="recent-history">

              <h3>Recent Predictions</h3>

              {history
                .slice()
                .reverse()
                .slice(0, 3)
                .map((item, index) => (

                  <div
                    key={index}
                    className="history-card"
                  >

                    <div>
                      🌡 {item.temperature}°C |
                      💧 {item.humidity}%
                    </div>

                    <div>
                      {Number(
                        item.probability
                      ).toFixed(1)}
                      %
                    </div>

                    <span
                      className={
                        item.risk_level === "HIGH"
                          ? "high-risk"
                          : item.risk_level ===
                            "MEDIUM"
                          ? "medium-risk"
                          : "low-risk"
                      }
                    >
                      {item.risk_level}
                    </span>

                  </div>

                ))}

            </div>

          </>
        ) : (
          <div className="placeholder">
            Enter weather parameters and
            click Predict Risk
          </div>
        )}

      </div>
{showMap && (
  <div className="map-modal">

    <div className="map-box">

      <h2>Select Location</h2>

      <MapContainer
        center={selectedPosition}
        zoom={8}
        style={{
          height: "500px",
          width: "100%",
        }}
      >

       <TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; OpenStreetMap &copy; CARTO'
/>
        <LocationMarker />

      </MapContainer>

      <button
        style={{ marginTop: "15px" }}
        onClick={async () => {

          try {

            const response = await axios.get(
              `https://api.weatherapi.com/v1/current.json?key=a6783b3e0a794bc7b6f191506260806&q=${selectedPosition[0]},${selectedPosition[1]}`
            );

            const data = response.data;

            setForm({
              city: `${data.location.name}, ${data.location.region}`,
              temperature: data.current.temp_c,
              humidity: data.current.humidity,
              wind: data.current.wind_kph,
              rain: 0,
            });

            setShowMap(false);

          } catch (error) {
            console.error(error);
          }

        }}
      >
        Use This Location
      </button>

    </div>

  </div>
)}
    </div>
    <ChatBot />
  </div>
);
}

export default Dashboard;
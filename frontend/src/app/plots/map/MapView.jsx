"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to auto-fit bounds based on markers
function FitBounds({ plots }) {
  const map = useMap();

  useEffect(() => {
    if (plots && plots.length > 0) {
      const bounds = plots.map((plot) => [
        parseFloat(plot.latitude),
        parseFloat(plot.longitude),
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [plots, map]);

  return null;
}

// Component for each plot marker with weather data
function PlotMarker({ plot, getCropForPlot }) {
  const [weather, setWeather] = useState(null);
  const [region, setRegion] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingRegion, setLoadingRegion] = useState(true);

  useEffect(() => {
    fetchWeatherData();
    fetchRegionData();
  }, [plot]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${plot.latitude}&longitude=${plot.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();
      setWeather(data.current);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchRegionData = async () => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${plot.latitude}&longitude=${plot.longitude}&localityLanguage=en`
      );
      const data = await response.json();
      setRegion(data);
    } catch (error) {
      console.error("Error fetching region data:", error);
    } finally {
      setLoadingRegion(false);
    }
  };

  // Get weather description from weather code
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return weatherCodes[code] || "Unknown";
  };

  const position = [parseFloat(plot.latitude), parseFloat(plot.longitude)];

  return (
    <Marker position={position} icon={icon}>
      <Popup maxWidth={350} className="custom-popup">
        <div className="p-2">
          {/* Plot Header */}
          <div className="mb-3 border-b border-gray-200 pb-2">
            <h3 className="text-lg font-bold text-gray-800">{plot.name}</h3>
            {!loadingRegion && region && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {region.locality || region.city || region.principalSubdivision || "Unknown location"}
                {region.countryName && `, ${region.countryName}`}
              </p>
            )}
          </div>

          {/* Plot Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-start">
              <span className="text-gray-600 text-sm font-medium min-w-[100px]">Plot Size:</span>
              <span className="text-gray-800 text-sm font-semibold">{plot.area} acres</span>
            </div>

            {plot.soil_type && (
              <div className="flex items-start">
                <span className="text-gray-600 text-sm font-medium min-w-[100px]">Soil Type:</span>
                <span className="text-gray-800 text-sm">{plot.soil_type}</span>
              </div>
            )}

            <div className="flex items-start">
              <span className="text-gray-600 text-sm font-medium min-w-[100px]">Crop:</span>
              <span className="text-gray-800 text-sm font-semibold">
                {getCropForPlot(plot.id)}
              </span>
            </div>

            {plot.village && (
              <div className="flex items-start">
                <span className="text-gray-600 text-sm font-medium min-w-[100px]">Village:</span>
                <span className="text-gray-800 text-sm">{plot.village}</span>
              </div>
            )}
          </div>

          {/* Weather Data */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-1">🌤️</span> Current Weather
            </h4>

            {loadingWeather ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : weather ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-gray-600 text-xs">Temperature</p>
                  <p className="text-blue-700 font-bold">{weather.temperature_2m}°C</p>
                </div>

                <div className="bg-cyan-50 rounded-lg p-2">
                  <p className="text-gray-600 text-xs">Humidity</p>
                  <p className="text-cyan-700 font-bold">{weather.relative_humidity_2m}%</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-2">
                  <p className="text-gray-600 text-xs">Wind Speed</p>
                  <p className="text-purple-700 font-bold">{weather.wind_speed_10m} km/h</p>
                </div>

                <div className="bg-teal-50 rounded-lg p-2">
                  <p className="text-gray-600 text-xs">Precipitation</p>
                  <p className="text-teal-700 font-bold">{weather.precipitation} mm</p>
                </div>

                <div className="col-span-2 bg-amber-50 rounded-lg p-2">
                  <p className="text-gray-600 text-xs">Conditions</p>
                  <p className="text-amber-700 font-bold">
                    {getWeatherDescription(weather.weather_code)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Weather data unavailable</p>
            )}
          </div>

          {/* Coordinates */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Coordinates: {parseFloat(plot.latitude).toFixed(6)}, {parseFloat(plot.longitude).toFixed(6)}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapView({ plots, getCropForPlot }) {
  // Default center (India center coordinates)
  const defaultCenter = [20.5937, 78.9629];
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    // Calculate center based on plots
    if (plots && plots.length > 0) {
      const avgLat =
        plots.reduce((sum, plot) => sum + parseFloat(plot.latitude), 0) / plots.length;
      const avgLng =
        plots.reduce((sum, plot) => sum + parseFloat(plot.longitude), 0) / plots.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [plots]);

  return (
    <div className="w-full h-[600px] relative">
      <MapContainer
        center={mapCenter}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {plots.map((plot) => (
          <PlotMarker key={plot.id} plot={plot} getCropForPlot={getCropForPlot} />
        ))}

        <FitBounds plots={plots} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
        <h4 className="text-sm font-bold text-gray-800 mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#3b82f6">
              <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 14.329 7.369 15.535.346.418.996.418 1.262 0 .992-1.206 7.369-9.292 7.369-15.535 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
            </svg>
            <span>Plot location with details</span>
          </div>
          <p className="ml-6 text-gray-500">Click markers for plot info & live weather</p>
        </div>
      </div>
    </div>
  );
}


"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { PageWraper } from '../app/hoc';
import { isAuthenticated, getUser, plotsAPI, cropsAPI, cropPlanningAPI, tasksAPI, marketPricesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const StatCard = ({ title, value, icon, link, color }) => (
  <Link href={link} className={`${color} p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </Link>
);

const QuickAction = ({ title, description, link, icon }) => (
  <Link href={link} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-green-500 hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </Link>
);

// Weather Icon Mapping
const getWeatherIcon = (code, isDay = true) => {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 3) return isDay ? '⛅' : '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌧️';
  if (code <= 69) return '🌨️';
  if (code <= 79) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌤️';
};

const getWeatherCondition = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

// Real-time Weather Widget Component
const WeatherWidget = ({ weather, loading, error, onRefresh, location, t }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl text-white min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-2">🌀</div>
          <p className="text-blue-100">{t('weather.fetchingWeather')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl text-white min-h-[200px]">
        <div className="text-center py-4">
          <p className="text-4xl mb-2">🌤️</p>
          <p className="text-blue-100 mb-3">{t('weather.couldNotFetch')}</p>
          <button 
            onClick={onRefresh}
            className="bg-blue-400 hover:bg-blue-300 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {t('weather.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl text-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-blue-100 text-sm">📍 {location}</p>
            <button 
              onClick={onRefresh} 
              className="text-blue-200 hover:text-white text-xs transition-colors"
              title={t('common.refresh')}
            >
              🔄
            </button>
          </div>
          <p className="text-4xl font-bold mt-1">{Math.round(weather.current.temp)}°C</p>
          <p className="text-blue-100">{weather.current.condition}</p>
        </div>
        <div className="text-right">
          <span className="text-5xl">{weather.current.icon}</span>
          <p className="text-blue-200 text-xs mt-1">
            {t('weather.feelsLike')} {Math.round(weather.current.feels_like)}°C
          </p>
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-sm flex-wrap">
        <span title={t('weather.humidity')}>💧 {weather.current.humidity}%</span>
        <span title={t('weather.wind')}>🌬️ {Math.round(weather.current.wind)} km/h</span>
        <span title={t('weather.uvIndex')}>☀️ UV {weather.current.uv}</span>
        {weather.current.rain !== undefined && (
          <span title={t('weather.precipitation')}>🌧️ {weather.current.rain}mm</span>
        )}
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-blue-400 overflow-x-auto">
        {weather.forecast.map((f, i) => (
          <div key={i} className="text-center flex-1 min-w-[60px]">
            <p className="text-blue-200 text-xs">{f.day}</p>
            <p className="text-xl my-1">{f.icon}</p>
            <p className="text-xs">
              <span className="font-semibold">{f.max}°</span>
              <span className="text-blue-200"> / {f.min}°</span>
            </p>
          </div>
        ))}
      </div>
      <p className="text-blue-200 text-xs mt-3 text-right">
        {t('weather.updated')}: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

// Market Prices Widget with Real-time updates
const MarketPricesWidget = ({ prices, loading, lastUpdated, onRefresh, t }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-gray-800">📈 {t('market.title')}</h3>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full animate-pulse">{t('market.live')}</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onRefresh}
          className="text-gray-400 hover:text-green-600 transition-colors"
          title={t('common.refresh')}
        >
          🔄
        </button>
        <Link href="/marketplace" className="text-green-600 hover:text-green-700 text-sm font-medium">
          {t('common.viewAll')} →
        </Link>
      </div>
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin text-2xl mb-2">🔄</div>
        <p className="text-gray-500 text-sm">{t('market.fetchingPrices')}</p>
      </div>
    ) : prices.length > 0 ? (
      <>
        <div className="space-y-3">
          {prices.slice(0, 5).map((price, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{price.icon || '🌾'}</span>
                <div>
                  <span className="font-medium text-gray-700">{price.crop_name}</span>
                  {price.market_name && (
                    <p className="text-xs text-gray-400">{price.market_name}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 font-bold">₹{price.price_per_kg}</span>
                <span className="text-gray-500 text-sm">{t('market.pricePerKg')}</span>
                {price.change && (
                  <p className={`text-xs ${price.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {price.change > 0 ? '↑' : '↓'} {Math.abs(price.change)}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {lastUpdated && (
          <p className="text-gray-400 text-xs mt-3 text-right">
            {t('weather.updated')}: {lastUpdated}
          </p>
        )}
      </>
    ) : (
      <div className="text-center py-4 text-gray-500">
        <p>{t('market.noPriceData')}</p>
        <Link href="/marketplace" className="text-green-600 text-sm">{t('market.viewMarketplace')} →</Link>
      </div>
    )}
  </div>
);

// Tasks Widget
const TasksWidget = ({ tasks, t }) => {
  const pendingTasks = tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
  
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">📋 {t('tasks.upcomingTasks')}</h3>
        <Link href="/tasks" className="text-green-600 hover:text-green-700 text-sm font-medium">
          {t('common.viewAll')} →
        </Link>
      </div>
      {pendingTasks.length > 0 ? (
        <div className="space-y-3">
          {pendingTasks.slice(0, 3).map((task, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className={`w-2 h-2 rounded-full ${
                task.priority === 'URGENT' ? 'bg-red-500' :
                task.priority === 'HIGH' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}></span>
              <div className="flex-1">
                <p className="font-medium text-gray-700 text-sm">{task.title}</p>
                <p className="text-xs text-gray-500">{task.task_type?.replace('_', ' ')}</p>
              </div>
              {task.due_date && (
                <span className="text-xs text-gray-500">{task.due_date}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>{t('tasks.noTasks')}</p>
          <Link href="/tasks" className="text-green-600 text-sm">+ {t('tasks.createTask')}</Link>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUserData] = useState(null);
  const [stats, setStats] = useState({
    plots: 0,
    crops: 0,
    plans: 0,
    tasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesLastUpdated, setPricesLastUpdated] = useState(null);
  
  // Weather state
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const [location, setLocation] = useState('India');

  // Sample market prices with more details
  const samplePrices = [
    { crop_name: 'Rice (Basmati)', price_per_kg: 42, icon: '🍚', market_name: 'Delhi', change: 2.5 },
    { crop_name: 'Wheat', price_per_kg: 28, icon: '🌾', market_name: 'Punjab', change: -1.2 },
    { crop_name: 'Soybean', price_per_kg: 55, icon: '🫘', market_name: 'MP', change: 3.1 },
    { crop_name: 'Cotton', price_per_kg: 65, icon: '☁️', market_name: 'Gujarat', change: 0.8 },
    { crop_name: 'Sugarcane', price_per_kg: 35, icon: '🎋', market_name: 'UP', change: -0.5 },
  ];

  // Fetch real-time weather from Open-Meteo API (free, no API key required)
  const fetchWeather = async (lat = 20.5937, lon = 78.9629) => {
    setWeatherLoading(true);
    setWeatherError(false);
    
    try {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherData(latitude, longitude);
            // Reverse geocode to get city name
            try {
              const geoRes = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const geoData = await geoRes.json();
              setLocation(geoData.city || geoData.locality || geoData.principalSubdivision || 'Your Location');
            } catch {
              setLocation('Your Location');
            }
          },
          async () => {
            // Fallback to default location (India - Delhi)
            await fetchWeatherData(28.6139, 77.2090);
            setLocation('Delhi, India');
          },
          { timeout: 5000 }
        );
      } else {
        await fetchWeatherData(lat, lon);
        setLocation('Delhi, India');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeatherError(true);
      setWeatherLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
      );
      const data = await response.json();
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      
      const weatherData = {
        current: {
          temp: data.current.temperature_2m,
          feels_like: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          wind: data.current.wind_speed_10m,
          uv: Math.round(data.current.uv_index),
          rain: data.current.precipitation,
          condition: getWeatherCondition(data.current.weather_code),
          icon: getWeatherIcon(data.current.weather_code),
        },
        forecast: data.daily.time.slice(1, 5).map((date, i) => ({
          day: dayNames[(today + i + 1) % 7],
          max: Math.round(data.daily.temperature_2m_max[i + 1]),
          min: Math.round(data.daily.temperature_2m_min[i + 1]),
          icon: getWeatherIcon(data.daily.weather_code[i + 1]),
        })),
      };
      
      setWeather(weatherData);
      setWeatherError(false);
    } catch (err) {
      console.error('Weather API error:', err);
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch market prices
  const fetchMarketPrices = async () => {
    setPricesLoading(true);
    try {
      const pricesRes = await marketPricesAPI.getAll().catch(() => ({ rows: [] }));
      const prices = pricesRes.rows || [];
      
      // Add icons and simulate changes for demo
      const pricesWithDetails = prices.length > 0 
        ? prices.map(p => ({
            ...p,
            icon: getCropIcon(p.crop_name),
            change: (Math.random() * 6 - 3).toFixed(1), // Simulated change
          }))
        : samplePrices;
      
      setMarketPrices(pricesWithDetails);
      setPricesLastUpdated(new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setMarketPrices(samplePrices);
    } finally {
      setPricesLoading(false);
    }
  };

  // Get crop icon based on name
  const getCropIcon = (cropName) => {
    const name = cropName?.toLowerCase() || '';
    if (name.includes('rice')) return '🍚';
    if (name.includes('wheat')) return '🌾';
    if (name.includes('cotton')) return '☁️';
    if (name.includes('soybean') || name.includes('soy')) return '🫘';
    if (name.includes('sugarcane') || name.includes('sugar')) return '🎋';
    if (name.includes('corn') || name.includes('maize')) return '🌽';
    if (name.includes('potato')) return '🥔';
    if (name.includes('tomato')) return '🍅';
    if (name.includes('onion')) return '🧅';
    return '🌱';
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    const userData = getUser();
    setUserData(userData);
    fetchStats();
    fetchWeather();
    fetchMarketPrices();

    // Auto-refresh prices every 5 minutes
    const priceInterval = setInterval(fetchMarketPrices, 5 * 60 * 1000);
    // Auto-refresh weather every 15 minutes
    const weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const [plotsRes, cropsRes, plansRes, tasksRes] = await Promise.all([
        plotsAPI.getAll().catch(() => ({ rows: [] })),
        cropsAPI.getAll().catch(() => ({ rows: [] })),
        cropPlanningAPI.getAll().catch(() => ({ rows: [] })),
        tasksAPI.getAll().catch(() => ({ rows: [] })),
      ]);
      setStats({
        plots: plotsRes.rows?.length || 0,
        crops: cropsRes.rows?.length || 0,
        plans: plansRes.rows?.length || 0,
        tasks: (tasksRes.rows || []).filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length,
      });
      setTasks(tasksRes.rows || []);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get current date
  const today = new Date();
  const dateString = today.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 md:p-8 rounded-2xl">
        <p className="text-green-200 text-sm">{dateString}</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">
          {t('dashboard.welcomeBack')}, {user?.full_name || 'Farmer'}! 👋
        </h1>
        <p className="mt-2 text-green-100">
          {t('dashboard.manageEfficiently')}
        </p>
      </section>

      {/* Weather + Market Prices Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeatherWidget 
          weather={weather}
          loading={weatherLoading}
          error={weatherError}
          onRefresh={fetchWeather}
          location={location}
          t={t}
        />
        <MarketPricesWidget 
          prices={marketPrices}
          loading={pricesLoading}
          lastUpdated={pricesLastUpdated}
          onRefresh={fetchMarketPrices}
          t={t}
        />
      </div>

      {/* Stats Grid */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.overview')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title={t('dashboard.totalPlots')} 
            value={loading ? '...' : stats.plots} 
            icon="🌾" 
            link="/plots"
            color="bg-green-50"
          />
          <StatCard 
            title={t('dashboard.crops')} 
            value={loading ? '...' : stats.crops} 
            icon="🌱" 
            link="/crops"
            color="bg-yellow-50"
          />
          <StatCard 
            title={t('dashboard.cropPlans')} 
            value={loading ? '...' : stats.plans} 
            icon="📋" 
            link="/crop-planning"
            color="bg-blue-50"
          />
          <StatCard 
            title={t('dashboard.pendingTasks')} 
            value={loading ? '...' : stats.tasks} 
            icon="✅" 
            link="/tasks"
            color="bg-orange-50"
          />
        </div>
      </section>

      {/* Tasks Widget */}
      <TasksWidget tasks={tasks} t={t} />

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction 
            title={t('dashboard.addNewPlot')}
            description={t('dashboard.registerPlot')}
            link="/plots"
            icon="➕"
          />
          <QuickAction 
            title={t('dashboard.createTask')}
            description={t('dashboard.planActivities')}
            link="/tasks"
            icon="📝"
          />
          <QuickAction 
            title={t('dashboard.marketplace')}
            description={t('dashboard.buySell')}
            link="/marketplace"
            icon="🛒"
          />
          <QuickAction 
            title={t('dashboard.resources')}
            description={t('dashboard.learnGrow')}
            link="/resources"
            icon="📚"
          />
        </div>
      </section>

      {/* Secondary Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction 
          title={t('dashboard.waterResources')}
          description={t('dashboard.manageIrrigation')}
          link="/water-resources"
          icon="💧"
        />
        <QuickAction 
          title={t('dashboard.machinery')}
          description={t('dashboard.farmEquipment')}
          link="/mach-man/machinery"
          icon="🚜"
        />
        <QuickAction 
          title={t('dashboard.cropStocks')}
          description={t('dashboard.trackInventory')}
          link="/crop-stocks"
          icon="📦"
        />
        <QuickAction 
          title={t('dashboard.cropPlanning')}
          description={t('dashboard.planSeasons')}
          link="/crop-planning"
          icon="🗓️"
        />
      </div>

      {/* Tips Section */}
      <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-3">💡 {t('dashboard.farmTips')}</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• {t('dashboard.tip1')}</li>
          <li>• {t('dashboard.tip2')}</li>
          <li>• {t('dashboard.tip3')}</li>
          <li>• {t('dashboard.tip4')}</li>
        </ul>
      </section>
    </div>
  );
}

export default PageWraper(HomePage);
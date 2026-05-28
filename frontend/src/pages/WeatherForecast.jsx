import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const WeatherForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await apiClient.get('/weather');
        setForecast(response.data.forecast);
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Fallback data in case the server is not reachable
        setForecast([
          { day: 'Today', high: '24°', low: '18°', rain: '10%', icon: 'partly_cloudy_day' },
          { day: 'Tomorrow', high: '21°', low: '16°', rain: '85%', icon: 'rainy' },
          { day: 'Wed', high: '22°', low: '15°', rain: '30%', icon: 'cloud' },
          { day: 'Thu', high: '26°', low: '17°', rain: '0%', icon: 'sunny' },
          { day: 'Fri', high: '28°', low: '18°', rain: '0%', icon: 'sunny' },
          { day: 'Sat', high: '27°', low: '19°', rain: '15%', icon: 'partly_cloudy_day' },
          { day: 'Sun', high: '23°', low: '16°', rain: '60%', icon: 'rainy' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-8">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-heading mb-1">Predictive Analysis</h1>
          <p className="text-[13px] text-body">Sector 4 Alpha • Updated 2 mins ago</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-heading hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          Past 30 Days
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current Conditions */}
          <div className="card p-8 flex justify-between items-start relative overflow-hidden group">
            <div className="relative z-10">
              <span className="label-caps block mb-6">CURRENT CONDITIONS</span>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-6xl font-bold text-heading">24°</span>
                <span className="text-2xl font-bold text-heading">C</span>
              </div>
              <div className="flex gap-10">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">HUMIDITY</p>
                  <p className="text-lg font-bold text-heading">78%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">WIND (SW)</p>
                  <p className="text-lg font-bold text-heading">12 km/h</p>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-6 z-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[120px]">partly_cloudy_day</span>
            </div>
          </div>

          {/* Risk Analysis Engine */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="label-caps">RISK ANALYSIS ENGINE</span>
              <span className="material-symbols-outlined text-gray-400">microscope</span>
            </div>
            
            <div className="flex items-center gap-8 mb-8">
              <div className="relative w-24 h-24 flex flex-col items-center justify-center shrink-0">
                {/* Simplified Gauge */}
                <div className="absolute inset-0 rounded-full border-[6px] border-red-50 opacity-20"></div>
                <div className="absolute inset-0 rounded-full border-[6px] border-red-600 border-t-transparent border-r-transparent transform -rotate-45"></div>
                <span className="text-2xl font-bold text-heading">85</span>
                <span className="text-[10px] font-bold text-muted">%</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-600 mb-1">High Risk</h3>
                <p className="text-[13px] text-body leading-relaxed">Elevated humidity & heat.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100">
                <span className="text-xs font-semibold text-red-700">Downy Mildew Prob.</span>
                <span className="text-xs font-bold text-red-700">85%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-semibold text-heading">Botrytis Blight</span>
                <span className="text-xs font-bold text-heading">32%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Smart Irrigation Advisor */}
          <div className="bg-[#102A1E] rounded-xl p-8 flex gap-8 items-center text-white relative overflow-hidden">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-green-400">water_drop</span>
            </div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">Smart Irrigation Advisor</h3>
                <span className="bg-green-400/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-green-400/20">Action Req</span>
              </div>
              <p className="text-[13px] text-gray-300 leading-relaxed mb-6">
                <span className="font-bold text-white">Recommendation: Skip Cycle 4.</span> Heavy precipitation (22mm) expected in the next 36 hours. Soil moisture levels are currently optimal (42%). Continuing irrigation will lead to waterlogging and increased fungal risk.
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-green-200 text-[#102A1E] rounded-lg text-xs font-bold hover:bg-green-300 transition-colors">
                  Suspend Schedule
                </button>
                <button className="px-6 py-2 border border-white/20 text-white rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                  Override
                </button>
              </div>
            </div>
          </div>

          {/* 7-Day Projection */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="label-caps">7-DAY PROJECTION</span>
              <button className="text-[11px] font-bold text-muted hover:text-heading transition-colors uppercase tracking-wider">View Detailed Model</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {forecast.map((f, i) => (
                <div key={i} className="flex-1 min-w-[80px] bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col items-center">
                  <p className="text-[11px] font-bold text-muted mb-4">{f.day}</p>
                  <span className="material-symbols-outlined text-gray-400 text-2xl mb-4">{f.icon}</span>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-[15px] font-bold text-heading">{f.high}</span>
                    <span className="text-[11px] font-medium text-muted">{f.low}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500">
                    <span className="material-symbols-outlined text-[12px]">water_drop</span>
                    {f.rain}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zone Telemetry Map Section */}
      <div className="card h-[400px] flex overflow-hidden">
        <div className="flex-1 relative bg-gray-200">
          <img 
            src="/aerial_farm.png" 
            alt="Farm Map" 
            className="w-full h-full object-cover opacity-50 grayscale"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-heading font-bold shadow-sm hover:bg-gray-50 transition-colors">+</button>
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-heading font-bold shadow-sm hover:bg-gray-50 transition-colors">−</button>
          </div>
        </div>
        <div className="w-[320px] p-6 border-l border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-heading mb-8">Zone Telemetry</h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                  <span className="text-[13px] font-bold text-heading">Sector 4A (North)</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 border border-red-600 px-1.5 py-0.5 rounded uppercase">Critical</span>
              </div>
              <p className="text-[12px] text-body leading-relaxed">
                Sustained humidity {'>'}80% for 12hrs. High probability of fungal spread. Intervention recommended.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-800"></div>
                  <span className="text-[13px] font-bold text-heading">Sector 2B (East)</span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 border border-amber-800 px-1.5 py-0.5 rounded uppercase">Watch</span>
              </div>
              <p className="text-[12px] text-body leading-relaxed">
                Soil moisture rapidly declining. Monitoring requested prior to scheduled irrigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;

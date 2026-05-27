import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sensorService } from '../services/api';

const Overview = () => {
  const [pumpOn, setPumpOn] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [statusColor, setStatusColor] = useState('bg-amber-500');
  
  const [sensors, setSensors] = useState({
    temperature: 24.0,
    humidity: 65.0,
    soil_moisture: 42.0,
  });
  const [sensorStatus, setSensorStatus] = useState('loading'); // 'loading', 'live', 'fallback'

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/health');
        if (response.data.status === 'ok') {
          setBackendStatus('System status is optimal. Backend connected.');
          setStatusColor('bg-green-500');
        }
      } catch (error) {
        setBackendStatus('System running in standalone mode. Backend unreachable.');
        setStatusColor('bg-red-500');
      }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    let intervalId;
    const fetchSensors = async () => {
      try {
        const data = await sensorService.getSensors();
        setSensors(data);
        setSensorStatus('live');
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setSensorStatus('fallback');
      }
    };

    fetchSensors();
    intervalId = setInterval(fetchSensors, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [dynamicInsights, setDynamicInsights] = useState([]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const newInsights = [];
    
    if (sensors.humidity > 70 && sensors.temperature > 25) {
      newInsights.push({ type: 'DISEASE RISK', icon: 'shield', color: 'text-red-600', text: 'High fungal risk detected due to elevated humidity and temp.', badge: 'Action Required', badgeColor: 'bg-red-accent' });
    } else {
      newInsights.push({ type: 'DISEASE RISK', icon: 'shield', color: 'text-green-600', text: 'Low fungal risk detected based on current atmospheric conditions.', badge: 'Safe', badgeColor: 'bg-green-dark' });
    }
    
    if (sensors.soil_moisture < 30) {
      newInsights.push({ type: 'IRRIGATION', icon: 'water_drop', color: 'text-amber-500', text: 'Irrigation optimization recommended to prevent drought stress.', badge: 'Action Required', badgeColor: 'bg-amber-500' });
    } else if (sensors.soil_moisture > 60) {
      newInsights.push({ type: 'IRRIGATION', icon: 'water_drop', color: 'text-blue-500', text: 'Weather conditions suitable for reduced watering.', badge: 'Optimization', badgeColor: 'bg-blue-500' });
    }
    
    newInsights.push({ type: 'SOIL HEALTH TREND', icon: 'autorenew', color: 'text-green-600', text: 'Soil nutrient depletion trend observed based on current crop uptake.', badge: 'Monitor', badgeColor: 'bg-gray-500' });
    
    setDynamicInsights(newInsights);
  }, [sensors]);

  useEffect(() => {
    if (dynamicInsights.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentInsightIndex(prev => (prev + 1) % dynamicInsights.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [dynamicInsights.length]);


  const getIrrigationRecommendation = () => {
    if (sensors.soil_moisture < 25) {
      return { status: 'Critical', action: 'ON', message: 'Immediate irrigation required.', color: 'bg-red-100 text-red-700 border-red-200', icon: 'warning', activeColor: 'text-red-600', activeBg: 'border-red-500 bg-red-50 shadow-[0_0_20px_rgba(220,38,38,0.2)]' };
    } else if (sensors.soil_moisture < 40) {
      return { status: 'Low', action: 'Recommended', message: 'Schedule irrigation soon.', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'info', activeColor: 'text-amber-600', activeBg: 'border-amber-400 bg-amber-50 shadow-[0_0_20px_rgba(217,119,6,0.2)]' };
    } else {
      return { status: 'Healthy', action: 'OFF', message: 'Moisture levels are optimal.', color: 'bg-green-100 text-green-700 border-green-200', icon: 'check_circle', activeColor: 'text-green-600', activeBg: 'border-green-500 bg-green-50 shadow-[0_0_20px_rgba(22,163,74,0.2)]' };
    }
  };

  const recommendation = getIrrigationRecommendation();
  const displayPumpOn = pumpOn || recommendation.action === 'ON';


  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Field Sector Alpha</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></div>
          <p className="text-sm text-body">{backendStatus}</p>
        </div>
      </div>


      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temperature */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps flex items-center gap-1.5">
              TEMPERATURE
              {sensorStatus === 'loading' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" title="Connecting..."></span>}
              {sensorStatus === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Live sensor data"></span>}
              {sensorStatus === 'fallback' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Offline (fallback data)"></span>}
            </span>
            <span className="material-symbols-outlined text-green-700 text-xl">thermostat</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-heading">
              {sensorStatus === 'loading' ? '...' : `${sensors.temperature}°C`}
            </span>
            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              1.2°
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps flex items-center gap-1.5">
              HUMIDITY
              {sensorStatus === 'loading' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" title="Connecting..."></span>}
              {sensorStatus === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Live sensor data"></span>}
              {sensorStatus === 'fallback' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Offline (fallback data)"></span>}
            </span>
            <span className="material-symbols-outlined text-blue-600 text-xl">water_drop</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-heading">
              {sensorStatus === 'loading' ? '...' : `${sensors.humidity}%`}
            </span>
            <span className="text-sm text-body">Optimal range</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${sensors.humidity}%` }}></div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps flex items-center gap-1.5">
              SOIL MOISTURE
              {sensorStatus === 'loading' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" title="Connecting..."></span>}
              {sensorStatus === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Live sensor data"></span>}
              {sensorStatus === 'fallback' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Offline (fallback data)"></span>}
            </span>
            <span className="material-symbols-outlined text-amber-700 text-xl">waves</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-heading">
              {sensorStatus === 'loading' ? '...' : `${sensors.soil_moisture}%`}
            </span>
            <span className="text-sm text-red-accent font-medium flex items-center gap-0.5">
              <span className="text-[10px]">▲</span>Low
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-red-bar h-2 rounded-full transition-all duration-500" style={{ width: `${sensors.soil_moisture}%` }}></div>
          </div>
        </div>
      </div>


      {/* AI Insights + Live Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="lg:col-span-2 card-green p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-700 text-xl">language</span>
              <h2 className="text-lg font-bold text-heading">AI Insights & Predictive Analysis</h2>
            </div>
            <div className="flex gap-1.5">
              {dynamicInsights.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === currentInsightIndex ? 'bg-green-600' : 'bg-green-200'}`} />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100 flex-1 flex flex-col justify-center min-h-[140px]">
            {dynamicInsights.length > 0 && (
              <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`material-symbols-outlined text-[18px] ${dynamicInsights[currentInsightIndex].color}`}>
                    {dynamicInsights[currentInsightIndex].icon}
                  </span>
                  <span className="label-caps">{dynamicInsights[currentInsightIndex].type}</span>
                </div>
                <p className="text-sm text-body leading-relaxed mb-4 min-h-[40px]">
                  {dynamicInsights[currentInsightIndex].text}
                </p>
                <span className={`inline-block text-white text-[11px] font-mono font-semibold px-3 py-1 rounded ${dynamicInsights[currentInsightIndex].badgeColor}`}>
                  {dynamicInsights[currentInsightIndex].badge}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Status */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-600 text-xl">settings</span>
              <h2 className="text-lg font-bold text-heading">Live Status</h2>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${recommendation.color}`}>
               {recommendation.status}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
            <div className="flex items-start gap-2">
              <span className={`material-symbols-outlined text-[16px] mt-0.5 ${recommendation.activeColor}`}>
                {recommendation.icon}
              </span>
              <div>
                <p className="text-[11px] font-bold text-heading uppercase">AI Recommendation</p>
                <p className="text-[12px] text-body">{recommendation.message}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center py-2 flex-1 justify-center">
            {/* Power Button */}
            <button
              onClick={() => setPumpOn(!pumpOn)}
              className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 mb-3 ${
                displayPumpOn
                  ? recommendation.activeBg
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <span className={`material-symbols-outlined text-3xl transition-colors ${displayPumpOn ? recommendation.activeColor : 'text-gray-400'}`}>
                power_settings_new
              </span>
            </button>
            <p className="text-sm font-bold text-heading mb-1">
              Pump {displayPumpOn ? 'ON' : 'OFF'}
            </p>
            <p className="label-caps text-[10px] mb-4">AUTO MODE ACTIVE</p>
            
            <button
              onClick={() => setPumpOn(!pumpOn)}
              className="w-full border border-gray-300 text-heading font-mono text-[11px] font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wider mt-auto"
            >
              MANUAL OVERRIDE
            </button>
          </div>
        </div>
      </div>

      {/* Local Weather + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Local Weather */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-heading">Local Weather</h2>
              <span className="material-symbols-outlined text-gray-400 cursor-pointer">more_vert</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-amber-500 text-[40px]">partly_cloudy_day</span>
              <div>
                <span className="text-4xl font-bold text-heading">22°C</span>
                <p className="text-sm text-body">Partly Cloudy</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="material-symbols-outlined text-[16px]">water_drop</span>
                  <span className="text-xs font-semibold">Humidity</span>
                </div>
                <span className="text-sm font-bold text-heading">68%</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="material-symbols-outlined text-[16px]">air</span>
                  <span className="text-xs font-semibold">Wind</span>
                </div>
                <span className="text-sm font-bold text-heading">14 km/h</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-1 col-span-2">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="material-symbols-outlined text-[16px]">rainy</span>
                  <span className="text-xs font-semibold">Rain Probability</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-heading">60%</span>
                  <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <span className="material-symbols-outlined text-blue-600">psychology</span>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">AI Forecast Insight</p>
              <p className="text-sm text-blue-900 leading-relaxed">
                Expected rainfall may reduce irrigation needs tomorrow. Consider postponing scheduled watering.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-heading">Recent Activity</h2>
            <button className="label-caps text-[10px] hover:text-heading transition-colors">VIEW ALL</button>
          </div>
          <div className="space-y-4">
            {/* Activity 1 */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">sensors</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">Sensor Calibration Complete</p>
                <p className="text-xs text-body mt-0.5">Moisture nodes 12-18 successfully recalibrated against baseline.</p>
                <p className="text-[11px] font-mono text-muted mt-1">Today, 08:45 AM</p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-red-500 text-[18px]">water_drop</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">Irrigation Cycle Ended</p>
                <p className="text-xs text-body mt-0.5">Sector Beta received 15mm equivalent watering over 2 hours.</p>
                <p className="text-[11px] font-mono text-muted mt-1">Yesterday, 11:30 PM</p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">Temporary Connectivity Loss</p>
                <p className="text-xs text-body mt-0.5">Gateway 03 went offline for 4 minutes. Connection restored automatically.</p>
                <p className="text-[11px] font-mono text-muted mt-1">Yesterday, 04:12 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = () => {
  const [pumpOn, setPumpOn] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [statusColor, setStatusColor] = useState('bg-amber-500');

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
            <span className="label-caps">TEMPERATURE</span>
            <span className="material-symbols-outlined text-green-700 text-xl">thermostat</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-heading">24°C</span>
            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              1.2°
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps">HUMIDITY</span>
            <span className="material-symbols-outlined text-blue-600 text-xl">water_drop</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-heading">65%</span>
            <span className="text-sm text-body">Optimal range</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps">SOIL MOISTURE</span>
            <span className="material-symbols-outlined text-amber-700 text-xl">waves</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-heading">42%</span>
            <span className="text-sm text-red-accent font-medium flex items-center gap-0.5">
              <span className="text-[10px]">▲</span>Low
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-red-bar h-2 rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>
      </div>

      {/* AI Insights + Live Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="lg:col-span-2 card-green p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-green-700 text-xl">language</span>
            <h2 className="text-lg font-bold text-heading">AI Insights & Predictive Analysis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Disease Risk */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-green-600 text-[16px]">shield</span>
                <span className="label-caps">DISEASE RISK</span>
              </div>
              <p className="text-sm text-body leading-relaxed mb-4">
                Low probability of late blight detected in sector Alpha.
              </p>
              <span className="inline-block bg-green-dark text-white text-[11px] font-mono font-semibold px-3 py-1 rounded">
                8% Risk Score
              </span>
            </div>

            {/* Soil Health Trend */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-green-600 text-[16px]">autorenew</span>
                <span className="label-caps">SOIL HEALTH TREND</span>
              </div>
              <p className="text-sm text-body leading-relaxed mb-4">
                Nitrogen depletion expected within 14 days based on current crop uptake.
              </p>
              <span className="inline-block bg-red-accent text-white text-[11px] font-mono font-semibold px-3 py-1 rounded">
                Action Required Soon
              </span>
            </div>
          </div>
        </div>

        {/* Live Status */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-gray-600 text-xl">settings</span>
            <h2 className="text-lg font-bold text-heading">Live Status</h2>
          </div>
          <div className="flex flex-col items-center py-4">
            {/* Power Button */}
            <button
              onClick={() => setPumpOn(!pumpOn)}
              className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 mb-4 ${
                pumpOn
                  ? 'border-green-500 bg-green-50 shadow-[0_0_20px_rgba(22,163,74,0.2)]'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <span className={`material-symbols-outlined text-3xl ${pumpOn ? 'text-green-600' : 'text-gray-400'}`}>
                power_settings_new
              </span>
            </button>
            <p className="text-base font-bold text-heading mb-1">
              Pump {pumpOn ? 'ON' : 'OFF'}
            </p>
            <p className="label-caps text-[10px] mb-5">AUTO MODE ACTIVE</p>
            <button
              onClick={() => setPumpOn(!pumpOn)}
              className="w-full border-2 border-gray-300 text-heading font-mono text-xs font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wider"
            >
              MANUAL OVERRIDE
            </button>
          </div>
        </div>
      </div>

      {/* Local Weather + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Local Weather */}
        <div className="card p-6">
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
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1 border-b border-gray-50">
              <span className="text-sm text-body">Precipitation (24h)</span>
              <span className="text-sm font-semibold text-heading">0.0 mm</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-50">
              <span className="text-sm text-body">Wind Speed</span>
              <span className="text-sm font-semibold text-heading">12 km/h NE</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-body">Evapotranspiration</span>
              <span className="text-sm font-semibold text-heading">4.2 mm/day</span>
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

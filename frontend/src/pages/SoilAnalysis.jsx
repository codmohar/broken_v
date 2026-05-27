import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/api';

const SoilAnalysis = () => {
  const [sensors, setSensors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchSensors = async () => {
      try {
        const data = await sensorService.getSensors();
        setSensors(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
    intervalId = setInterval(fetchSensors, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="material-symbols-outlined animate-spin text-4xl text-green-500">autorenew</span>
      </div>
    );
  }

  if (!sensors) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500">
        <span className="material-symbols-outlined text-4xl mb-2">error</span>
        <p>Failed to load soil telemetry data.</p>
      </div>
    );
  }

  // --- Rule-Based Logic ---
  const t = sensors.temperature;
  const h = sensors.humidity;
  const m = sensors.soil_moisture;

  // Fungal Risk
  let fungalRisk = { level: 'Low', color: 'bg-green-100 text-green-700 border-green-200', icon: 'check_circle' };
  if (h > 70 && t > 25) {
    fungalRisk = { level: 'High', color: 'bg-red-100 text-red-700 border-red-200', icon: 'warning' };
  } else if (h > 60 || t > 28) {
    fungalRisk = { level: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'info' };
  }

  // Nutrient Status
  let nutrientStatus = { status: 'Optimal', color: 'bg-green-100 text-green-700 border-green-200', icon: 'eco' };
  if (m < 30 || m > 60) {
    nutrientStatus = { status: 'Sub-optimal', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'warning' };
  }

  // Soil Stress Index
  let stressIndex = 0;
  if (t > 30) stressIndex += 30;
  if (t < 10) stressIndex += 30;
  if (m < 25) stressIndex += 40;
  if (h > 75) stressIndex += 20;
  stressIndex = Math.min(100, stressIndex);

  // Soil Quality
  const soilQuality = 100 - stressIndex;

  // AI Recommendation
  let recommendation = "Soil parameters are currently stable. Maintain standard irrigation schedules.";
  let recIcon = "check_circle";
  let recColor = "text-green-600";
  if (stressIndex > 50) {
    recommendation = "Critical soil stress detected. Immediate intervention required to balance moisture and mitigate temperature effects.";
    recIcon = "warning";
    recColor = "text-red-400"; // Lightened for dark background
  } else if (fungalRisk.level === 'High') {
    recommendation = "High fungal risk due to elevated humidity and temperature. Reduce watering and improve air circulation.";
    recIcon = "pest_control";
    recColor = "text-red-400";
  } else if (nutrientStatus.status === 'Sub-optimal') {
    recommendation = "Moisture levels are affecting nutrient availability. Adjust irrigation to keep moisture between 30% and 60%.";
    recIcon = "water_drop";
    recColor = "text-amber-400";
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-heading mb-1">Soil Intelligence</h1>
          <p className="text-sm text-body">Live analysis powered by real-time telemetry.</p>
        </div>
        <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">sensors</span>
          LIVE SYNC
        </div>
      </div>

      {/* Top Cards: Quality & Stress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <span className="label-caps">OVERALL SOIL QUALITY</span>
            <span className="material-symbols-outlined text-green-500 text-2xl">workspace_premium</span>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-heading leading-none">{soilQuality}</span>
              <span className="text-lg text-muted font-bold mb-1">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all duration-500 ${soilQuality > 70 ? 'bg-green-500' : soilQuality > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${soilQuality}%` }}></div>
            </div>
          </div>
        </div>

        <div className="card p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <span className="label-caps">SOIL STRESS INDEX</span>
            <span className={`material-symbols-outlined text-2xl ${stressIndex > 50 ? 'text-red-500' : stressIndex > 20 ? 'text-amber-500' : 'text-green-500'}`}>ssid_chart</span>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-heading leading-none">{stressIndex}</span>
              <span className="text-lg text-muted font-bold mb-1">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all duration-500 ${stressIndex > 50 ? 'bg-red-500' : stressIndex > 20 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${stressIndex}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Water Retention */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-500">water_drop</span>
            <h3 className="font-bold text-heading">Water Retention</h3>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-black text-heading leading-none">{m}%</span>
          </div>
          <p className="text-xs text-body">Derived from live moisture telemetry.</p>
        </div>

        {/* Nutrient Status */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`material-symbols-outlined ${nutrientStatus.status === 'Optimal' ? 'text-green-500' : 'text-amber-500'}`}>{nutrientStatus.icon}</span>
            <h3 className="font-bold text-heading">Nutrient Status</h3>
          </div>
          <div className="mb-3">
             <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${nutrientStatus.color}`}>
              {nutrientStatus.status}
            </span>
          </div>
          <p className="text-xs text-body mt-4">Based on soil moisture capacity.</p>
        </div>

        {/* Fungal Risk */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`material-symbols-outlined ${fungalRisk.level === 'High' ? 'text-red-500' : fungalRisk.level === 'Medium' ? 'text-amber-500' : 'text-green-500'}`}>
              bug_report
            </span>
            <h3 className="font-bold text-heading">Fungal Risk</h3>
          </div>
           <div className="mb-3">
             <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${fungalRisk.color}`}>
              {fungalRisk.level}
            </span>
          </div>
          <p className="text-xs text-body mt-4">Analyzed from temp and humidity trends.</p>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="card p-6 bg-gradient-to-br from-sidebar to-sidebar-hover text-white">
        <div className="flex items-center gap-2 mb-4 opacity-90">
          <span className="material-symbols-outlined text-xl">psychology</span>
          <h2 className="text-sm font-bold uppercase tracking-wider">AI Insight & Recommendation</h2>
        </div>
        <div className="bg-white/10 rounded-xl p-5 border border-white/20 backdrop-blur-sm flex items-start gap-4">
          <span className={`material-symbols-outlined text-3xl mt-0.5 ${recColor} drop-shadow-sm`}>{recIcon}</span>
          <div>
            <p className="text-sm leading-relaxed font-medium">
              {recommendation}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SoilAnalysis;

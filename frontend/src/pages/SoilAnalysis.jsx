import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SoilAnalysis = () => {
  const [metrics, setMetrics] = useState({
    dryness: { value: 28, status: 'Sub-optimal', color: 'bg-amber-600' },
    quality: { value: 84, status: 'Good', color: 'bg-green-600' },
    ph: { value: 6.5, status: 'Neutral', color: 'bg-green-300' }
  });
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, insightsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/soil/metrics'),
          axios.get('http://localhost:3000/api/soil/insights')
        ]);
        setMetrics(metricsRes.data);
        setInsights(insightsRes.data);
      } catch (error) {
        console.error("Error fetching soil data:", error);
        // Fallback data
        setInsights([
          { id: 1, type: 'warning', title: 'Nitrogen Deficit Detected', desc: 'Zone 3 shows a 15% drop in N levels over 48h. Recommend applying targeted urea-based fertilizer.', color: 'bg-red-50/50 border-red-100', iconColor: 'text-amber-700' },
          { id: 2, type: 'opacity', title: 'Moisture Optimization', desc: 'Current dryness at 28%. Scheduled pump activation at 18:00 will return levels to optimal 35%.', color: 'bg-gray-50 border-gray-100', iconColor: 'text-blue-700' }
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Soil Visual Analysis */}
        <div className="lg:col-span-2 card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-heading">AI Soil Visual Analysis</h2>
            <div className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full border border-green-200">
              MODEL ACTIVE
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center bg-gray-50/50 mb-8">
            <span className="material-symbols-outlined text-gray-400 text-[48px] mb-4">cloud_upload</span>
            <p className="text-sm font-medium text-body mb-1">Drag and drop soil sample images here</p>
            <p className="text-xs text-muted">or click to browse from device</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
              <img src="/plant_scans.png" alt="Sample" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-heading">Sample_Alpha_094.jpg</p>
              <p className="text-[11px] text-green-600 font-semibold uppercase tracking-wider">Status: Optimal Texture</p>
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-green-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              settings_suggest
            </span>
            <h2 className="text-lg font-bold text-heading">Actionable Insights</h2>
          </div>

          <div className="space-y-4">
            {insights.map(insight => (
              <div key={insight.id} className={`${insight.color} border rounded-xl p-5`}>
                <div className={`flex items-center gap-2 ${insight.iconColor} mb-3`}>
                  <span className="material-symbols-outlined text-[18px]">{insight.type}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">{insight.title}</span>
                </div>
                <p className="text-[12px] text-body leading-relaxed">
                  {insight.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Soil Dryness */}
        <div className="card p-6">
          <div className="flex flex-col gap-1 mb-4">
            <span className="label-caps">SOIL DRYNESS</span>
            <div className="flex items-baseline gap-3">
              <span className="metric-value">{metrics.dryness.value}%</span>
              <span className="text-xs text-body font-medium uppercase tracking-wider">{metrics.dryness.status}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`${metrics.dryness.color} h-2 rounded-full`} style={{ width: `${metrics.dryness.value}%` }}></div>
          </div>
        </div>

        {/* Quality Index */}
        <div className="card p-6">
          <div className="flex flex-col gap-1 mb-4">
            <span className="label-caps">OVERALL QUALITY INDEX</span>
            <div className="flex items-baseline gap-3">
              <span className="metric-value">{metrics.quality.value}/100</span>
              <span className="text-xs text-green-600 font-bold uppercase tracking-wider">{metrics.quality.status}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`${metrics.quality.color} h-2 rounded-full`} style={{ width: `${metrics.quality.value}%` }}></div>
          </div>
        </div>

        {/* PH Level */}
        <div className="card p-6">
          <div className="flex flex-col gap-1 mb-4">
            <span className="label-caps">PH LEVEL</span>
            <div className="flex items-baseline gap-3">
              <span className="metric-value">{metrics.ph.value}</span>
              <span className="text-xs text-body font-medium uppercase tracking-wider">{metrics.ph.status}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`${metrics.ph.color} h-2 rounded-full`} style={{ width: `${metrics.ph.value * 10}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;

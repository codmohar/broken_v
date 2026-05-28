import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const Dashboard = () => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await apiClient.get('/dashboard/insights');
        setInsights(response.data);
      } catch (error) {
        console.error("Error fetching dashboard insights:", error);
        setInsights([
          { id: 1, type: 'eco', title: 'Optimal Nitrogen Harvest', desc: 'Soil nitrogen levels in Plot B4 have peaked. Predictive harvest window: 48-72 hours.', color: 'health-bar-green', iconColor: 'text-primary-fixed-dim' },
          { id: 2, type: 'pest_control', title: 'Aphid Population Spike', desc: 'Drone scanners detected irregular heat patterns in Plot D2. Deploying bio-remediation.', color: 'health-bar-amber', iconColor: 'text-secondary' },
          { id: 3, type: 'bolt', title: 'Energy Grid Optimization', desc: 'Switching to solar reserve during peak demand. Expected savings: 4.2kW/h.', color: 'border-l-4 border-secondary', iconColor: 'text-secondary-fixed-dim' }
        ]);
      }
    };
    fetchInsights();
  }, []);

  return (
    <>
      {/* Hero & Alert Section */}
      <div className="grid grid-cols-12 gap-gutter mb-stack-lg">
        {/* Health Intelligence Score (Hero) */}
        <section className="col-span-12 lg:col-span-8 glass-panel rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[120px]">psychology</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" fill="transparent" r="88" stroke="currentColor" strokeWidth="10" className="text-surface-variant"></circle>
                <circle cx="100" cy="100" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="552.92" strokeDashoffset="66.35" className="text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,229,84,0.6)]"></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display-lg text-display-lg text-primary">88</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-tighter">Health Score</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Farm Health Intelligence</h2>
              <p className="text-on-surface-variant font-body-md max-w-md mb-6">Autonomous systems are currently managing Sector 7 with high efficiency. Biomass production is 12% above projected seasonal baselines.</p>
              <div className="flex gap-4">
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg">
                  <p className="text-[10px] font-label-caps text-on-surface-variant mb-1 uppercase">Growth Rate</p>
                  <p className="font-data-mono text-primary text-lg">+4.2% / day</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg">
                  <p className="text-[10px] font-label-caps text-on-surface-variant mb-1 uppercase">Biomass Est.</p>
                  <p className="font-data-mono text-primary text-lg">1,240 Tons</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Critical Alert Banner */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-error-container/20 border border-error/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-full group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined">warning</span>
                <span className="font-label-caps uppercase text-xs">Critical AI Alert</span>
              </div>
              <span className="font-data-mono text-[10px] text-error/60">LVL 4 RISK</span>
            </div>
            <div>
              <h3 className="font-headline-md text-on-error-container mb-2">Drought Risk Detected</h3>
              <p className="text-on-error-container/80 text-sm mb-4">Predictive models indicate a 78% moisture deficit in North-West quadrant within 36 hours. Immediate irrigation recalibration recommended.</p>
            </div>
            <button className="w-full py-3 bg-error text-on-error font-bold rounded-lg hover:bg-error/90 transition-colors">
              Initialize Water Loop
            </button>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[100px]">water_drop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Fleet Status */}
      <div className="grid grid-cols-12 gap-gutter mb-stack-lg">
        {/* Actionable Insights */}
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">lightbulb</span>
              Actionable Insights
            </h3>
            <span className="font-data-mono text-xs text-on-surface-variant/50">8 NEW EVENTS</span>
          </div>
          <div className="space-y-4">
            {insights.map(insight => (
              <div key={insight.id} className={`p-4 bg-surface-container-high/40 rounded-lg border border-outline-variant/10 flex gap-4 ${insight.color}`}>
                <span className={`material-symbols-outlined ${insight.iconColor}`}>{insight.type}</span>
                <div>
                  <p className="font-body-md text-primary leading-tight mb-1">{insight.title}</p>
                  <p className="text-xs text-on-surface-variant">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Fleet Status */}
        <div className="col-span-12 lg:col-span-5 glass-panel rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">precision_manufacturing</span>
              Device Fleet
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></div>
              <span className="font-data-mono text-sm text-primary">12/14 ACTIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 flex-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-lg flex items-center justify-center ${i === 4 || i === 9 ? 'bg-surface-variant/30 border border-outline-variant/30 opacity-40' : 'bg-primary/20 border border-primary-fixed-dim/40 shadow-[0_0_10px_rgba(0,229,84,0.15)]'}`}>
                <span className={`material-symbols-outlined text-xl ${i === 4 || i === 9 ? 'text-on-surface-variant' : 'text-primary'}`}>flight</span>
              </div>
            ))}
            <div className="col-span-4 mt-auto">
              <div className="flex justify-between text-xs font-label-caps text-on-surface-variant/60 mb-2">
                <span>TOTAL UPTIME</span>
                <span>98.4%</span>
              </div>
              <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                <div className="bg-primary-fixed-dim h-full w-[98%] glow-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics and Map Preview */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Metrics Cards */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-panel p-6 rounded-xl border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">grass</span>
              <h4 className="font-label-caps text-xs uppercase text-on-surface-variant">Soil Health</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary font-headline-md">7.2</span>
              <span className="text-sm font-data-mono text-on-surface-variant">pH</span>
            </div>
            <p className="text-xs text-primary-fixed-dim mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              Stabilized
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl border-l-4 border-secondary">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary">microscope</span>
              <h4 className="font-label-caps text-xs uppercase text-on-surface-variant">Disease Risk</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary font-headline-md">LOW</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">horizontal_rule</span>
              Stable (0.04%)
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl border-l-4 border-secondary-fixed-dim">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary-fixed-dim">opacity</span>
              <h4 className="font-label-caps text-xs uppercase text-on-surface-variant">Water Usage</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary font-headline-md">420</span>
              <span className="text-sm font-data-mono text-on-surface-variant">L/min</span>
            </div>
            <p className="text-xs text-error mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              Increased demand
            </p>
          </div>
        </div>

        {/* Regional Intelligence Mini-Map */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-xl overflow-hidden group">
          <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
            <span className="font-label-caps text-xs uppercase text-primary">Sector 7 Map</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">open_in_full</span>
          </div>
          <div className="h-48 relative overflow-hidden bg-surface-container-high/50 flex items-center justify-center">
            {/* Map Placeholder for now */}
            <span className="material-symbols-outlined text-on-surface-variant text-[48px] opacity-20">map</span>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <circle className="animate-pulse" cx="40%" cy="30%" fill="#00e554" r="4"></circle>
              <circle className="animate-pulse" cx="60%" cy="70%" fill="#00e554" r="4" style={{ animationDelay: '1s' }}></circle>
              <path className="glow-line-blue" d="M 40% 30% Q 50% 50% 60% 70%" fill="none" stroke="#4cd6ff" strokeDasharray="100" strokeDashoffset="100" strokeWidth="1.5"></path>
            </svg>
            <div className="absolute bottom-3 left-3 flex flex-col gap-1">
              <div className="bg-background/80 backdrop-blur px-2 py-1 rounded border border-outline-variant/30 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></div>
                <span className="font-data-mono text-[10px] text-primary">DRONE ALPHA-1: EN ROUTE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

import React, { useState } from 'react';

const Simulator = () => {
  const [temperature, setTemperature] = useState(24);
  const [precipitation, setPrecipitation] = useState(12);
  const [soilPh, setSoilPh] = useState(6.8);
  const [fertilizer, setFertilizer] = useState('TYPE-A');

  return (
    <>
      {/* Header Section */}
      <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-base">
        <div>
          <p className="font-data-mono text-label-caps text-surface-tint mb-1">MODULE // SIM_LAB_04</p>
          <h2 className="font-display-lg text-display-lg text-primary leading-none">Enhanced What-If Simulator</h2>
        </div>
        <div className="flex items-center gap-base glass-panel px-stack-md py-base rounded-xl">
          <span className="w-2 h-2 rounded-full bg-surface-tint animate-pulse"></span>
          <span className="font-data-mono text-data-mono text-primary">SIMULATION ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Variables Panel (Left) */}
        <aside className="lg:col-span-3 space-y-gutter">
          <div className="glass-panel p-container-padding rounded-xl">
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-lg border-b border-outline-variant/20 pb-base">Variables</h3>
            <div className="space-y-stack-lg">
              
              {/* Variable: Temperature */}
              <div className="space-y-base">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">TEMPERATURE</label>
                  <span className="font-data-mono text-data-mono text-primary-fixed">{temperature}.5°C</span>
                </div>
                <input 
                  className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer" 
                  max="50" min="0" type="range" 
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>

              {/* Variable: Precipitation */}
              <div className="space-y-base">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">PRECIPITATION</label>
                  <span className="font-data-mono text-data-mono text-primary-fixed">{precipitation}mm/d</span>
                </div>
                <input 
                  className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer" 
                  max="100" min="0" type="range" 
                  value={precipitation}
                  onChange={(e) => setPrecipitation(e.target.value)}
                />
              </div>

              {/* Variable: Fertilizer */}
              <div className="space-y-base">
                <label className="font-label-caps text-label-caps text-on-surface-variant">FERTILIZER TYPE</label>
                <div className="grid grid-cols-1 gap-base">
                  <button 
                    onClick={() => setFertilizer('TYPE-A')}
                    className={`text-left px-base py-stack-md rounded-lg text-data-mono transition-colors ${fertilizer === 'TYPE-A' ? 'bg-primary-container/10 border border-primary-container text-primary-fixed' : 'glass-panel hover:bg-surface-variant/30 text-on-surface-variant'}`}
                  >
                    TYPE-A: BIO-SYNTHETIC
                  </button>
                  <button 
                    onClick={() => setFertilizer('TYPE-B')}
                    className={`text-left px-base py-stack-md rounded-lg text-data-mono transition-colors ${fertilizer === 'TYPE-B' ? 'bg-primary-container/10 border border-primary-container text-primary-fixed' : 'glass-panel hover:bg-surface-variant/30 text-on-surface-variant'}`}
                  >
                    TYPE-B: NITROGEN-PLUS
                  </button>
                  <button 
                    onClick={() => setFertilizer('TYPE-C')}
                    className={`text-left px-base py-stack-md rounded-lg text-data-mono transition-colors ${fertilizer === 'TYPE-C' ? 'bg-primary-container/10 border border-primary-container text-primary-fixed' : 'glass-panel hover:bg-surface-variant/30 text-on-surface-variant'}`}
                  >
                    TYPE-C: ORGANIC-REGEN
                  </button>
                </div>
              </div>

              {/* Variable: Soil pH */}
              <div className="space-y-base">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">SOIL pH</label>
                  <span className="font-data-mono text-data-mono text-primary-fixed">{soilPh}</span>
                </div>
                <input 
                  className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer" 
                  max="14" min="0" step="0.1" type="range" 
                  value={soilPh}
                  onChange={(e) => setSoilPh(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button className="w-full py-container-padding bg-surface-tint text-surface-container-lowest font-headline-md rounded-xl active:scale-95 transition-transform shadow-[0_0_20px_rgba(0,229,84,0.3)]">
            Apply Scenario
          </button>
        </aside>

        {/* Centerpiece: Visualizer (Center) */}
        <section className="lg:col-span-6 flex flex-col gap-gutter">
          <div className="glass-panel relative flex-1 flex flex-col items-center justify-center p-stack-lg rounded-xl min-h-[400px] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00e554 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute top-stack-md left-stack-md font-data-mono text-label-caps text-surface-tint/50">LIDAR_SCAN_ACTIVE // RE_CALIBRATING...</div>
            
            {/* Crop Health Meter */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_20px_rgba(0,229,84,0.4)]">
                <circle cx="50%" cy="50%" fill="none" r="45%" stroke="#2f3632" strokeDasharray="10 2" strokeWidth="8"></circle>
                <circle className="transition-all duration-500 ease-in-out" cx="50%" cy="50%" fill="none" r="45%" stroke="#00e554" strokeDasharray="500" strokeDashoffset="60" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display-lg text-[64px] text-primary-fixed font-bold leading-none">88%</span>
                <span className="font-label-caps text-label-caps text-surface-tint tracking-widest mt-2">OPTIMAL HEALTH</span>
              </div>
            </div>
            
            <div className="mt-stack-lg grid grid-cols-3 gap-stack-lg w-full max-w-md">
              <div className="text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">YIELD PROJ.</p>
                <p className="font-data-mono text-body-md text-primary">+12.4%</p>
              </div>
              <div className="text-center border-x border-outline-variant/30">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">STRESS LVL</p>
                <p className="font-data-mono text-body-md text-secondary-fixed">LOW</p>
              </div>
              <div className="text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">MATURITY</p>
                <p className="font-data-mono text-body-md text-primary">42 DAYS</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-stack-md rounded-xl flex items-center gap-gutter border-l-4 border-secondary-container">
            <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl">lightbulb</span>
            <div>
              <p className="font-body-md font-bold text-primary">AI Insight</p>
              <p className="font-body-md text-on-surface-variant">Increasing moisture by 4% in the current temp scenario will boost root resilience by 18%.</p>
            </div>
          </div>
        </section>

        {/* Sustainability & Details (Right) */}
        <aside className="lg:col-span-3 space-y-gutter">
          <div className="glass-panel p-container-padding rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-stack-sm bg-secondary-container text-on-secondary-container font-label-caps text-[10px] rounded-bl-lg">ECO_SCORE</div>
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-surface-tint">eco</span>
              Sustainability
            </h3>
            
            <div className="space-y-stack-md">
              <div className="p-stack-md bg-surface-container-high/40 rounded-lg border border-outline-variant/10">
                <div className="flex justify-between mb-2">
                  <span className="text-label-caps text-on-surface-variant">CARBON FOOTPRINT</span>
                  <span className="text-data-mono text-error">HIGH</span>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-error w-3/4"></div>
                </div>
              </div>
              <div className="p-stack-md bg-surface-container-high/40 rounded-lg border border-outline-variant/10">
                <div className="flex justify-between mb-2">
                  <span className="text-label-caps text-on-surface-variant">WATER EFFICIENCY</span>
                  <span className="text-data-mono text-surface-tint">OPTIMAL</span>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-surface-tint w-11/12"></div>
                </div>
              </div>
              <div className="p-stack-md bg-surface-container-high/40 rounded-lg border border-outline-variant/10">
                <div className="flex justify-between mb-2">
                  <span className="text-label-caps text-on-surface-variant">SOIL DEPLETION</span>
                  <span className="text-data-mono text-secondary-fixed">MODERATE</span>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container w-1/2"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-stack-lg p-stack-md glass-panel rounded-lg text-center">
              <p className="text-label-caps text-on-surface-variant mb-1">SIMULATED NET IMPACT</p>
              <p className="font-data-mono text-headline-md text-primary">+2.4 CO2e/ha</p>
            </div>
          </div>
          
          <div className="glass-panel p-container-padding rounded-xl">
            <h4 className="font-label-caps text-label-caps text-surface-tint mb-base">HISTORICAL COMPARISON</h4>
            <div className="space-y-base">
              <div className="w-full h-32 rounded-lg bg-surface-container-high/50 flex items-center justify-center opacity-80 border border-outline-variant/20">
                <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[32px]">bar_chart</span>
              </div>
              <p className="text-label-caps text-on-surface-variant mt-2 text-center">CURRENT VS PROJECTED YIELD</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Simulator;

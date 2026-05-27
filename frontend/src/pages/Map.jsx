import React from 'react';

const Map = () => {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden -mt-6 -mx-6 md:-mx-8">
      {/* Main Map Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-surface-container-low flex items-center justify-center opacity-40 mix-blend-luminosity">
          <span className="material-symbols-outlined text-[120px] text-surface-variant">map</span>
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, #0e1511 90%)' }}></div>
      </div>

      {/* UI Overlays: Left Legend */}
      <div className="absolute top-gutter left-gutter z-10 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-xl w-64 bg-surface-container-lowest/80 backdrop-blur-xl">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">legend_toggle</span> REGIONAL DATA LEGEND
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error shadow-[0_0_15px_rgba(255,180,171,0.4)] animate-pulse"></span>
                <span className="font-body-md text-on-surface">Local Alerts</span>
              </div>
              <span className="font-data-mono text-error">12 Pings</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-surface-tint shadow-[0_0_15px_rgba(0,229,84,0.3)]"></span>
                <span className="font-body-md text-on-surface">Optimized Sectors</span>
              </div>
              <span className="font-data-mono text-surface-tint">84% Cov.</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="font-body-md text-on-surface">Shared Intelligence</span>
              </div>
              <span className="font-data-mono text-secondary">4 Nodes</span>
            </div>
          </div>
        </div>
        
        {/* Regional Stats Tiles */}
        <div className="flex flex-col gap-2">
          <div className="glass-panel p-3 rounded-lg border-l-4 border-l-secondary flex flex-col bg-surface-container-lowest/80 backdrop-blur-xl">
            <span className="font-label-caps text-[10px] text-secondary">AVG RAINFALL</span>
            <span className="font-data-mono text-headline-md text-secondary-fixed-dim">4.2mm <span className="text-sm font-normal">/24h</span></span>
          </div>
          <div className="glass-panel p-3 rounded-lg border-l-4 border-l-surface-tint flex flex-col bg-surface-container-lowest/80 backdrop-blur-xl">
            <span className="font-label-caps text-[10px] text-surface-tint">SOIL PH (REGIONAL)</span>
            <span className="font-data-mono text-headline-md text-primary-fixed-dim">6.8 <span className="text-sm font-normal">pH</span></span>
          </div>
        </div>
      </div>

      {/* UI Overlays: Map Points (Interactive simulation) */}
      <div className="absolute top-[40%] left-[55%] z-10">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-error/20 rounded-full animate-ping"></div>
          <span className="material-symbols-outlined text-error text-3xl shadow-[0_0_15px_rgba(255,180,171,0.4)] relative" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block w-48 glass-panel p-2 rounded-lg text-sm bg-surface-container-lowest/90 backdrop-blur-xl">
            <p className="font-bold text-error">Pest Alert: Sector 4</p>
            <p className="text-on-surface-variant text-xs">Aphid migration detected from Neighbor Farm B. AI recommends immediate preventative drone swarm deployment.</p>
          </div>
        </div>
      </div>
      <div className="absolute top-[25%] left-[30%] z-10">
        <div className="relative group cursor-pointer">
          <span className="material-symbols-outlined text-surface-tint text-3xl shadow-[0_0_15px_rgba(0,229,84,0.3)]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block w-48 glass-panel p-2 rounded-lg text-sm border-b-2 border-b-surface-tint bg-surface-container-lowest/90 backdrop-blur-xl">
            <p className="font-bold text-surface-tint">Optimized Zone A</p>
            <p className="text-on-surface-variant text-xs">Peak moisture retention. Nitrogen levels balanced via collaborative crop rotation data.</p>
          </div>
        </div>
      </div>

      {/* Right Side: AI Insights Overlay */}
      <div className="absolute top-gutter right-gutter z-10 w-80 space-y-4">
        <div className="glass-panel overflow-hidden rounded-xl border-l-4 border-l-primary-container bg-surface-container-lowest/80 backdrop-blur-xl">
          <div className="p-4 bg-primary-container/10 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary-fixed-dim flex items-center gap-2">
              <span className="material-symbols-outlined">auto_awesome</span> Intelligence
            </h3>
            <span className="bg-surface-variant text-primary-fixed text-[10px] px-2 py-0.5 rounded font-data-mono">BETA</span>
          </div>
          <div className="p-4">
            <p className="font-label-caps text-[11px] text-on-surface-variant mb-4 uppercase tracking-widest">Top 3 Regional Best Practices</p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="font-data-mono text-surface-tint text-lg">01</span>
                <div>
                  <p className="font-bold text-on-surface leading-tight">Sync Night-Cooling Cycles</p>
                  <p className="text-xs text-on-surface-variant mt-1">Neighbors 3 & 7 saw 12% yield increase by delaying irrigation to 03:00 AM UTC.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-data-mono text-surface-tint text-lg">02</span>
                <div>
                  <p className="font-bold text-on-surface leading-tight">Shared Drone Pathing</p>
                  <p className="text-xs text-on-surface-variant mt-1">Collaborative fleet flight paths reduce battery consumption by 15% across regional sectors.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-data-mono text-surface-tint text-lg">03</span>
                <div>
                  <p className="font-bold text-on-surface leading-tight">Cross-Sector Soil Buffer</p>
                  <p className="text-xs text-on-surface-variant mt-1">Utilize shared PH data to create a high-nitrogen buffer zone at Sector 9 boundary.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-primary-container text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
              APPLY ALL SUGGESTIONS
              <span className="material-symbols-outlined text-sm">bolt</span>
            </button>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="glass-panel p-4 rounded-xl bg-surface-container-lowest/80 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Fleet Status</span>
            <span className="font-data-mono text-xs text-surface-tint">READY</span>
          </div>
          <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
            <div className="bg-surface-tint h-full w-[92%] shadow-[0_0_8px_rgba(0,229,84,0.5)]"></div>
          </div>
          <div className="flex justify-between mt-2 font-data-mono text-[10px] text-on-surface-variant">
            <span>92% Battery Avg.</span>
            <span>12 Active Units</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;

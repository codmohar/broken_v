import React, { useState } from 'react';

const Analysis = () => {
  const [timeline, setTimeline] = useState(7);

  return (
    <>
      <div className="flex flex-col gap-gutter">
        <h2 className="font-display-lg text-display-lg text-primary leading-none mb-6">Agro Intelligence Engine</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Chart Section: Future Projection */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Predictive Yield & Vitality</h2>
                <p className="font-data-mono text-data-mono text-on-surface-variant">MODEL: AGRO-SENTINEL V4.2</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-surface-tint shadow-[0_0_8px_#00e554]"></span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Moisture</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary-container shadow-[0_0_8px_#14d1ff]"></span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Stress Index</span>
                </div>
              </div>
            </div>
            
            {/* High-Fidelity Chart Placeholder */}
            <div className="relative h-[400px] w-full bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/20 shadow-[inset_0_0_10px_rgba(0,229,84,0.1)]">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
                {/* Grid Lines */}
                <path d="M0 100 L800 100 M0 200 L800 200 M0 300 L800 300" stroke="rgba(186, 203, 181, 0.05)" strokeWidth="1"></path>
                <path d="M160 0 L160 400 M320 0 L320 400 M480 0 L480 400 M640 0 L640 400" stroke="rgba(186, 203, 181, 0.05)" strokeWidth="1"></path>
                {/* Soil Moisture (Primary Green) */}
                <path className="drop-shadow-[0_0_8px_rgba(0,229,84,0.5)]" d="M0 250 Q 100 230, 200 260 T 400 210 T 600 240 T 800 180" fill="none" stroke="#00e554" strokeWidth="3"></path>
                {/* Crop Stress (Secondary Blue) */}
                <path className="drop-shadow-[0_0_8px_rgba(20,209,255,0.5)]" d="M0 150 Q 150 180, 300 140 T 500 190 T 800 130" fill="none" stroke="#14d1ff" strokeDasharray="8 4" strokeWidth="3"></path>
                {/* Vertical Indicator */}
                <line stroke="#00e554" strokeDasharray="4 2" strokeWidth="2" x1="200" x2="200" y1="0" y2="400"></line>
                <circle className="animate-pulse" cx="200" cy="260" fill="#00e554" r="6"></circle>
                <circle cx="200" cy="155" fill="#14d1ff" r="6"></circle>
              </svg>
              
              {/* Data Chips floating over chart */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-surface-container-highest/60 backdrop-blur-md border border-surface-tint/20 rounded px-2 py-1 flex items-center gap-2">
                  <span className="font-data-mono text-label-caps text-surface-tint">MOISTURE: 72%</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-surface-container-highest/80 backdrop-blur-md px-3 py-1 rounded border border-outline-variant/30">
                <span className="font-data-mono text-label-caps text-on-surface-variant">TIMELINE ANCHOR: +{timeline} DAYS</span>
              </div>
            </div>
          </div>
          
          {/* Future Projection Slider */}
          <div className="glass-panel p-8 rounded-xl flex flex-col gap-6 shadow-[0_0_15px_rgba(0,229,84,0.2)]">
            <div className="flex justify-between items-end">
              <span className="font-label-caps text-label-caps text-surface-tint">INTEL-DRIVEN PROJECTION SLIDER</span>
              <span className="font-headline-md text-headline-md text-on-surface">{timeline}-Day Outlook</span>
            </div>
            <div className="relative pt-4">
              <input 
                className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer" 
                max="30" min="1" type="range" 
                value={timeline} 
                onChange={(e) => setTimeline(e.target.value)} 
              />
              <div className="flex justify-between mt-6 px-1">
                <div className="flex flex-col items-center">
                  <div className="w-px h-3 bg-outline-variant"></div>
                  <span className="font-data-mono text-label-caps mt-2 text-on-surface-variant">1 DAY</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-3 bg-surface-tint"></div>
                  <span className="font-data-mono text-label-caps mt-2 text-surface-tint">7 DAYS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-3 bg-outline-variant"></div>
                  <span className="font-data-mono text-label-caps mt-2 text-on-surface-variant">14 DAYS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-3 bg-outline-variant"></div>
                  <span className="font-data-mono text-label-caps mt-2 text-on-surface-variant">30 DAYS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar: AI Analysis Card */}
        <aside className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="glass-panel p-6 rounded-xl border-l-4 border-l-surface-tint flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-surface-tint" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Future Outlook</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-surface-variant/20 rounded-lg border border-outline-variant/10">
                <p className="font-body-md text-on-surface leading-relaxed">
                  Based on current trajectory, <span className="text-surface-tint font-bold">Sector 7G</span> will reach peak metabolic efficiency in <span className="text-primary-fixed">72 hours</span>. We recommend pre-emptive nitrogen injection to offset the projected soil depletion in T-minus 5 days.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">PROBABILITY</span>
                  <span className="font-headline-md text-headline-md text-surface-tint">94.2%</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">RISK LEVEL</span>
                  <span className="font-headline-md text-headline-md text-secondary-container">LOW</span>
                </div>
              </div>
            </div>
            <div className="h-px bg-outline-variant/20 my-2"></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-surface-tint text-[18px]">water_drop</span>
                  <span className="font-body-md text-on-surface">Irrigation Cycle</span>
                </div>
                <span className="font-data-mono text-data-mono text-primary-fixed">OPTIMIZED</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-surface-tint text-[18px]">pest_control</span>
                  <span className="font-body-md text-on-surface">Biotic Threat</span>
                </div>
                <span className="font-data-mono text-data-mono text-on-surface-variant">0.02%</span>
              </div>
            </div>
            <button className="w-full bg-surface-tint py-4 rounded-xl text-surface-container-lowest font-bold font-label-caps hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,229,84,0.2)] flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              EXECUTE ADAPTIVE PROTOCOL
            </button>
          </div>

          {/* Contextual Sector Map */}
          <div className="glass-panel rounded-xl overflow-hidden relative group">
            <div className="h-48 w-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-surface-variant text-[64px] opacity-20">landscape</span>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">Sector 7G</h4>
                <p className="font-data-mono text-label-caps text-on-surface-variant">COORDINATES: 41.8781° N, 87.6298° W</p>
              </div>
              <span className="material-symbols-outlined text-surface-tint bg-background/60 p-2 rounded-full border border-surface-tint/30">location_on</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Analysis;

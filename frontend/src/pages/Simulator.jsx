import React, { useState, useMemo } from 'react';

const Simulator = () => {
  const [irrigation, setIrrigation] = useState(50);
  const [moisture, setMoisture] = useState(40);
  const [temperature, setTemperature] = useState(24);

  // Derived Outcomes Calculation
  const simulation = useMemo(() => {
    const irr = parseFloat(irrigation);
    const moist = parseFloat(moisture);
    const temp = parseFloat(temperature);

    // Simulated Final Moisture after irrigation (assume irrigation adds to moisture)
    const finalMoisture = Math.min(100, moist + (irr * 0.6));

    // Water Efficiency: High if irrigation fills exactly the gap to 60% moisture.
    const optimalIrrigation = Math.max(0, (60 - moist) / 0.6);
    let efficiency = 100 - Math.abs(irr - optimalIrrigation);
    efficiency = Math.max(0, Math.min(100, efficiency));

    // Crop Health
    const tempPenalty = Math.abs(temp - 24) * 3;
    const moisturePenalty = Math.abs(finalMoisture - 65) * 1.5;
    let health = 100 - tempPenalty - moisturePenalty;
    health = Math.max(0, Math.min(100, health));

    // Disease Risk
    let risk = 0;
    if (temp > 25) risk += (temp - 25) * 5;
    if (finalMoisture > 65) risk += (finalMoisture - 65) * 2;
    risk = Math.max(0, Math.min(100, risk));

    // Sustainability Score
    let sustainability = (efficiency + health + (100 - risk)) / 3;

    return {
      waterEfficiency: Math.round(efficiency),
      cropHealth: Math.round(health),
      diseaseRisk: Math.round(risk),
      sustainabilityScore: Math.round(sustainability),
      finalMoisture: Math.round(finalMoisture)
    };
  }, [irrigation, moisture, temperature]);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">What-If Simulator</h1>
        <p className="text-sm text-body">Test environmental factors and visualize projected outcomes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 border-t-4 border-blue-500">
            <h3 className="font-bold text-heading mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">tune</span>
              Simulation Parameters
            </h3>
            
            <div className="space-y-6">
              {/* Irrigation Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Irrigation Level</label>
                  <span className="text-sm font-bold text-blue-600">{irrigation}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={irrigation} 
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Moisture Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Base Moisture</label>
                  <span className="text-sm font-bold text-blue-500">{moisture}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={moisture} 
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Temperature</label>
                  <span className="text-sm font-bold text-amber-500">{temperature}°C</span>
                </div>
                <input 
                  type="range" min="10" max="40" 
                  value={temperature} 
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
               <span className="material-symbols-outlined text-blue-500">info</span>
               <p className="text-xs text-blue-800 leading-relaxed">Adjusting these parameters instantly recalculates the predicted outcomes on the right using simulated agronomy models.</p>
            </div>
          </div>
        </div>

        {/* Visualizer & Outcomes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Main Crop Health Display */}
            <div className="card p-8 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3">
                  <span className="material-symbols-outlined text-green-200 text-6xl opacity-20">compost</span>
               </div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Crop Health Stability</h3>
               
               {/* Radial Progress */}
               <div className="relative w-48 h-48">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="50%" cy="50%" fill="none" r="45%" stroke="#f3f4f6" strokeWidth="8"></circle>
                   <circle 
                     className="transition-all duration-500 ease-out" 
                     cx="50%" cy="50%" fill="none" r="45%" 
                     stroke={simulation.cropHealth > 70 ? '#22c55e' : simulation.cropHealth > 40 ? '#f59e0b' : '#ef4444'} 
                     strokeDasharray="283" 
                     strokeDashoffset={283 - (283 * simulation.cropHealth) / 100} 
                     strokeWidth="8"
                     strokeLinecap="round"
                   ></circle>
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-black text-heading">{simulation.cropHealth}%</span>
                   <span className="text-xs font-bold text-gray-400">STABILITY</span>
                 </div>
               </div>
            </div>

            {/* Sustainability Score */}
            <div className="card p-8 bg-gradient-to-br from-[#102A1E] to-[#1a3d2e] text-white flex flex-col justify-center">
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-6">Sustainability Score</h3>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-6xl font-black leading-none">{simulation.sustainabilityScore}</span>
                <span className="text-xl text-green-200 font-bold mb-1">/ 100</span>
              </div>
              <p className="text-sm text-green-100/70 leading-relaxed">
                Based on water usage efficiency and projected disease prevention.
              </p>
              
              <div className="mt-6 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-green-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${simulation.sustainabilityScore}%` }}>
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Water Efficiency */}
            <div className="card p-6 border-l-4 border-blue-500">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Water Efficiency</h3>
                   <span className="text-3xl font-black text-heading">{simulation.waterEfficiency}%</span>
                 </div>
                 <span className="material-symbols-outlined text-blue-500 text-3xl">water_ec</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                 <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${simulation.waterEfficiency}%` }}></div>
               </div>
               <p className="text-xs text-gray-500 mt-3">Avoids over/under-watering.</p>
            </div>

            {/* Disease Risk */}
            <div className="card p-6 border-l-4 border-red-500">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Disease Risk</h3>
                   <span className="text-3xl font-black text-heading">{simulation.diseaseRisk}%</span>
                 </div>
                 <span className="material-symbols-outlined text-red-500 text-3xl">coronavirus</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                 <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${simulation.diseaseRisk}%` }}></div>
               </div>
               <p className="text-xs text-gray-500 mt-3">Risk spikes with high temp & humidity.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Simulator;

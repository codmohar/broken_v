import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiseaseDetection = () => {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/scans');
        setRecentScans(response.data);
      } catch (error) {
        console.error("Error fetching scans:", error);
        setRecentScans([
          { id: 1, title: 'Tomato Block A', time: '2 hrs ago', status: 'Healthy', statusColor: 'bg-green-600' },
          { id: 2, title: 'Corn Sector 2', time: '5 hrs ago', status: 'Nutrient Def.', statusColor: 'bg-amber-600' },
          { id: 3, title: 'Soybean Plot C', time: 'Yesterday', status: 'Pest Damage', statusColor: 'bg-red-400' },
          { id: 4, title: 'Tomato Block A', time: 'Yesterday', status: 'Healthy', statusColor: 'bg-green-600' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Scan Upload Area */}
        <div className="lg:col-span-2 card p-8">
          <h2 className="text-xl font-bold text-heading mb-1">New Scan</h2>
          <p className="text-sm text-body mb-8">Upload or drag and drop leaf images for AI analysis.</p>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-gray-400 text-3xl">upload</span>
            </div>
            <p className="text-lg font-semibold text-heading mb-1">Drag & Drop Image Here</p>
            <p className="text-sm text-body mb-6">or</p>
            <button className="px-8 py-2.5 bg-sidebar text-white rounded-lg text-sm font-semibold hover:bg-sidebar-hover transition-colors">
              Browse Files
            </button>
            <p className="text-xs text-muted mt-8 font-mono">Supports JPG, PNG (Max 10MB)</p>
          </div>
        </div>

        {/* Fungal Blight Result Card */}
        <div className="card overflow-hidden">
          <div className="relative h-48">
            <img 
              src="/diseased_leaf.png" 
              alt="Fungal Blight" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              HIGH RISK
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-heading mb-1">Fungal Blight</h3>
            <p className="text-sm text-body mb-6">Confidence Score: <span className="font-bold text-heading">82%</span></p>
            
            <div className="space-y-6">
              <div>
                <span className="label-caps block mb-2.5">AFFECTED AREA</span>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-red-accent h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <p className="text-[11px] font-mono text-muted">35% of leaf surface</p>
              </div>

              <div>
                <span className="label-caps block mb-2.5">RECOMMENDATION</span>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs text-body leading-relaxed">
                    Apply Copper Fungicide immediately. Quarantine affected sector (Sector 4B) to prevent spread.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-heading">Recent Scans</h2>
          <button className="label-caps text-[10px] hover:text-heading transition-colors">VIEW ALL</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentScans.map((scan) => (
            <div key={scan.id} className="border border-card-border rounded-xl overflow-hidden group cursor-pointer hover:border-green-300 transition-colors">
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                <img 
                  src="/plant_scans.png" 
                  alt={scan.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute bottom-2 left-2 ${scan.statusColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}>
                  {scan.status}
                </div>
              </div>
              <div className="p-3 bg-gray-50/50">
                <h4 className="text-[13px] font-bold text-heading truncate">{scan.title}</h4>
                <p className="text-[11px] text-muted font-mono mt-0.5">{scan.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/api';
import { diseaseService } from '../services/api';

const DiseaseDetection = () => {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await apiClient.get('/scans');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPredictionResult(null); // Reset previous result
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPredictionResult(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Small artificial delay to simulate AI processing for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await diseaseService.predictDisease(selectedImage);
      setPredictionResult(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Scan Upload Area */}
        <div className="lg:col-span-2 card p-8">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold text-heading">New Scan</h2>
            {previewUrl && !isAnalyzing && !predictionResult && (
              <button onClick={clearSelection} className="text-sm text-red-500 hover:text-red-600 font-semibold">
                Clear
              </button>
            )}
          </div>
          <p className="text-sm text-body mb-8">Upload or drag and drop leaf images for AI analysis.</p>
          
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
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
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-200">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-sidebar/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-5xl animate-spin mb-4">autorenew</span>
                    <p className="text-white font-semibold animate-pulse">AI is analyzing...</p>
                  </div>
                )}
              </div>
              
              {!predictionResult && !isAnalyzing && (
                <button 
                  onClick={handleAnalyze}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Analyze Image
                </button>
              )}
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/jpeg, image/png" 
            className="hidden" 
          />
        </div>

        {/* Result Card */}
        <div className="card overflow-hidden flex flex-col justify-center min-h-[350px]">
          {predictionResult ? (
            <>
              <div className="relative h-48 bg-gray-100 shrink-0">
                <img 
                  src={previewUrl} 
                  alt={predictionResult.disease_name} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm ${
                  predictionResult.risk_level === 'HIGH RISK' 
                    ? 'bg-red-600/90' 
                    : predictionResult.risk_level === 'MEDIUM RISK'
                      ? 'bg-amber-500/90'
                      : 'bg-green-600/90'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  {predictionResult.risk_level}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading mb-1">{predictionResult.disease_name}</h3>
                <p className="text-sm text-body mb-5">Confidence Score: <span className="font-bold text-heading">{predictionResult.confidence_score}%</span></p>
                
                <div className="space-y-5">
                  <div>
                    <span className="label-caps block mb-2">AFFECTED AREA</span>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div className="bg-red-accent h-2 rounded-full" style={{ width: `${predictionResult.affected_area}%` }}></div>
                    </div>
                    <p className="text-[11px] font-mono text-muted">{predictionResult.affected_area}% of leaf surface</p>
                  </div>

                  <div>
                    <span className="label-caps block mb-2">AI OBSERVATION</span>
                    <p className="text-xs text-body italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                      "{predictionResult.ai_observation}"
                    </p>
                  </div>

                  <div>
                    <span className="label-caps block mb-2">RECOMMENDATION</span>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-body font-semibold">
                        {predictionResult.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
             <div className="p-10 flex flex-col items-center justify-center text-center h-full text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-4 opacity-50">biotech</span>
                <p className="text-sm">Upload an image to see AI analysis results here.</p>
             </div>
          )}
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

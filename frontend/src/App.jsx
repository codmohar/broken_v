import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import DiseaseDetection from './pages/DiseaseDetection';
import SoilAnalysis from './pages/SoilAnalysis';
import WeatherForecast from './pages/WeatherForecast';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Map from './pages/Map';
import Simulator from './pages/Simulator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="map" element={<Map />} />
        <Route path="simulator" element={<Simulator />} />
        <Route path="disease-detection" element={<DiseaseDetection />} />
        <Route path="soil-analysis" element={<SoilAnalysis />} />
        <Route path="weather-forecast" element={<WeatherForecast />} />
      </Route>
    </Routes>
  );
}

export default App;

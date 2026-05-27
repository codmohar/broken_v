import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/api';

const AlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  useEffect(() => {
    const checkConditions = async () => {
      try {
        const sensors = await sensorService.getSensors();
        const t = sensors.temperature;
        const h = sensors.humidity;
        const m = sensors.soil_moisture;

        const activeAlerts = [];

        // Low Soil Moisture
        if (m < 25) {
          activeAlerts.push({
            id: 'low_moisture',
            type: 'critical',
            icon: 'water_drop',
            title: 'Critical Moisture',
            message: `Soil moisture critically low (${m}%). Immediate irrigation required.`,
            color: 'bg-red-600 text-white border-red-700 shadow-red-600/20',
            iconColor: 'text-white'
          });
        }

        // Excessive Humidity
        if (h > 75) {
          activeAlerts.push({
            id: 'high_humidity',
            type: 'warning',
            icon: 'air',
            title: 'Excessive Humidity',
            message: `Humidity levels exceed safe threshold (${h}%).`,
            color: 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-500/10',
            iconColor: 'text-amber-600'
          });
        }

        // Abnormal Temperature
        if (t < 10 || t > 35) {
          activeAlerts.push({
            id: 'abnormal_temp',
            type: 'warning',
            icon: 'device_thermostat',
            title: 'Abnormal Temperature',
            message: `Temperature outside optimal range (${t}°C).`,
            color: 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-500/10',
            iconColor: 'text-amber-600'
          });
        }

        // High Disease Risk
        if (h > 70 && t > 28) {
          activeAlerts.push({
            id: 'disease_risk',
            type: 'critical',
            icon: 'pest_control',
            title: 'High Disease Risk',
            message: 'Sustained high temperature and humidity detected. Risk of fungal spread.',
            color: 'bg-red-600 text-white border-red-700 shadow-red-600/20',
            iconColor: 'text-white'
          });
        }

        // Filter out dismissed alerts
        const visibleAlerts = activeAlerts.filter(a => !dismissedIds.has(a.id));
        setAlerts(visibleAlerts);
        
      } catch (error) {
        console.error("AlertSystem failed to fetch telemetry:", error);
      }
    };

    checkConditions();
    const interval = setInterval(checkConditions, 5000);
    return () => clearInterval(interval);
  }, [dismissedIds]);

  const handleDismiss = (id) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-slide-up ${alert.color}`}
        >
          <span className={`material-symbols-outlined mt-0.5 ${alert.iconColor}`}>
            {alert.icon}
          </span>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
            <p className="text-xs opacity-90 leading-relaxed">{alert.message}</p>
          </div>
          <button 
            onClick={() => handleDismiss(alert.id)}
            className="hover:opacity-70 transition-opacity"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default AlertSystem;

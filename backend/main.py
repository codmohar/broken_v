import datetime
import random
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

class PredictionResponse(BaseModel):
    disease_name: str
    confidence_score: int
    risk_level: str
    affected_area: int
    recommendation: str
    ai_observation: str

class SensorResponse(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: float


app = FastAPI(title="AgroGuardian AI Backend", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanResponse(BaseModel):
    id: int
    title: str
    time: str
    status: str
    statusColor: str

class InsightResponse(BaseModel):
    id: int
    type: str
    title: str
    desc: str
    color: str
    iconColor: str

class MetricDetail(BaseModel):
    value: float
    status: str
    color: str

class SoilMetricsResponse(BaseModel):
    dryness: MetricDetail
    quality: MetricDetail
    ph: MetricDetail

class ForecastDetail(BaseModel):
    day: str
    high: str
    low: str
    rain: str
    icon: str

class WeatherResponse(BaseModel):
    forecast: List[ForecastDetail]

@app.get("/")
def read_root():
    return {"message": "AgroGuardian AI Backend Server is running"}

@app.get("/api/health")
def read_health():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat() + "Z"}

@app.get("/api/scans", response_model=List[ScanResponse])
def get_scans():
    return [
        {"id": 1, "title": "Tomato Block A", "time": "2 hrs ago", "status": "Healthy", "statusColor": "bg-green-600"},
        {"id": 2, "title": "Corn Sector 2", "time": "5 hrs ago", "status": "Nutrient Def.", "statusColor": "bg-amber-600"},
        {"id": 3, "title": "Soybean Plot C", "time": "Yesterday", "status": "Pest Damage", "statusColor": "bg-red-400"},
        {"id": 4, "title": "Tomato Block A", "time": "Yesterday", "status": "Healthy", "statusColor": "bg-green-600"}
    ]

@app.get("/api/dashboard/insights", response_model=List[InsightResponse])
def get_dashboard_insights():
    return [
        {
            "id": 1,
            "type": "eco",
            "title": "Optimal Nitrogen Harvest (FastAPI)",
            "desc": "Soil nitrogen levels in Plot B4 have peaked. Predictive harvest window: 48-72 hours.",
            "color": "health-bar-green",
            "iconColor": "text-primary-fixed-dim"
        },
        {
            "id": 2,
            "type": "pest_control",
            "title": "Aphid Population Spike (FastAPI)",
            "desc": "Drone scanners detected irregular heat patterns in Plot D2. Deploying bio-remediation.",
            "color": "health-bar-amber",
            "iconColor": "text-secondary"
        },
        {
            "id": 3,
            "type": "bolt",
            "title": "Energy Grid Optimization (FastAPI)",
            "desc": "Switching to solar reserve during peak demand. Expected savings: 4.2kW/h.",
            "color": "border-l-4 border-secondary",
            "iconColor": "text-secondary-fixed-dim"
        }
    ]

@app.get("/api/soil/metrics", response_model=SoilMetricsResponse)
def get_soil_metrics():
    return {
        "dryness": {"value": 28, "status": "Sub-optimal", "color": "bg-amber-600"},
        "quality": {"value": 84, "status": "Good", "color": "bg-green-600"},
        "ph": {"value": 6.5, "status": "Neutral", "color": "bg-green-300"}
    }

@app.get("/api/soil/insights", response_model=List[InsightResponse])
def get_soil_insights():
    return [
        {
            "id": 1,
            "type": "warning",
            "title": "Nitrogen Deficit Detected (FastAPI)",
            "desc": "Zone 3 shows a 15% drop in N levels over 48h. Recommend applying targeted urea-based fertilizer.",
            "color": "bg-red-50/50 border-red-100",
            "iconColor": "text-amber-700"
        },
        {
            "id": 2,
            "type": "opacity",
            "title": "Moisture Optimization (FastAPI)",
            "desc": "Current dryness at 28%. Scheduled pump activation at 18:00 will return levels to optimal 35%.",
            "color": "bg-gray-50 border-gray-100",
            "iconColor": "text-blue-700"
        }
    ]

@app.get("/api/weather", response_model=WeatherResponse)
def get_weather():
    return {
        "forecast": [
            {"day": "Today", "high": "24°", "low": "18°", "rain": "10%", "icon": "partly_cloudy_day"},
            {"day": "Tomorrow", "high": "21°", "low": "16°", "rain": "85%", "icon": "rainy"},
            {"day": "Wed", "high": "22°", "low": "15°", "rain": "30%", "icon": "cloud"},
            {"day": "Thu", "high": "26°", "low": "17°", "rain": "0%", "icon": "sunny"},
            {"day": "Fri", "high": "28°", "low": "18°", "rain": "0%", "icon": "sunny"},
            {"day": "Sat", "high": "27°", "low": "19°", "rain": "15%", "icon": "partly_cloudy_day"},
            {"day": "Sun", "high": "23°", "low": "16°", "rain": "60%", "icon": "rainy"}
        ]
    }

@app.get("/api/sensors", response_model=SensorResponse)
def get_sensors():
    # Simulate slight sensor fluctuations
    temp = round(24.0 + random.uniform(-1.5, 1.5), 1)
    hum = round(65.0 + random.uniform(-2.0, 2.0), 1)
    soil = round(42.0 + random.uniform(-3.0, 3.0), 1)
    return {
        "temperature": temp,
        "humidity": hum,
        "soil_moisture": soil
    }

@app.post("/api/scans/predict", response_model=PredictionResponse)
async def predict_disease(image: UploadFile = File(...)):
    # Simulating AI disease detection with random realistic responses
    mock_responses = [
        {
            "disease_name": "Tomato Early Blight",
            "confidence_score": 92,
            "risk_level": "HIGH RISK",
            "affected_area": 25,
            "recommendation": "Remove infected lower leaves and apply chlorothalonil fungicide.",
            "ai_observation": "Concentric rings detected on lower foliage, symptomatic of Alternaria solani."
        },
        {
            "disease_name": "Leaf Spot",
            "confidence_score": 85,
            "risk_level": "MEDIUM RISK",
            "affected_area": 15,
            "recommendation": "Improve air circulation and avoid overhead watering. Apply broad-spectrum fungicide.",
            "ai_observation": "Multiple small, dark circular lesions with tan centers observed."
        },
        {
            "disease_name": "Powdery Mildew",
            "confidence_score": 88,
            "risk_level": "MEDIUM RISK",
            "affected_area": 40,
            "recommendation": "Apply sulfur-based fungicide or potassium bicarbonate. Ensure adequate spacing.",
            "ai_observation": "White, powdery fungal spots detected primarily on upper leaf surfaces."
        },
        {
            "disease_name": "Healthy Plant",
            "confidence_score": 98,
            "risk_level": "LOW RISK",
            "affected_area": 0,
            "recommendation": "No action required. Maintain current watering and nutrient schedule.",
            "ai_observation": "Leaf pigmentation and structure appear normal with no visible pathogens."
        }
    ]
    return random.choice(mock_responses)

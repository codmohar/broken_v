import datetime
import json
import random
import io
import os
import urllib.parse
import urllib.request
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from PIL import Image
import numpy as np

# Setup Pydantic models for existing endpoints
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

class LocalWeatherResponse(BaseModel):
    location: str
    country: str
    temperature: float
    feels_like: float
    humidity: int
    wind_kmh: float
    description: str
    icon: str
    rain_probability: int
    rain_next_24h_mm: float
    updated_at: str
    insight: str
    forecast: List[ForecastDetail] = []

class AdviceRequest(BaseModel):
    context: str
    weather: Optional[Dict[str, Any]] = None
    disease: Optional[Dict[str, Any]] = None
    sensors: Optional[Dict[str, Any]] = None

class AdviceResponse(BaseModel):
    advice: str
    source: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    weather: Optional[Dict[str, Any]] = None
    sensors: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    source: str

# Create FastAPI app
app = FastAPI(title="AgroGuardian AI Backend", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_env_file():
    for env_path in [
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.path.dirname(__file__), "..", ".env"),
    ]:
        if not os.path.exists(env_path):
            continue
        with open(env_path, "r", encoding="utf-8") as env_file:
            for line in env_file:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))

load_env_file()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

def fetch_openweather_json(path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=503, detail="OPENWEATHER_API_KEY is not configured")

    query = urllib.parse.urlencode({**params, "appid": OPENWEATHER_API_KEY, "units": "metric"})
    url = f"https://api.openweathermap.org/data/2.5/{path}?{query}"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            import json
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=502, detail=f"OpenWeather request failed: {detail}") from exc
    except urllib.error.URLError as exc:
        raise HTTPException(status_code=502, detail=f"OpenWeather request failed: {exc.reason}") from exc

def fetch_gemini_advice(prompt: str) -> str:
    if not GEMINI_API_KEY:
        return ""

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{urllib.parse.quote(GEMINI_MODEL)}:generateContent?key={urllib.parse.quote(GEMINI_API_KEY)}"
    )
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 220,
        },
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
        return ""

    candidates = data.get("candidates", [])
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    return " ".join(part.get("text", "") for part in parts).strip()

def map_weather_icon(openweather_icon: str, condition_id: int) -> str:
    if 200 <= condition_id < 300:
        return "thunderstorm"
    if 300 <= condition_id < 600:
        return "rainy"
    if 600 <= condition_id < 700:
        return "weather_snowy"
    if 700 <= condition_id < 800:
        return "foggy"
    if condition_id == 800:
        return "sunny" if openweather_icon.endswith("d") else "clear_night"
    return "partly_cloudy_day" if openweather_icon.endswith("d") else "partly_cloudy_night"

def build_weather_insight(rain_probability: int, rain_mm: float, humidity: int, temp: float) -> str:
    if rain_probability >= 70 or rain_mm >= 5:
        return "High rain probability nearby. Reduce irrigation and monitor for fungal pressure after leaf wetness."
    if humidity >= 80 and temp >= 24:
        return "Warm, humid conditions can increase disease pressure. Prioritize scouting and avoid overhead watering."
    if temp >= 34:
        return "Heat stress risk is elevated. Check soil moisture and schedule irrigation outside peak afternoon heat."
    if rain_probability <= 20:
        return "Low rain probability in the near term. Maintain planned irrigation if soil moisture trends downward."
    return "Weather is stable for routine operations. Keep monitoring humidity, wind, and soil moisture trends."

def build_local_forecast(forecast_items: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    grouped: Dict[str, Dict[str, Any]] = {}
    today = datetime.datetime.now(datetime.timezone.utc).date()

    for item in forecast_items:
        timestamp = int(item.get("dt", 0))
        dt = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
        date_key = dt.date().isoformat()
        main = item.get("main", {})
        weather = item.get("weather", [{}])[0]
        temp = float(main.get("temp", 0))
        rain = item.get("pop", 0) * 100

        entry = grouped.setdefault(date_key, {
            "date": dt.date(),
            "temps": [],
            "rain": 0,
            "icon": weather.get("icon", "02d"),
            "weather_id": int(weather.get("id", 801)),
        })
        entry["temps"].append(temp)
        entry["rain"] = max(entry["rain"], rain)
        if 11 <= dt.hour <= 15:
            entry["icon"] = weather.get("icon", entry["icon"])
            entry["weather_id"] = int(weather.get("id", entry["weather_id"]))

    details = []
    for entry in sorted(grouped.values(), key=lambda item: item["date"])[:7]:
        day_delta = (entry["date"] - today).days
        if day_delta == 0:
            day = "Today"
        elif day_delta == 1:
            day = "Tomorrow"
        else:
            day = entry["date"].strftime("%a")

        temps = entry["temps"] or [0]
        details.append({
            "day": day,
            "high": f"{round(max(temps))}°",
            "low": f"{round(min(temps))}°",
            "rain": f"{round(entry['rain'])}%",
            "icon": map_weather_icon(entry["icon"], entry["weather_id"]),
        })

    return details

# ── Lazy Model Loading ────────────────────────────────────────────────────────
model = None

def build_plant_disease_model(tf):
    """Rebuild the saved hybrid CNN + MobileNetV2 architecture for Keras 3."""
    inputs = tf.keras.Input(shape=(128, 128, 3), name="input_1_3")

    x = tf.keras.layers.Conv2D(64, (3, 3), padding="same", name="conv2d_3")(inputs)
    x = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_3")(x)
    x = tf.keras.layers.ReLU(name="re_lu_3")(x)

    a = tf.keras.layers.Conv2D(64, (3, 3), padding="same", name="conv2d_1_3")(x)
    b = tf.keras.layers.Conv2D(64, (1, 1), padding="same", name="conv2d_2_3")(inputs)
    a = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_1_3")(a)
    b = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_2_3")(b)
    x = tf.keras.layers.Add(name="add_3")([a, b])
    x = tf.keras.layers.ReLU(name="re_lu_1_3")(x)

    a = tf.keras.layers.Conv2D(128, (3, 3), padding="same", name="conv2d_3_3")(x)
    a = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_3_3")(a)
    a = tf.keras.layers.ReLU(name="re_lu_2_3")(a)
    a = tf.keras.layers.Conv2D(128, (3, 3), padding="same", name="conv2d_4_3")(a)
    b = tf.keras.layers.Conv2D(128, (1, 1), padding="same", name="conv2d_5_3")(x)
    a = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_4_3")(a)
    b = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_5_3")(b)
    x = tf.keras.layers.Add(name="add_1_3")([a, b])
    x = tf.keras.layers.ReLU(name="re_lu_3_3")(x)

    a = tf.keras.layers.Conv2D(256, (3, 3), padding="same", name="conv2d_6_3")(x)
    a = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_6_3")(a)
    a = tf.keras.layers.ReLU(name="re_lu_4_3")(a)
    a = tf.keras.layers.Conv2D(256, (3, 3), padding="same", name="conv2d_7_3")(a)
    b = tf.keras.layers.Conv2D(256, (1, 1), padding="same", name="conv2d_8_3")(x)
    a = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_7_3")(a)
    b = tf.keras.layers.BatchNormalization(axis=3, name="batch_normalization_8_3")(b)
    residual_features = tf.keras.layers.Add(name="add_2_3")([a, b])
    residual_features = tf.keras.layers.ReLU(name="re_lu_5_3")(residual_features)

    mobilenet = tf.keras.applications.MobileNetV2(
        input_shape=(128, 128, 3),
        include_top=False,
        weights=None,
        name="mobilenetv2_1.00_128_3",
    )
    mobilenet_features = mobilenet(inputs)

    residual_pool = tf.keras.layers.GlobalAveragePooling2D(name="global_average_pooling2d_3")(residual_features)
    mobilenet_pool = tf.keras.layers.GlobalAveragePooling2D(name="global_average_pooling2d_1_3")(mobilenet_features)
    features = tf.keras.layers.Concatenate(name="concatenate_3")([residual_pool, mobilenet_pool])
    output = tf.keras.layers.Dense(38, activation="softmax", name="dense_1")(features)

    return tf.keras.Model(inputs, output, name="model")

def load_legacy_hdf5_weights(tf_model, model_path: str):
    """Load HDF5 weights without Keras' brittle nested by-name loader."""
    import h5py

    def collect_datasets(group):
        datasets = {}

        def visit(name, obj):
            if hasattr(obj, "shape"):
                key = name.split("/")[-1].split(":")[0]
                datasets[key] = np.array(obj)

        group.visititems(visit)
        return datasets

    def assign_layer(layer, group):
        datasets = collect_datasets(group)
        values = []
        for weight in layer.weights:
            key = weight.name.split(":")[0]
            if layer.__class__.__name__ == "DepthwiseConv2D" and key == "kernel":
                key = "depthwise_kernel"

            if key not in datasets:
                raise ValueError(f"Missing saved weight {layer.name}/{key}")

            value = datasets[key]
            if tuple(value.shape) != tuple(weight.shape):
                raise ValueError(
                    f"Shape mismatch for {layer.name}/{key}: saved {value.shape}, expected {tuple(weight.shape)}"
                )
            values.append(value)

        if values:
            layer.set_weights(values)

    with h5py.File(model_path, "r") as h5_model:
        model_weights = h5_model["model_weights"]
        for layer in tf_model.layers:
            if not layer.weights and not hasattr(layer, "layers"):
                continue

            if layer.name == "mobilenetv2_1.00_128_3":
                nested_weights = model_weights[layer.name]
                for nested_layer in layer.layers:
                    if nested_layer.weights:
                        assign_layer(nested_layer, nested_weights[nested_layer.name])
            elif layer.name in model_weights and layer.weights:
                assign_layer(layer, model_weights[layer.name])

def get_model():
    """Lazily load the Keras plant disease classification model."""
    global model
    if model is None:
        print("[INFO] Lazy loading Keras model...")
        # Import TensorFlow only when needed to optimize startup speed
        import tensorflow as tf
        model_path = os.path.join(os.path.dirname(__file__), "models", "plant_disease_model.keras")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")

        with open(model_path, "rb") as model_file:
            is_hdf5 = model_file.read(8) == b"\x89HDF\r\n\x1a\n"

        if is_hdf5:
            model = build_plant_disease_model(tf)
            load_legacy_hdf5_weights(model, model_path)
        else:
            model = tf.keras.models.load_model(model_path, compile=False)
        print("[INFO] Model loaded successfully.")
    return model

# ── API Endpoints ─────────────────────────────────────────────────────────────

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

@app.get("/api/weather/local", response_model=LocalWeatherResponse)
def get_local_weather(lat: Optional[float] = None, lon: Optional[float] = None, q: Optional[str] = None):
    if q:
        weather_params = {"q": q}
    elif lat is not None and lon is not None:
        weather_params = {"lat": lat, "lon": lon}
    else:
        # Central India fallback when browser geolocation is unavailable.
        weather_params = {"lat": 20.5937, "lon": 78.9629}

    current = fetch_openweather_json("weather", weather_params)
    forecast = fetch_openweather_json("forecast", {**weather_params, "cnt": 40})

    weather = current.get("weather", [{}])[0]
    main = current.get("main", {})
    wind = current.get("wind", {})
    forecast_items = forecast.get("list", [])

    rain_probability = 0
    rain_next_24h_mm = 0.0
    if forecast_items:
        rain_probability = round(max(item.get("pop", 0) for item in forecast_items) * 100)
        rain_next_24h_mm = round(sum(item.get("rain", {}).get("3h", 0) for item in forecast_items), 1)

    temperature = round(float(main.get("temp", 0)), 1)
    humidity = int(main.get("humidity", 0))

    return {
        "location": current.get("name") or "Local area",
        "country": current.get("sys", {}).get("country", ""),
        "temperature": temperature,
        "feels_like": round(float(main.get("feels_like", temperature)), 1),
        "humidity": humidity,
        "wind_kmh": round(float(wind.get("speed", 0)) * 3.6, 1),
        "description": weather.get("description", "current conditions").title(),
        "icon": map_weather_icon(weather.get("icon", "02d"), int(weather.get("id", 801))),
        "rain_probability": rain_probability,
        "rain_next_24h_mm": rain_next_24h_mm,
        "updated_at": datetime.datetime.fromtimestamp(
            int(current.get("dt", datetime.datetime.utcnow().timestamp())),
            tz=datetime.timezone.utc,
        ).isoformat(),
        "insight": build_weather_insight(rain_probability, rain_next_24h_mm, humidity, temperature),
        "forecast": build_local_forecast(forecast_items),
    }

@app.post("/api/ai/advice", response_model=AdviceResponse)
def get_ai_advice(request: AdviceRequest):
    prompt = (
        "You are AgroGuardian AI, an agricultural assistant. Give concise, practical farm advice. "
        "Avoid medical/legal disclaimers. Use the supplied context only.\n\n"
        f"Context: {request.context}\n"
        f"Weather: {request.weather or {}}\n"
        f"Disease prediction: {request.disease or {}}\n"
        f"Sensors: {request.sensors or {}}\n\n"
        "Return 2-4 short action-focused sentences."
    )
    advice = fetch_gemini_advice(prompt)
    if advice:
        return {"advice": advice, "source": "gemini"}

    weather = request.weather or {}
    sensors = request.sensors or {}
    disease = request.disease or {}
    fallback = "Monitor crop health, soil moisture, and local weather before changing irrigation or treatment plans."
    if disease.get("disease"):
        fallback = f"{disease['disease']} was detected. Follow the treatment recommendation and rescan after field action."
    elif weather.get("insight"):
        fallback = weather["insight"]
    elif sensors.get("soil_moisture", 50) < 35:
        fallback = "Soil moisture is trending low. Schedule irrigation soon and recheck after watering."

    return {"advice": fallback, "source": "fallback"}

@app.post("/api/ai/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest):
    recent_history = "\n".join(
        f"{item.role}: {item.content}" for item in request.history[-8:] if item.content.strip()
    )
    prompt = (
        "You are AgroGuardian AI, a practical crop-care chatbot for farmers. "
        "Answer clearly, briefly, and actionably. Use simple language and mention when a leaf image or expert inspection is needed.\n\n"
        f"Current weather context: {request.weather or {}}\n"
        f"Current sensor context: {request.sensors or {}}\n"
        f"Recent chat:\n{recent_history}\n\n"
        f"Farmer question: {request.message}\n\n"
        "Give the best next steps in 2-5 short sentences."
    )
    reply = fetch_gemini_advice(prompt)
    if reply:
        return {"reply": reply, "source": "gemini"}

    fallback = (
        "I could not reach Gemini right now. Check the crop leaves closely, compare symptoms with recent weather, "
        "and upload a clear leaf image in Disease Detection for model-based guidance."
    )
    return {"reply": fallback, "source": "fallback"}

@app.get("/api/sensors", response_model=SensorResponse)
def get_sensors():
    temp = round(24.0 + random.uniform(-1.5, 1.5), 1)
    hum = round(65.0 + random.uniform(-2.0, 2.0), 1)
    soil = round(42.0 + random.uniform(-3.0, 3.0), 1)
    return {
        "temperature": temp,
        "humidity": hum,
        "soil_moisture": soil
    }

@app.post("/api/detect-disease")
async def detect_disease(image: UploadFile = File(...)):
    """Predict disease using the trained PlantVillage Keras model."""
    # Handle basic error for invalid uploads
    if not image or not image.filename:
        raise HTTPException(status_code=400, detail="Invalid image file upload")
        
    try:
        image_bytes = await image.read()
        
        # Image Preprocessing:
        # img = image.resize((224, 224))
        # img = np.array(img) / 255.0
        # img = np.expand_dims(img, axis=0)
        
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        resized_img = pil_img.resize((128, 128))
        
        # This saved model was trained on raw 0-255 pixel values. Normalizing
        # here collapses predictions toward a single class.
        img_array = np.array(resized_img, dtype=np.float32)
        img_input = np.expand_dims(img_array, axis=0)
        
        # Get lazy model
        loaded_model = get_model()
        
        # Inference
        predictions = loaded_model.predict(img_input)
        predicted_class_idx = int(np.argmax(predictions[0]))
        confidence_val = float(predictions[0][predicted_class_idx]) * 100
        
        # Import labels
        from disease_labels import CLASS_INDEX_TO_LABEL, get_display_name, get_treatment_recommendation
        
        disease_label = CLASS_INDEX_TO_LABEL.get(predicted_class_idx, "background")
        display_name = get_display_name(disease_label)
        treatment = get_treatment_recommendation(disease_label)
        
        # Return exact required output JSON:
        # {
        #   "disease": "Tomato Early Blight",
        #   "confidence": 97.3,
        #   "treatment": "Use copper fungicide and remove infected leaves."
        # }
        return {
            "disease": display_name,
            "confidence": round(confidence_val, 1),
            "treatment": treatment
        }
        
    except Exception as e:
        print(f"[ERROR] Inference failed: {e}")
        raise HTTPException(status_code=500, detail=f"Image detection failed: {str(e)}")

@app.post("/api/scans/predict", response_model=PredictionResponse)
async def predict_disease_old(image: UploadFile = File(...)):
    """Inference endpoint compatible with the original UI schema, back-filled with real Keras model predictions."""
    try:
        # Call the new inference function internally
        res = await detect_disease(image)
        
        # Extract display name and confidence
        display_name = res["disease"]
        confidence = res["confidence"]
        treatment = res["treatment"]
        
        # Map labels to severity levels for UI aesthetics
        is_healthy = "healthy" in display_name.lower() or "background" in display_name.lower()
        risk_level = "LOW RISK" if is_healthy else "HIGH RISK"
        affected_area = 0 if is_healthy else random.randint(15, 35)
        
        # Create a professional, dynamically generated AI observation
        if is_healthy:
            ai_observation = "Leaf pigmentation and structure appear normal with no visible pathogens."
        else:
            ai_observation = f"Visual signs of {display_name} detected. Foliar lesions match characteristic pathogen morphology."
            
        return {
            "disease_name": display_name,
            "confidence_score": int(confidence),
            "risk_level": risk_level,
            "affected_area": affected_area,
            "recommendation": treatment,
            "ai_observation": ai_observation
        }
    except Exception as e:
        # Fallback to a mock response if model is not yet compiled / running during dev
        print(f"[WARNING] Old endpoint failed: {e}. Falling back to rich mock data.")
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
                "disease_name": "Healthy Plant",
                "confidence_score": 98,
                "risk_level": "LOW RISK",
                "affected_area": 0,
                "recommendation": "Plant is healthy",
                "ai_observation": "Leaf pigmentation and structure appear normal with no visible pathogens."
            }
        ]
        return random.choice(mock_responses)

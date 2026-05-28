import './styles.css';

const API_BASE_URL = 'http://localhost:8000/api';

let latestSensors = null;
let latestWeather = null;
let selectedDiseaseFile = null;
let chatHistory = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json();
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function setBar(selector, value) {
  const element = $(selector);
  if (element) element.style.width = `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showView(viewName) {
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === viewName));
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === `view-${viewName}`));
}

function formatUpdatedAt(value) {
  if (!value) return 'Updated: --';
  return `Updated: ${new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`;
}

function formatForecastUpdatedAt(value) {
  if (!value) return 'Waiting for weather data';
  return `Updated ${new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`;
}

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  });
}

async function checkBackend() {
  try {
    await api('/health');
    $('#backend-dot').className = 'status-dot';
    setText('#backend-status', 'System status is optimal. Backend connected.');
  } catch {
    $('#backend-dot').className = 'status-dot error';
    setText('#backend-status', 'Backend unreachable. Start FastAPI on port 8000.');
  }
}

async function loadSensors() {
  try {
    latestSensors = await api('/sensors');
    setText('#sensor-temp', `${latestSensors.temperature}°C`);
    setText('#sensor-humidity', `${latestSensors.humidity}%`);
    setText('#sensor-soil', `${latestSensors.soil_moisture}%`);
    setBar('#humidity-bar', latestSensors.humidity);
    setBar('#soil-bar', latestSensors.soil_moisture);
    renderInsights();
    loadAdvice();
  } catch {
    setText('#sensor-temp', '--');
    setText('#sensor-humidity', '--');
    setText('#sensor-soil', '--');
  }
}

async function loadLocalWeather(options = {}) {
  setText('#weather-location', options.query ? 'Searching...' : 'Locating...');
  let query = '';

  if (options.query) {
    query = `?q=${encodeURIComponent(options.query)}`;
  } else {
    const coords = options.coords || await getLocation();
    query = coords ? `?lat=${encodeURIComponent(coords.lat)}&lon=${encodeURIComponent(coords.lon)}` : '';
  }

  try {
    latestWeather = await api(`/weather/local${query}`);
    setText('#weather-location', `${latestWeather.location}${latestWeather.country ? `, ${latestWeather.country}` : ''}`);
    setText('#weather-temp', `${latestWeather.temperature}°C`);
    setText('#weather-desc', latestWeather.description);
    setText('#weather-updated', formatUpdatedAt(latestWeather.updated_at));
    setText('#weather-humidity', `${latestWeather.humidity}%`);
    setText('#weather-wind', `${latestWeather.wind_kmh} km/h`);
    setText('#weather-rain', `${latestWeather.rain_probability}%`);
    setText('#weather-insight', latestWeather.insight);
    setText('#irrigation-advisor', latestWeather.insight);
    setBar('#rain-bar', latestWeather.rain_probability);
    $('#weather-icon').textContent = latestWeather.icon;
    renderWeatherAnalysis();
    renderInsights();
    loadAdvice();
  } catch (error) {
    setText('#weather-location', 'Weather unavailable');
    setText('#weather-desc', 'Add OPENWEATHER_API_KEY in backend/.env');
    setText('#weather-insight', 'Weather API is not configured or unavailable.');
    renderWeatherAnalysis();
  }
}

async function useDeviceLocation() {
  setText('#weather-location', 'Locating...');
  const coords = await getLocation();
  if (!coords) {
    setText('#weather-location', 'Location permission unavailable');
    setText('#weather-desc', 'Enter a city or village manually.');
    return;
  }
  await loadLocalWeather({ coords });
}

function renderInsights() {
  const list = $('#insights-list');
  if (!list) return;

  const humidity = latestWeather?.humidity ?? latestSensors?.humidity ?? 0;
  const temperature = latestWeather?.temperature ?? latestSensors?.temperature ?? 0;
  const soil = latestSensors?.soil_moisture ?? 0;
  const rain = latestWeather?.rain_probability ?? 0;

  const items = [];
  items.push({
    title: humidity > 80 && temperature > 24 ? 'Disease Risk Elevated' : 'Disease Risk Stable',
    text: humidity > 80 && temperature > 24
      ? 'Warm humidity may increase fungal pressure. Inspect susceptible crops.'
      : 'Current atmospheric conditions are not showing high fungal pressure.',
  });
  items.push({
    title: soil < 35 ? 'Irrigation Needed Soon' : 'Moisture Holding',
    text: soil < 35
      ? 'Soil moisture is below the comfort band. Plan irrigation soon.'
      : 'Soil moisture is currently within a manageable range.',
  });
  items.push({
    title: rain > 60 ? 'Rain May Offset Watering' : 'Rain Impact Low',
    text: rain > 60
      ? 'Rain probability is high. Delay non-critical irrigation.'
      : 'Near-term rain probability is low to moderate.',
  });

  list.innerHTML = items.map((item) => `
    <div class="insight-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

async function loadAdvice() {
  try {
    const data = await api('/ai/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: 'Overview recommendation',
        weather: latestWeather,
        sensors: latestSensors,
      }),
    });
    setText('#gemini-advice', data.advice);
    setText('#ai-source', data.source);
  } catch {
    setText('#gemini-advice', latestWeather?.insight || 'Configure Gemini API key to generate richer recommendations.');
    setText('#ai-source', 'local');
  }
}

async function loadSoil() {
  try {
    const metrics = await api('/soil/metrics');
    $('#soil-metrics').innerHTML = Object.entries(metrics).map(([key, item]) => `
      <article class="metric-card">
        <span class="metric-label">${key.replace('_', ' ')}</span>
        <strong>${item.value}</strong>
        <small>${item.status}</small>
      </article>
    `).join('');

    const insights = await api('/soil/insights');
    $('#soil-insights').innerHTML = insights.map((item) => `
      <div class="insight-item">
        <strong>${item.title}</strong>
        <p>${item.desc}</p>
      </div>
    `).join('');
  } catch {
    $('#soil-metrics').innerHTML = '<article class="metric-card">Soil data unavailable.</article>';
  }
}

function renderWeatherAnalysis(fallbackForecast = []) {
  const weather = latestWeather || {};
  const forecast = weather.forecast?.length ? weather.forecast : fallbackForecast;
  const temp = Math.round(Number(weather.temperature) || 0);
  const humidity = Math.round(Number(weather.humidity) || 0);
  const wind = Number(weather.wind_kmh) || 0;
  const rain = Math.round(Number(weather.rain_probability) || 0);
  const soil = Math.round(Number(latestSensors?.soil_moisture) || 42);
  const diseaseRisk = Math.max(8, Math.min(95, Math.round((humidity * 0.52) + (rain * 0.3) + Math.max(0, temp - 24) * 2.1)));
  const mildewRisk = Math.max(5, Math.min(95, Math.round(diseaseRisk * 0.78 + rain * 0.22)));
  const blightRisk = Math.max(4, Math.min(88, Math.round(diseaseRisk * 0.48 + humidity * 0.12)));
  const highRisk = diseaseRisk >= 70;
  const moderateRisk = diseaseRisk >= 40;
  const shouldSkip = rain >= 60 || weather.rain_next_24h_mm >= 5 || soil >= 60;

  setText('#forecast-location-label', `${weather.location || 'Local area'}${weather.country ? `, ${weather.country}` : ''}`);
  setText('#forecast-updated-label', formatForecastUpdatedAt(weather.updated_at));
  setText('#forecast-current-temp', temp ? `${temp}°` : '--');
  setText('#forecast-current-humidity', humidity ? `${humidity}%` : '--%');
  setText('#forecast-current-wind', `${wind ? wind.toFixed(1) : '--'} km/h`);
  setText('#forecast-risk-score', diseaseRisk || '--');
  setText('#forecast-risk-label', highRisk ? 'High Risk' : moderateRisk ? 'Moderate Risk' : 'Low Risk');
  setText('#forecast-risk-copy', highRisk ? 'Elevated humidity, rain, and heat.' : moderateRisk ? 'Watch humidity and scout sensitive crops.' : 'Conditions are currently manageable.');
  setText('#forecast-mildew-risk', `${mildewRisk}%`);
  setText('#forecast-blight-risk', `${blightRisk}%`);
  setText(
    '#irrigation-advisor',
    shouldSkip
      ? `Recommendation: Skip Cycle 4. ${rain}% rain probability and ${soil}% soil moisture may increase waterlogging and fungal risk.`
      : `Recommendation: Continue planned irrigation. ${weather.insight || 'Local conditions are stable, but keep checking soil moisture.'}`,
  );

  const currentIcon = $('#forecast-current-icon');
  if (currentIcon) currentIcon.textContent = weather.icon || 'partly_cloudy_day';
  const riskGauge = $('#forecast-risk-gauge');
  if (riskGauge) riskGauge.style.setProperty('--risk-value', `${diseaseRisk}%`);

  const strip = $('#forecast-strip');
  if (!strip) return;
  strip.innerHTML = forecast.length ? forecast.map((item) => `
    <div class="projection-day">
      <strong>${escapeHtml(item.day)}</strong>
      <span class="material-symbols-outlined">${escapeHtml(item.icon)}</span>
      <div><b>${escapeHtml(item.high)}</b><small>${escapeHtml(item.low)}</small></div>
      <p><span class="material-symbols-outlined">water_drop</span>${escapeHtml(item.rain)}</p>
    </div>
  `).join('') : '<div class="projection-day">Forecast unavailable</div>';
}

async function loadForecast() {
  try {
    const data = await api('/weather');
    renderWeatherAnalysis(data.forecast || []);
  } catch {
    renderWeatherAnalysis();
  }
}

function setupDiseaseDetection() {
  $('#upload-trigger').addEventListener('click', () => $('#disease-file').click());
  $('#disease-file').addEventListener('change', (event) => {
    selectedDiseaseFile = event.target.files?.[0] || null;
    $('#analyze-button').disabled = !selectedDiseaseFile;
    if (selectedDiseaseFile) {
      $('#preview-image').src = URL.createObjectURL(selectedDiseaseFile);
      $('#preview-image').classList.remove('hidden');
    }
  });

  $('#analyze-button').addEventListener('click', async () => {
    if (!selectedDiseaseFile) return;
    const formData = new FormData();
    formData.append('image', selectedDiseaseFile);
    $('#disease-result').innerHTML = '<p>Analyzing image...</p>';
    try {
      const data = await api('/detect-disease', { method: 'POST', body: formData });
      $('#disease-result').innerHTML = `
        <span class="risk-badge">${data.confidence}% confidence</span>
        <h2 class="result-title">${data.disease}</h2>
        <p>${data.treatment}</p>
      `;
      const advice = await api('/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: 'Disease detection result', disease: data, weather: latestWeather }),
      });
      $('#disease-result').innerHTML += `<div class="advice-box green"><span class="material-symbols-outlined">auto_awesome</span><p>${advice.advice}</p></div>`;
    } catch (error) {
      $('#disease-result').innerHTML = '<p>Image analysis failed. Check backend model and try again.</p>';
    }
  });
}

function addChatMessage(role, content) {
  chatHistory.push({ role, content });
  const messages = $('#chat-messages');
  const label = role === 'user' ? 'You' : 'AgroGuardian AI';
  messages.insertAdjacentHTML('beforeend', `
    <div class="chat-message ${role === 'user' ? 'user' : 'bot'}">
      <strong>${label}</strong>
      <p>${escapeHtml(content)}</p>
    </div>
  `);
  messages.scrollTop = messages.scrollHeight;
}

function setupChatbot() {
  $('#chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#chat-input');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    addChatMessage('user', message);
    const loadingId = `chat-loading-${Date.now()}`;
    $('#chat-messages').insertAdjacentHTML('beforeend', `
      <div class="chat-message bot" id="${loadingId}">
        <strong>AgroGuardian AI</strong>
        <p>Thinking...</p>
      </div>
    `);

    try {
      const data = await api('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: chatHistory.slice(-8),
          weather: latestWeather,
          sensors: latestSensors,
        }),
      });
      $(`#${loadingId}`)?.remove();
      addChatMessage('bot', data.reply);
    } catch {
      $(`#${loadingId}`)?.remove();
      addChatMessage('bot', 'I could not reach the AI service right now. Check the backend and Gemini API key.');
    }
  });
}

function setupSimulator() {
  const irrigationInput = $('#sim-irrigation');
  const moistureInput = $('#sim-moisture');
  const temperatureInput = $('#sim-temperature');
  const ringProgress = $('#sim-ring-progress');
  const chatButton = $('#sim-chat-fab');
  const circumference = 2 * Math.PI * 90;

  if (!irrigationInput || !moistureInput || !temperatureInput) return;

  const render = () => {
    const irrigation = Number(irrigationInput.value);
    const moisture = Number(moistureInput.value);
    const temperature = Number(temperatureInput.value);
    const idealIrrigation = 44;
    const idealMoisture = 58;
    const idealTemperature = 24;
    const irrigationBalance = 100 - Math.abs(irrigation - idealIrrigation) * 0.9;
    const moistureBalance = 100 - Math.abs(moisture - idealMoisture) * 0.85;
    const temperatureBalance = 100 - Math.abs(temperature - idealTemperature) * 2.3;
    const stability = Math.max(12, Math.min(96, Math.round(
      irrigationBalance * 0.28 + moistureBalance * 0.42 + temperatureBalance * 0.3,
    )));
    const waterEfficiency = Math.max(8, Math.min(98, Math.round(
      100 - Math.abs(irrigation - moisture) * 0.55 - Math.max(0, temperature - 30) * 1.1,
    )));
    const diseaseRisk = Math.max(4, Math.min(96, Math.round(
      moisture * 0.34 + Math.max(0, temperature - 22) * 1.85 + Math.max(0, irrigation - 65) * 0.42,
    )));
    const sustainability = Math.max(8, Math.min(99, Math.round(
      waterEfficiency * 0.48 + stability * 0.34 + (100 - diseaseRisk) * 0.18,
    )));

    setText('#sim-irrigation-value', `${irrigation}%`);
    setText('#sim-moisture-value', `${moisture}%`);
    setText('#sim-temperature-value', `${temperature} C`);
    setText('#sim-stability-score', `${stability}%`);
    setText('#sim-sustainability-score', sustainability);
    setText('#sim-water-score', `${waterEfficiency}%`);
    setText('#sim-disease-risk', `${diseaseRisk}%`);
    setText(
      '#sim-water-copy',
      waterEfficiency > 74
        ? 'Current water plan avoids over/under-watering.'
        : waterEfficiency > 48
          ? 'Water plan is usable, but irrigation and moisture are drifting apart.'
          : 'Water plan is inefficient. Rebalance irrigation before applying more water.',
    );
    setText(
      '#sim-risk-copy',
      diseaseRisk > 62
        ? 'Risk is elevated from warm and wet conditions.'
        : diseaseRisk > 34
          ? 'Moderate risk. Keep scouting leaves after irrigation.'
          : 'Low disease pressure in this simulated setup.',
    );
    setText(
      '#sim-sustainability-copy',
      sustainability > 76
        ? 'Strong water usage efficiency with low projected crop stress.'
        : 'Based on water usage efficiency and projected disease prevention.',
    );

    ringProgress.style.strokeDasharray = `${circumference}`;
    ringProgress.style.strokeDashoffset = `${circumference * (1 - stability / 100)}`;
    setBar('#sim-sustainability-bar', sustainability);
    setBar('#sim-water-bar', waterEfficiency);
    setBar('#sim-risk-bar', diseaseRisk);
  };

  [irrigationInput, moistureInput, temperatureInput].forEach((input) => {
    input.addEventListener('input', render);
  });
  chatButton?.addEventListener('click', () => showView('chatbot'));
  render();
}

function setupNavigation() {
  $$('.nav-item').forEach((button) => {
    button.addEventListener('click', () => showView(button.dataset.view));
  });
}

function init() {
  setupNavigation();
  setupDiseaseDetection();
  setupChatbot();
  setupSimulator();
  $('#refresh-weather').addEventListener('click', loadLocalWeather);
  $('#weather-chat-fab')?.addEventListener('click', () => showView('chatbot'));
  $('#use-device-location').addEventListener('click', useDeviceLocation);
  $('#location-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = $('#location-input').value.trim();
    if (query) loadLocalWeather({ query });
  });

  checkBackend();
  loadSensors();
  loadLocalWeather();
  loadSoil();
  loadForecast();
  setInterval(loadSensors, 5000);
}

init();

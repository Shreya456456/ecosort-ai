/* =============================================
   EcoSort AI — Main Application Logic
   ============================================= */

'use strict';

// ─── Waste Categories Config ─────────────────────────────────────────────────
const CATEGORIES = {
  recyclable: {
    name: 'Recyclable',
    color: '#22d3ee',
    emoji: '♻️',
    bin: 'Blue Bin',
    bgColor: 'rgba(34,211,238,0.12)',
    examples: ['Paper', 'Plastic bottles', 'Glass', 'Metal cans', 'Cardboard'],
    description: 'Items that can be processed and reused as raw materials to make new products, reducing energy consumption and landfill waste.',
    disposalSteps: [
      'Rinse and clean the item to remove food residue',
      'Flatten cardboard boxes and remove plastic tape',
      'Separate materials if the item is mixed (e.g., remove plastic lids from glass jars)',
      'Place in the designated recycling (blue) bin',
      'Do not bag recyclables — keep them loose in the bin'
    ]
  },
  organic: {
    name: 'Organic / Compost',
    color: '#84cc16',
    emoji: '🌿',
    bin: 'Green Bin',
    bgColor: 'rgba(132,204,22,0.12)',
    examples: ['Food scraps', 'Vegetable peels', 'Fruit', 'Coffee grounds', 'Eggshells'],
    description: 'Biodegradable materials that can be composted to create nutrient-rich soil amendment, diverting waste from landfills.',
    disposalSteps: [
      'Separate food scraps from packaging before disposing',
      'Include vegetable peels, fruit scraps, and coffee grounds',
      'Avoid meat, dairy, and oily foods in home compost',
      'Place in the green organic/compost bin or home compost pile',
      'Consider vermicomposting (worm farm) for kitchen scraps'
    ]
  },
  hazardous: {
    name: 'Hazardous',
    color: '#f97316',
    emoji: '⚠️',
    bin: 'Special Collection',
    bgColor: 'rgba(249,115,22,0.12)',
    examples: ['Batteries', 'Paint', 'Pesticides', 'Cleaning chemicals', 'Motor oil'],
    description: 'Materials that pose a threat to human health or the environment if not properly disposed. Requires special handling and collection.',
    disposalSteps: [
      'Never pour hazardous materials down the drain or in regular bins',
      'Store in original container with label intact',
      'Locate your nearest hazardous waste collection facility',
      'Transport safely — keep upright and sealed during transport',
      'Check for local collection events or drop-off programs'
    ]
  },
  general: {
    name: 'General Waste',
    color: '#94a3b8',
    emoji: '🗑️',
    bin: 'Black / General Bin',
    bgColor: 'rgba(148,163,184,0.10)',
    examples: ['Styrofoam', 'Dirty diapers', 'Broken ceramics', 'Chip packets', 'Rubber gloves'],
    description: 'Non-recyclable and non-hazardous waste that cannot be composted or recycled and must go to general landfill.',
    disposalSteps: [
      'Ensure the item is truly non-recyclable before disposal',
      'Bag securely to prevent litter',
      'Place in the general waste (black/grey) bin',
      'Try to reduce general waste by choosing reusable alternatives',
      'Check if any parts of the item can be salvaged for recycling'
    ]
  },
  ewaste: {
    name: 'E-Waste',
    color: '#a855f7',
    emoji: '💻',
    bin: 'E-Waste Collection',
    bgColor: 'rgba(168,85,247,0.12)',
    examples: ['Old phones', 'Laptops', 'Chargers', 'TVs', 'Batteries', 'Printers'],
    description: 'Electronic waste containing valuable and hazardous materials. Requires specialized recycling to recover precious metals safely.',
    disposalSteps: [
      'Wipe personal data from devices before disposal',
      'Do not place in regular bins — this is illegal in many regions',
      'Find an e-waste recycling center or retailer take-back program',
      'Consider donating working devices to charities or schools',
      'Check manufacturer recycling programs for specific brands'
    ]
  },
  medical: {
    name: 'Medical / Sanitary',
    color: '#ec4899',
    emoji: '🏥',
    bin: 'Medical Waste',
    bgColor: 'rgba(236,72,153,0.12)',
    examples: ['Syringes', 'Medicines', 'Bandages', 'Expired drugs', 'PPE'],
    description: 'Biomedical and pharmaceutical waste that requires specialized disposal to prevent contamination, infection spread, and environmental harm.',
    disposalSteps: [
      'Never flush medicines down the toilet or throw in regular bins',
      'Place sharps in approved sharps containers only',
      'Return unused medicines to a pharmacy for safe disposal',
      'Seal soiled bandages in a plastic bag before disposal',
      'Contact your local health department for medical waste guidelines'
    ]
  }
};

// ─── App State ────────────────────────────────────────────────────────────────
let GROQ_API_KEYS = [];
let groqApiKeyIndex = 0;
let groqApiKey = '';

function rotateGroqKey() {
  if (GROQ_API_KEYS.length === 0) return '';
  groqApiKeyIndex = (groqApiKeyIndex + 1) % GROQ_API_KEYS.length;
  groqApiKey = GROQ_API_KEYS[groqApiKeyIndex];
  console.log(`🔄 Switched to Groq API key #${groqApiKeyIndex + 1}`);
  return groqApiKey;
}

const GROQ_MODELS = [
  'qwen/qwen3.6-27b',
  'llama-3.2-11b-vision-preview',
  'llama-3.2-90b-vision-preview'
];
let currentImageBase64 = '';
let currentImageDataUrl = '';
let scanHistory = JSON.parse(localStorage.getItem('ecosort_history') || '[]');
let cameraStream = null;
let currentCameraFacing = 'environment';

// ─── DOM Refs ─────────────────────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initApiKey();
  initUploadZone();
  initCamera();
  buildGuide();
  renderHistory();
});

// ─── Navigation ───────────────────────────────────────────────────────────────
function initNav() {
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href').replace('#', '');
      navigateTo(target);
    });
  });
}

function navigateTo(sectionId) {
  $$('.section').forEach(s => s.classList.remove('active'));
  $$('.nav-link').forEach(l => l.classList.remove('active'));
  const section = $(sectionId);
  if (section) section.classList.add('active');
  const navLink = $(`nav-${sectionId}`);
  if (navLink) navLink.classList.add('active');
  if (sectionId === 'history') renderHistory();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── API Key Management ───────────────────────────────────────────────────────
async function initApiKey() {
  const apiSetup = $('apiSetup');
  const uploadContainer = $('uploadContainer');

  // Set up save API key button listener
  const saveBtn = $('saveApiKey');
  const keyInput = $('apiKeyInput');
  if (saveBtn && keyInput) {
    saveBtn.addEventListener('click', () => {
      const key = keyInput.value.trim();
      if (!key) {
        showToast('Please enter a valid API key', 'error');
        return;
      }
      localStorage.setItem('ecosort_groq_key', key);
      GROQ_API_KEYS = [key];
      groqApiKey = key;
      apiSetup.classList.add('hidden');
      uploadContainer.style.display = '';
      updateApiStatus(true);
      showToast('API key activated successfully!', 'success');
    });
  }

  try {
    // Attempt to load keys dynamically from keys.json (which is gitignored)
    const res = await fetch('/keys.json');
    if (res.ok) {
      const data = await res.json();
      if (data.GROQ_API_KEYS && data.GROQ_API_KEYS.length > 0) {
        GROQ_API_KEYS = data.GROQ_API_KEYS;
        groqApiKey = GROQ_API_KEYS[0];
        console.log('✅ Loaded Groq keys dynamically from keys.json');
        apiSetup.classList.add('hidden');
        uploadContainer.style.display = '';
        updateApiStatus(true);
        return;
      }
    }
  } catch (err) {
    console.log('Could not load keys.json dynamically, checking localStorage...');
  }

  // Fallback to localStorage or show manual setup card
  const savedKey = localStorage.getItem('ecosort_groq_key');
  if (savedKey) {
    GROQ_API_KEYS = [savedKey];
    groqApiKey = savedKey;
    apiSetup.classList.add('hidden');
    uploadContainer.style.display = '';
    updateApiStatus(true);
  } else {
    apiSetup.classList.remove('hidden');
    uploadContainer.style.display = 'none';
    updateApiStatus(false);
  }
}

function updateApiStatus(active) {
  const dot = document.querySelector('.status-dot');
  const text = $('statusText');
  if (active) {
    dot.classList.add('active');
    text.textContent = 'AI Active';
  } else {
    dot.classList.remove('active');
    text.textContent = 'Not Connected';
  }
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function initUploadZone() {
  const zone = $('uploadZone');
  const fileInput = $('fileInput');
  const analyzeBtn = $('analyzeBtn');
  const removeBtn = $('removeImage');
  const scanAgainBtn = $('scanAgainBtn');

  // Click to upload
  zone.addEventListener('click', e => {
    if (e.target.closest('.btn')) return;
    fileInput.click();
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  });

  // Drag and drop
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file);
  });

  analyzeBtn.addEventListener('click', analyzeWaste);
  removeBtn.addEventListener('click', resetScan);
  scanAgainBtn.addEventListener('click', resetScan);
}

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const resizedDataUrl = await resizeImage(e.target.result, 640);
      currentImageDataUrl = resizedDataUrl;
      currentImageBase64 = resizedDataUrl.split(',')[1];
      showPreview(resizedDataUrl);
    } catch (err) {
      console.error('Error resizing image:', err);
      currentImageDataUrl = e.target.result;
      currentImageBase64 = e.target.result.split(',')[1];
      showPreview(e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

function showPreview(dataUrl) {
  $('uploadZone').style.display = 'none';
  const preview = $('previewContainer');
  preview.style.display = 'block';
  $('previewImage').src = dataUrl;
  $('resultSection').style.display = 'none';
  $('analyzingState').style.display = 'none';
}

function resetScan() {
  $('uploadZone').style.display = '';
  $('previewContainer').style.display = 'none';
  $('resultSection').style.display = 'none';
  $('analyzingState').style.display = 'none';
  $('cameraView').style.display = 'none';
  $('fileInput').value = '';
  currentImageBase64 = '';
  currentImageDataUrl = '';
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
}

// ─── Camera ───────────────────────────────────────────────────────────────────
function initCamera() {
  $('cameraBtn').addEventListener('click', startCamera);
  $('cancelCamera').addEventListener('click', stopCamera);
  $('captureBtn').addEventListener('click', capturePhoto);
  $('flipCamera').addEventListener('click', flipCamera);
}

async function startCamera() {
  try {
    $('uploadZone').style.display = 'none';
    $('cameraView').style.display = 'block';
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentCameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    $('videoFeed').srcObject = cameraStream;
  } catch (err) {
    $('uploadZone').style.display = '';
    $('cameraView').style.display = 'none';
    showToast('Camera access denied or unavailable', 'error');
  }
}

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  $('cameraView').style.display = 'none';
  $('uploadZone').style.display = '';
}

async function capturePhoto() {
  const video = $('videoFeed');
  if (!video.videoWidth || !video.videoHeight) {
    showToast('Camera feed not ready yet. Please wait a second and try again.', 'info');
    return;
  }
  const canvas = $('captureCanvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
  
  stopCamera();
  
  try {
    const resizedDataUrl = await resizeImage(dataUrl, 640);
    currentImageDataUrl = resizedDataUrl;
    currentImageBase64 = resizedDataUrl.split(',')[1];
    showPreview(resizedDataUrl);
  } catch (err) {
    console.error('Error resizing camera capture:', err);
    currentImageDataUrl = dataUrl;
    currentImageBase64 = dataUrl.split(',')[1];
    showPreview(dataUrl);
  }
  
  // Immediately trigger AI analysis for a faster scan flow
  analyzeWaste();
}

async function flipCamera() {
  currentCameraFacing = currentCameraFacing === 'environment' ? 'user' : 'environment';
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); }
  await startCamera();
}

// ─── AI Analysis ──────────────────────────────────────────────────────────────
async function analyzeWaste() {
  const modelType = $('modelSelect')?.value || 'groq';

  if (modelType === 'groq' && !groqApiKey) { showToast('No API key configured', 'error'); return; }
  if (!currentImageBase64) { showToast('Please select an image first', 'error'); return; }
  console.log(`🔍 Starting analysis with engine: ${modelType}`);

  // Hide preview, show analyzing
  $('previewContainer').style.display = 'none';
  $('analyzingState').style.display = 'block';
  animateSteps();

  try {
    let result;

    if (modelType === 'neubin') {
      console.log('Sending request to local NEU-Bin server...');
      const response = await fetch('http://localhost:5050/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: currentImageDataUrl })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Local server error: ${response.status}`);
      }
      result = await response.json();
      console.log('✅ NEU-Bin result:', result);

    } else {
      // Groq Cloud AI logic
      const prompt = `You are an expert waste segregation AI agent. Analyze this image of household waste and provide a detailed classification.

Return ONLY a valid JSON object with exactly this structure:
{
  "item": "specific name of the waste item (e.g., 'Plastic Water Bottle', 'Banana Peel')",
  "category": "one of: recyclable, organic, hazardous, general, ewaste, medical",
  "confidence": "percentage as integer (60-99)",
  "material": "primary material (e.g., PET Plastic, Organic Matter, Lithium-Ion)",
  "subcategory": "more specific type (e.g., PET Bottle, Food Scrap)",
  "why": "1-2 sentence explanation of why this category was chosen",
  "urgency": "one of: normal, careful, immediate (for hazardous/medical items)",
  "recyclable_parts": "any parts of the item that can be separated and recycled (or 'None')",
  "eco_impact": "brief statement about the environmental impact of proper disposal",
  "tips": [
    {"icon": "emoji", "title": "short tip title", "desc": "brief tip description"},
    {"icon": "emoji", "title": "short tip title", "desc": "brief tip description"},
    {"icon": "emoji", "title": "short tip title", "desc": "brief tip description"}
  ],
  "disposal_steps": [
    "step 1 detail specific to the analyzed item (e.g., 'Rinse the bottle thoroughly')",
    "step 2 detail specific to the analyzed item (e.g., 'Compress or flatten the bottle to save space')",
    "step 3 detail specific to the analyzed item (e.g., 'Place it in the blue recycling bin')"
  ]
}

Categories:
- recyclable: paper, cardboard, glass bottles, metal cans, most plastics (PET, HDPE)
- organic: food waste, garden waste, biodegradable materials
- hazardous: batteries, paint, chemicals, pesticides, aerosols
- general: styrofoam, contaminated packaging, rubber, non-recyclable plastics
- ewaste: electronics, cables, phones, computers, appliances
- medical: medicines, syringes, bandages, PPE, sanitary products

Be specific and accurate. If unclear, pick the most likely category.`;

      const makeGroqRequest = async (key, model) => {
        return await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: model,
            temperature: 0.2,
            max_tokens: 2048,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: currentImageDataUrl }
                },
                { type: 'text', text: prompt }
              ]
            }]
          })
        });
      };

      // Try models and keys combinations to overcome rate/quota/TPD limits
      let response;
      let success = false;
      let lastErrorMsg = '';

      for (const model of GROQ_MODELS) {
        console.log(`Trying model: ${model}`);
        const totalKeys = GROQ_API_KEYS.length;
        let modelSuccess = false;
        
        for (let attempt = 0; attempt < totalKeys; attempt++) {
          try {
            response = await makeGroqRequest(groqApiKey, model);
            
            if (response.ok) {
              success = true;
              modelSuccess = true;
              break;
            }
            
            const errData = await response.json().catch(() => ({}));
            lastErrorMsg = errData.error?.message || `HTTP ${response.status}`;
            console.warn(`⚠️ Model ${model} on Key #${groqApiKeyIndex + 1} failed: ${lastErrorMsg}`);
            
            // If we have remaining keys, switch keys
            if (attempt < totalKeys - 1) {
              showToast(`Switching key due to rate limit/quota...`, 'info');
              rotateGroqKey();
            }
          } catch (fetchErr) {
            lastErrorMsg = fetchErr.message;
            console.error('Fetch error:', fetchErr);
            if (attempt < totalKeys - 1) {
              rotateGroqKey();
            }
          }
        }
        if (modelSuccess) break;
      }

      if (!success) {
        throw new Error(lastErrorMsg || 'All models and API keys exhausted.');
      }

      const data = await response.json();
      console.log('✅ Raw Groq response:', data);
      let rawText = data.choices?.[0]?.message?.content;
      if (!rawText) throw new Error('No response from AI');

      // Strip <think>...</think> reasoning blocks (Qwen model outputs these)
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      console.log('📝 Cleaned text:', rawText);

      try {
        result = JSON.parse(rawText);
      } catch {
        const match = rawText.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Could not parse AI response: ' + rawText.substring(0, 200));
        result = JSON.parse(match[0]);
      }
      console.log('🎯 Parsed result:', result);
    }

    // Normalize category
    result.category = result.category?.toLowerCase().replace(/[^a-z]/g, '') || 'general';
    if (!CATEGORIES[result.category]) result.category = 'general';

    // Normalize confidence percentage to display accuracy correctly
    if (result.confidence !== undefined) {
      const parsedConf = parseInt(String(result.confidence).replace(/[^0-9]/g, ''), 10);
      result.confidence = (!isNaN(parsedConf) && parsedConf >= 10 && parsedConf <= 100) ? parsedConf : 85;
    } else {
      result.confidence = 85;
    }

    showResult(result);
    addToHistory(result);

  } catch (err) {
    console.error('💥 Analysis error:', err);
    $('analyzingState').style.display = 'none';
    $('previewContainer').style.display = 'block';

    let msg = 'Analysis failed. ';
    if (err.message.includes('API_KEY_INVALID') || err.message.includes('400')) {
      msg += 'Invalid API key.';
    } else if (err.message.includes('quota') || err.message.includes('429')) {
      msg += 'Rate limit exceeded. Please try again.';
    } else {
      msg += err.message;
    }
    showToast(msg, 'error');
  }
}

function animateSteps() {
  const steps = ['step1', 'step2', 'step3'];
  const msgs = ['Identifying waste type...', 'Classifying category...', 'Generating guidance...'];
  let i = 0;
  const interval = setInterval(() => {
    if (i > 0) {
      $(steps[i-1]).classList.remove('active');
      $(steps[i-1]).classList.add('done');
    }
    if (i < steps.length) {
      $(steps[i]).classList.add('active');
      $('analyzingStep').textContent = msgs[i];
    }
    i++;
    if (i >= steps.length + 1) clearInterval(interval);
  }, 900);
}

// ─── Result Display ───────────────────────────────────────────────────────────
function showResult(result) {
  $('analyzingState').style.display = 'none';

  const cat = CATEGORIES[result.category];
  if (!cat) return;

  // Build result card
  const disposalSteps = result.disposal_steps && Array.isArray(result.disposal_steps) && result.disposal_steps.length > 0
    ? result.disposal_steps
    : cat.disposalSteps;

  const steps = disposalSteps.map((step, i) =>
    `<li><span class="step-num" style="background:${cat.color}">${i+1}</span>${escapeHtml(step)}</li>`
  ).join('');

  const urgencyBadge = result.urgency === 'immediate' ? '🚨 Handle immediately' :
                       result.urgency === 'careful' ? '⚠️ Handle with care' : '';

  $('resultCard').style.setProperty('--cat-color', cat.color);
  $('resultCard').innerHTML = `
    <div class="result-category-badge" style="background:${cat.bgColor};color:${cat.color}">
      <span>${cat.emoji}</span>
      <span>${cat.name}</span>
      ${urgencyBadge ? `<span style="margin-left:0.5rem;font-size:0.8rem">${urgencyBadge}</span>` : ''}
    </div>
    <div class="result-item-name">${escapeHtml(result.item || 'Waste Item')}</div>
    <div class="result-confidence">
      AI Confidence: <strong>${result.confidence || '?'}%</strong> &nbsp;·&nbsp;
      Bin: <strong style="color:${cat.color}">${cat.bin}</strong>
    </div>
    <div class="result-grid">
      <div class="result-info-box">
        <div class="result-info-label">Material</div>
        <div class="result-info-value">${escapeHtml(result.material || 'Mixed')}</div>
      </div>
      <div class="result-info-box">
        <div class="result-info-label">Sub-type</div>
        <div class="result-info-value">${escapeHtml(result.subcategory || cat.name)}</div>
      </div>
      <div class="result-info-box">
        <div class="result-info-label">Recyclable Parts</div>
        <div class="result-info-value">${escapeHtml(result.recyclable_parts || 'None')}</div>
      </div>
      <div class="result-info-box">
        <div class="result-info-label">Eco Impact</div>
        <div class="result-info-value" style="font-size:0.85rem;font-weight:400;color:var(--text-muted)">${escapeHtml(result.eco_impact || '')}</div>
      </div>
    </div>
    <p class="result-description">${escapeHtml(result.why || cat.description)}</p>
    <div class="result-steps">
      <h4>📋 Disposal Steps</h4>
      <ul class="disposal-steps" style="--cat-color:${cat.color}">${steps}</ul>
    </div>
  `;

  // Build tips
  const tips = result.tips || [
    { icon: '♻️', title: 'Reduce First', desc: 'The best waste is waste never created.' },
    { icon: '🌍', title: 'Think Locally', desc: 'Check your local council guidelines.' },
    { icon: '📱', title: 'Scan More', desc: 'Build a habit of checking before throwing.' }
  ];

  $('resultTips').innerHTML = tips.map(tip => `
    <div class="tip-card">
      <div class="tip-icon">${escapeHtml(tip.icon || '💡')}</div>
      <div>
        <div class="tip-title">${escapeHtml(tip.title)}</div>
        <div class="tip-desc">${escapeHtml(tip.desc)}</div>
      </div>
    </div>
  `).join('');

  $('resultSection').style.display = 'block';
  $('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── History Management ───────────────────────────────────────────────────────
function addToHistory(result) {
  const cat = CATEGORIES[result.category] || CATEGORIES.general;
  const entry = {
    id: Date.now(),
    item: result.item,
    category: result.category,
    confidence: result.confidence,
    thumbnail: currentImageDataUrl,
    time: new Date().toLocaleString()
  };
  scanHistory.unshift(entry);
  if (scanHistory.length > 50) scanHistory.pop();
  localStorage.setItem('ecosort_history', JSON.stringify(scanHistory));
}

function renderHistory() {
  const list = $('historyList');
  const summary = $('historySummary');

  if (!scanHistory.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No scans yet. Start by analyzing some waste!</p></div>`;
    summary.innerHTML = '';
    return;
  }

  // Summary stats
  const counts = {};
  scanHistory.forEach(h => { counts[h.category] = (counts[h.category] || 0) + 1; });
  const topCat = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
  const cat = CATEGORIES[topCat?.[0]] || CATEGORIES.general;

  summary.innerHTML = `
    <div class="hist-stat">
      <div class="hist-stat-value">${scanHistory.length}</div>
      <div class="hist-stat-label">Total Scans</div>
    </div>
    <div class="hist-stat">
      <div class="hist-stat-value">${cat.emoji}</div>
      <div class="hist-stat-label">Most Common: ${cat.name}</div>
    </div>
    <div class="hist-stat">
      <div class="hist-stat-value">${counts['recyclable'] || 0}</div>
      <div class="hist-stat-label">Recyclable Found</div>
    </div>
    <div class="hist-stat">
      <div class="hist-stat-value">${counts['hazardous'] || 0}</div>
      <div class="hist-stat-label">Hazardous Items</div>
    </div>
  `;

  list.innerHTML = scanHistory.map(h => {
    const hCat = CATEGORIES[h.category] || CATEGORIES.general;
    return `
      <div class="history-item">
        <img class="history-thumb" src="${h.thumbnail}" alt="${escapeHtml(h.item)}" />
        <div class="history-info">
          <div class="history-item-name">${escapeHtml(h.item)}</div>
          <div class="history-meta">${escapeHtml(h.time)} &nbsp;·&nbsp; ${h.confidence}% confidence</div>
        </div>
        <span class="history-badge" style="background:${hCat.bgColor};color:${hCat.color}">
          ${hCat.emoji} ${hCat.name}
        </span>
      </div>
    `;
  }).join('');
}

// ─── Guide Builder ────────────────────────────────────────────────────────────
function buildGuide() {
  const grid = $('guideGrid');
  grid.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => `
    <div class="guide-card" style="--cat-color:${cat.color}">
      <div class="guide-card-header">
        <span class="guide-emoji">${cat.emoji}</span>
        <div>
          <div class="guide-cat-name">${cat.name}</div>
          <span class="guide-cat-tag" style="background:${cat.bgColor};color:${cat.color}">${cat.bin}</span>
        </div>
      </div>
      <p class="guide-desc">${cat.description}</p>
      <div class="guide-examples">
        ${cat.examples.map(ex => `<span class="guide-example">${ex}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resizeImage(dataUrl, maxDimension = 640) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

let toastTimer;
function showToast(msg, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  clearTimeout(toastTimer);
  setTimeout(() => toast.classList.add('show'), 10);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

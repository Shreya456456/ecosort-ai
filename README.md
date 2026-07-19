<div align="center">

<img src="https://img.shields.io/badge/♻️-EcoSort_AI-22c55e?style=for-the-badge&labelColor=0d1117&color=22c55e" alt="EcoSort AI" height="40"/>

# EcoSort AI — Smart Waste Segregation Agent

**An AI-powered web application that instantly classifies household waste from a photo and provides step-by-step disposal guidance — helping individuals make smarter, greener decisions every day.**

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-22c55e?style=for-the-badge&labelColor=0d1117)](https://shreya456456.github.io/ecosort-ai/)
[![GitHub Stars](https://img.shields.io/github/stars/Shreya456456/ecosort-ai?style=for-the-badge&labelColor=0d1117&color=f59e0b)](https://github.com/Shreya456456/ecosort-ai/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Shreya456456/ecosort-ai?style=for-the-badge&labelColor=0d1117&color=3b82f6)](https://github.com/Shreya456456/ecosort-ai/network)
[![License: MIT](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge&labelColor=0d1117)](LICENSE)

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-f97316?style=flat-square&logoColor=white)

</div>

---

## 📌 About The Project

EcoSort AI is a browser-based waste classification agent built to tackle one of the most overlooked environmental problems — **improper household waste disposal**. Despite 75% of household waste being recyclable, only about 30% actually gets recycled, largely due to public confusion about what goes where.

EcoSort AI solves this with a simple workflow: **take a photo → get AI-powered classification → follow guided steps**. No guesswork, no confusion.

The app supports two AI engines:
- ☁️ **Groq Llama Vision (Cloud)** — state-of-the-art multimodal AI, works from any browser
- 🧠 **NEU-Bin ResNet50 (Local)** — a custom-trained deep learning model that runs fully offline on your machine

The app classifies waste into **6 categories**, provides **item-specific disposal steps**, tracks your **scan history**, and includes a built-in **educational guide** — all wrapped in a modern, responsive dark UI.

---

## 🌐 Live Demo

> 🚀 **Try it instantly → [https://shreya456456.github.io/ecosort-ai/](https://shreya456456.github.io/ecosort-ai/)**

To use the live demo:
1. Get a **free Groq API key** at [console.groq.com](https://console.groq.com)
2. Paste it in the **"Setup API Key"** field on the app
3. Upload or capture any waste photo
4. Hit **Analyze Waste** — results appear in seconds ✅

> The NEU-Bin local model requires running the app locally (see below).

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤖 Dual AI Engine
Switch between Groq cloud AI (Llama Vision) and a locally-running ResNet50 model (NEU-Bin). Cloud mode works anywhere; local mode works fully offline.

### 📸 Flexible Image Input
Upload from your gallery, drag-and-drop a file, or use your device's live camera — including front/rear camera flip on mobile.

### ♻️ 6 Waste Categories
Classifies waste into Recyclable, Organic/Compost, Hazardous, E-Waste, Medical/Sanitary, and General Waste — each with color-coded results.

</td>
<td width="50%">

### 📋 Item-Specific Disposal Steps
The AI doesn't just classify — it generates step-by-step disposal instructions tailored to the exact item detected (e.g., "Rinse the PET bottle before placing in the blue bin").

### 📊 Scan History & Stats
Every scan is saved to your session history with thumbnails, timestamps, and confidence scores. View category breakdowns and totals at a glance.

### 📖 Educational Waste Guide
A built-in reference guide covers all 6 waste categories with descriptions, bin types, and real-world examples to educate users.

</td>
</tr>
</table>

---

## 🗂️ Waste Categories

| Category | Bin | Color | Common Examples |
|:---:|:---:|:---:|:---|
| ♻️ **Recyclable** | 🔵 Blue Bin | Cyan | Paper, cardboard, plastic bottles, glass jars, metal cans |
| 🌿 **Organic / Compost** | 🟢 Green Bin | Lime | Food scraps, vegetable peels, fruit, coffee grounds, eggshells |
| ⚠️ **Hazardous** | 🔶 Special Collection | Orange | Batteries, paint, pesticides, aerosols, cleaning chemicals |
| 💻 **E-Waste** | 🟣 E-Waste Center | Purple | Old phones, laptops, chargers, TVs, printers |
| 🏥 **Medical / Sanitary** | 🩺 Medical Waste | Pink | Syringes, expired medicines, bandages, PPE, sanitary products |
| 🗑️ **General Waste** | ⚫ Black Bin | Grey | Styrofoam, dirty diapers, broken ceramics, chip packets |

---

## ⚙️ How It Works

```
📷  User uploads or captures a photo of waste
         │
         ▼
🤖  AI engine analyzes the image
    (Groq Llama Vision cloud  OR  NEU-Bin ResNet50 local)
         │
         ▼
🏷️  Waste is classified into one of 6 categories
    with confidence score, material type & sub-category
         │
         ▼
📋  Step-by-step disposal instructions are generated
    specific to the exact detected item
         │
         ▼
💚  Eco tips & environmental impact info displayed
         │
         ▼
📊  Result saved to session scan history
```

---

## 🚀 Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- A free [Groq API Key](https://console.groq.com) *(for cloud AI)*
- Python 3.8+ with pip *(optional — for local NEU-Bin model only)*

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Shreya456456/ecosort-ai.git
cd ecosort-ai
```

### 2️⃣ Add your API keys *(optional — can also enter in the app UI)*

Create `keys.json` in the root folder:

```json
{
  "GROQ_API_KEYS": ["gsk_your_groq_api_key_here"]
}
```

> 🔒 `keys.json` is listed in `.gitignore` and will **never** be committed to GitHub. Alternatively, you can paste your key directly in the app — it's securely saved to `localStorage`.

### 3️⃣ Start the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4️⃣ *(Optional)* Run the NEU-Bin local AI model

```bash
pip install flask flask-cors tensorflow pillow numpy
python neubin_server.py
```

The local model server starts on `http://localhost:5050`. In the app, switch the **AI Engine** dropdown to **NEU-Bin ResNet50 (Local)** to use it.

---

## 📁 Project Structure

```
ecosort-ai/
│
├── 📄 index.html           # Main application — UI structure & layout
├── 🎨 styles.css           # Full styling (dark glassmorphism theme, animations)
├── ⚡ app.js               # Core logic: AI calls, camera, history, guide
├── 🖥️  dev.js               # Local development server (Node.js)
│
├── 🐍 neubin_server.py     # Local AI model REST API (Python / Flask)
├── 🧠 neubin_model.h5      # Pre-trained ResNet50 waste classifier weights
│
├── 🔑 keys.json            # API keys — gitignored, never committed
├── 🖼️  favicon.png          # App icon
└── 📦 package.json         # NPM config & scripts
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | HTML5, Vanilla CSS, JavaScript | UI, interactions, camera, drag-and-drop |
| **Cloud AI** | Groq API — Llama 4 Vision, Qwen 27B | Multimodal image classification |
| **Local AI** | Python, Flask, TensorFlow, ResNet50 | Offline waste classification model |
| **Dev Server** | Node.js | Local development & static file serving |
| **Hosting** | GitHub Pages | Free static site deployment |

---

## 🌍 Why This Matters

<table>
<tr>
<td align="center" width="25%"><h2>75%</h2>of household waste<br/>is recyclable</td>
<td align="center" width="25%"><h2>30%</h2>actually gets<br/>recycled today</td>
<td align="center" width="25%"><h2>500 yrs</h2>for plastic to<br/>decompose in landfills</td>
<td align="center" width="25%"><h2>40%</h2>less greenhouse gas<br/>from composting organic waste</td>
</tr>
</table>

> Proper waste segregation is one of the simplest, highest-impact actions individuals can take for the environment. EcoSort AI makes it effortless.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** this repository
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

### 💡 Ideas for contributions
- [ ] Add textile and construction waste categories
- [ ] Multi-language / regional disposal guidelines support
- [ ] PWA support for full offline usage
- [ ] Export scan history as PDF or CSV report
- [ ] Leaderboard / gamification for eco impact tracking

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 💚 to help households make smarter waste decisions

**[⭐ Star this repo](https://github.com/Shreya456456/ecosort-ai) if EcoSort AI helped you or inspired you!**

<br/>

*EcoSort AI — Because every piece of waste sorted correctly is a step toward a cleaner planet 🌍*

</div>

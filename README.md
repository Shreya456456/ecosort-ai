# ♻️ EcoSort AI — Smart Waste Segregation Agent

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-22c55e?style=for-the-badge)](https://shreya456456.github.io/ecosort-ai/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Groq](https://img.shields.io/badge/Groq-AI-f97316?style=for-the-badge)](https://groq.com)

**AI-powered household waste classification — upload a photo, get instant disposal guidance.**

[🌐 Try Live Demo](https://shreya456456.github.io/ecosort-ai/) · [📖 How It Works](#how-it-works) · [🚀 Run Locally](#run-locally)

</div>

---

## 📌 About The Project

EcoSort AI is a browser-based waste classification agent that solves one of the most overlooked environmental problems — **improper household waste disposal**.

Despite 75% of household waste being recyclable, only about 30% actually gets recycled due to public confusion about what goes where. EcoSort AI solves this with a simple workflow:

> **Take a photo → AI classifies the waste → Get step-by-step disposal guidance**

The app supports two AI engines:
- ☁️ **Groq Llama Vision (Cloud)** — works from any browser, no setup needed
- 🧠 **NEU-Bin ResNet50 (Local)** — a custom-trained deep learning model that runs fully offline

---

## ✨ Features

- 📸 **Photo Upload / Camera** — Drag-and-drop, file picker, or live camera capture (with front/rear flip)
- 🤖 **Dual AI Engine** — Switch between Groq cloud AI and a local offline ResNet50 model
- ♻️ **6 Waste Categories** — Recyclable, Organic, Hazardous, E-Waste, Medical, General
- 📋 **Item-Specific Disposal Steps** — Step-by-step guidance tailored to the exact item detected
- 📊 **Scan History** — Session history with thumbnails, timestamps, and confidence scores
- 📖 **Built-in Waste Guide** — Educational reference for all waste categories
- 📱 **Mobile Friendly** — Fully responsive with camera support on all devices

---

## 🌐 Live Demo

> **Try it now → [https://shreya456456.github.io/ecosort-ai/](https://shreya456456.github.io/ecosort-ai/)**

To use the live demo, you need a free **Groq API key**:
1. Go to [console.groq.com](https://console.groq.com) and create a free account
2. Generate an API key
3. Paste it into the **"Setup API Key"** field in the app
4. Upload any waste photo and click **Analyze Waste** ✅

> Note: The NEU-Bin local model is only available when [running locally](#run-locally).

---

## How It Works

```
📷 User uploads waste photo
         |
         v
🤖 Groq Llama Vision AI analyzes the image
         |
         v
🏷️ Waste is classified into one of 6 categories
         |
         v
📋 Disposal steps + eco tips are generated
         |
         v
📊 Result saved to session history
```

---

## Waste Categories

| Category | Bin | Examples |
|:---:|:---:|:---|
| ♻️ Recyclable | Blue Bin | Paper, plastic bottles, glass, metal cans |
| 🌿 Organic | Green Bin | Food scraps, vegetable peels, coffee grounds |
| ⚠️ Hazardous | Special Collection | Batteries, paint, pesticides, chemicals |
| 💻 E-Waste | E-Waste Center | Phones, laptops, chargers, TVs |
| 🏥 Medical | Medical Waste | Syringes, medicines, bandages, PPE |
| 🗑️ General | Black Bin | Styrofoam, dirty diapers, chip packets |

---

## 🚀 Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- A free [Groq API Key](https://console.groq.com)
- Python 3.8+ *(optional — for NEU-Bin local model only)*

### 1. Clone the repository

```bash
git clone https://github.com/Shreya456456/ecosort-ai.git
cd ecosort-ai
```

### 2. Add your API keys *(optional)*

Create `keys.json` in the root folder:

```json
{
  "GROQ_API_KEYS": ["your-groq-api-key-here"]
}
```

> `keys.json` is in `.gitignore` and will **never** be committed. You can also enter your key directly in the app UI — it saves to `localStorage`.

### 3. Start the dev server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. *(Optional)* Run the NEU-Bin local AI model

```bash
pip install flask flask-cors tensorflow pillow numpy
python neubin_server.py
```

The local model runs on `http://localhost:5050`. In the app, switch the **AI Engine** dropdown to **NEU-Bin ResNet50 (Local)**.

---

## 📁 Project Structure

```
ecosort-ai/
├── index.html           # Main application UI
├── styles.css           # Styling (dark glassmorphism theme)
├── app.js               # Core logic — AI calls, camera, history, guide
├── dev.js               # Local development server (Node.js)
├── neubin_server.py     # Local AI model REST API (Python/Flask)
├── neubin_model.h5      # Pre-trained ResNet50 waste classifier
├── keys.json            # API keys — gitignored, never committed
├── favicon.png          # App icon
└── package.json         # NPM config
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Cloud AI | Groq API — Llama 4 Vision, Qwen 27B Vision |
| Local AI | Python, Flask, TensorFlow, ResNet50 |
| Dev Server | Node.js |
| Hosting | GitHub Pages |

---

## 🌍 Why It Matters

| Stat | Fact |
|:---:|:---|
| **75%** | of household waste is recyclable |
| **30%** | is actually recycled today |
| **500 years** | for plastic to decompose in landfills |
| **40% less** | greenhouse gas from composting organic waste |

> Proper waste segregation is one of the simplest, highest-impact actions individuals can take for the environment. EcoSort AI makes it effortless.

---

## 🤝 Contributing

1. Fork this repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with 💚 to help households make smarter waste decisions 🌍

**[⭐ Star this repo](https://github.com/Shreya456456/ecosort-ai) if EcoSort AI helped you!**

</div>

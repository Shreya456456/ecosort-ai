# ♻️ EcoSort AI — Smart Waste Segregation Agent

<div align="center">

![EcoSort AI Banner](https://img.shields.io/badge/EcoSort-AI-22c55e?style=for-the-badge&logo=leaf&logoColor=white)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-22c55e?style=for-the-badge)](https://shreya456456.github.io/ecosort-ai/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Groq](https://img.shields.io/badge/Groq-AI-f97316?style=for-the-badge)](https://groq.com)

**AI-powered household waste classification — upload a photo, get instant disposal guidance.**

[🌐 Try Live Demo](https://shreya456456.github.io/ecosort-ai/) · [📖 How It Works](#how-it-works) · [🚀 Run Locally](#run-locally) · [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📸 **Photo Upload / Camera** | Drag-and-drop, file picker, or live camera capture |
| 🤖 **AI Classification** | Powered by Groq Llama 4 Vision (cloud) for instant results |
| 🧠 **NEU-Bin Local Model** | Optional ResNet50 model that runs completely offline |
| ♻️ **6 Waste Categories** | Recyclable, Organic, Hazardous, E-Waste, Medical, General |
| 📋 **Disposal Steps** | Step-by-step guidance tailored to the specific item |
| 📊 **Scan History** | Session history with stats and thumbnails |
| 📖 **Waste Guide** | Built-in educational guide for all waste categories |
| 📱 **Mobile Friendly** | Responsive design with front/rear camera flip support |

---

## 🌐 Live Demo

> **Try it now → [https://shreya456456.github.io/ecosort-ai/](https://shreya456456.github.io/ecosort-ai/)**

On the live demo, you'll need a free **Groq API key** to activate the AI:
1. Go to [console.groq.com](https://console.groq.com) → create a free account
2. Generate an API key
3. Paste it into the **"Setup API Key"** field on the app
4. Upload any waste photo and click **Analyze Waste** 🎉

> **Note:** The NEU-Bin local model is only available when [running locally](#run-locally).

---

## How It Works

```
📷 User uploads waste photo
        ↓
🤖 Groq Llama Vision AI analyzes the image
        ↓
🏷️ Waste is classified into one of 6 categories
        ↓
📋 Disposal steps + eco tips are generated
        ↓
📊 Result saved to session history
```

### Waste Categories

| Category | Bin | Examples |
|---|---|---|
| ♻️ Recyclable | 🔵 Blue Bin | Paper, plastic bottles, glass, metal cans |
| 🌿 Organic | 🟢 Green Bin | Food scraps, vegetable peels, coffee grounds |
| ⚠️ Hazardous | 🔶 Special Collection | Batteries, paint, pesticides, chemicals |
| 💻 E-Waste | 🟣 E-Waste Center | Phones, laptops, chargers, TVs |
| 🏥 Medical | 🩺 Medical Waste | Syringes, medicines, bandages, PPE |
| 🗑️ General | ⚫ Black Bin | Styrofoam, dirty diapers, chip packets |

---

## 🚀 Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- A free [Groq API Key](https://console.groq.com) — for the cloud AI engine
- *(Optional)* Python 3.8+ — only needed for the NEU-Bin local model

### 1. Clone the repository

```bash
git clone https://github.com/Shreya456456/ecosort-ai.git
cd ecosort-ai
```

### 2. Add your API keys (optional, for pre-loaded keys)

Create or edit `keys.json` in the project root:

```json
{
  "GROQ_API_KEYS": ["your-groq-api-key-here"]
}
```

> ⚠️ `keys.json` is in `.gitignore` — it will **never** be committed to GitHub. Alternatively, just enter your key in the app UI — it saves to `localStorage`.

### 3. Start the dev server

```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**

### 4. *(Optional)* Run the NEU-Bin local model

```bash
pip install flask flask-cors tensorflow pillow numpy
python neubin_server.py
```

The local model server runs on `http://localhost:5050`. Select **NEU-Bin ResNet50 (Local)** from the AI Engine dropdown in the app.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Cloud AI | [Groq](https://groq.com) — Llama 4 Vision / Qwen 27B Vision |
| Local AI | Python Flask + TensorFlow ResNet50 (NEU-Bin) |
| Dev Server | Node.js (`dev.js`) |
| Hosting | GitHub Pages (static) |

---

## 📁 Project Structure

```
ecosort-ai/
├── index.html          # Main application UI
├── styles.css          # All styling (dark glassmorphism theme)
├── app.js              # Core app logic, AI integration, history
├── dev.js              # Local dev server (Node.js)
├── neubin_server.py    # Local AI model server (Python/Flask)
├── neubin_model.h5     # Pre-trained ResNet50 waste classifier
├── keys.json           # API keys (gitignored — not in repo)
├── favicon.png         # App icon
└── package.json        # NPM config
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a **Pull Request**

### Ideas for contributions
- [ ] Add more waste categories (e.g., textiles, construction waste)
- [ ] Multi-language support
- [ ] PWA / offline support
- [ ] Export scan history as PDF/CSV

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with 💚 to help households make smarter waste decisions 🌍

**[⭐ Star this repo](https://github.com/Shreya456456/ecosort-ai) if you found it useful!**

</div>

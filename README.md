# ΓÖ╗∩╕Å EcoSort AI ΓÇö Smart Waste Segregation Agent

<div align="center">

![EcoSort AI Banner](https://img.shields.io/badge/EcoSort-AI-22c55e?style=for-the-badge&logo=leaf&logoColor=white)
[![Live Demo](https://img.shields.io/badge/≡ƒîÉ_Live_Demo-GitHub_Pages-22c55e?style=for-the-badge)](https://shreya456456.github.io/ecosort-ai/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Groq](https://img.shields.io/badge/Groq-AI-f97316?style=for-the-badge)](https://groq.com)

**AI-powered household waste classification ΓÇö upload a photo, get instant disposal guidance.**

[≡ƒîÉ Try Live Demo](https://shreya456456.github.io/ecosort-ai/) ┬╖ [≡ƒôû How It Works](#how-it-works) ┬╖ [≡ƒÜÇ Run Locally](#run-locally) ┬╖ [≡ƒñ¥ Contributing](#contributing)

</div>

---

## Γ£¿ Features

| Feature | Description |
|---|---|
| ≡ƒô╕ **Photo Upload / Camera** | Drag-and-drop, file picker, or live camera capture |
| ≡ƒñû **AI Classification** | Powered by Groq Llama 4 Vision (cloud) for instant results |
| ≡ƒºá **NEU-Bin Local Model** | Optional ResNet50 model that runs completely offline |
| ΓÖ╗∩╕Å **6 Waste Categories** | Recyclable, Organic, Hazardous, E-Waste, Medical, General |
| ≡ƒôï **Disposal Steps** | Step-by-step guidance tailored to the specific item |
| ≡ƒôè **Scan History** | Session history with stats and thumbnails |
| ≡ƒôû **Waste Guide** | Built-in educational guide for all waste categories |
| ≡ƒô▒ **Mobile Friendly** | Responsive design with front/rear camera flip support |

---

## ≡ƒîÉ Live Demo

> **Try it now ΓåÆ [https://shreya456456.github.io/ecosort-ai/](https://shreya456456.github.io/ecosort-ai/)**

On the live demo, you'll need a free **Groq API key** to activate the AI:
1. Go to [console.groq.com](https://console.groq.com) ΓåÆ create a free account
2. Generate an API key
3. Paste it into the **"Setup API Key"** field on the app
4. Upload any waste photo and click **Analyze Waste** ≡ƒÄë

> **Note:** The NEU-Bin local model is only available when [running locally](#run-locally).

---

## How It Works

```
≡ƒô╖ User uploads waste photo
        Γåô
≡ƒñû Groq Llama Vision AI analyzes the image
        Γåô
≡ƒÅ╖∩╕Å Waste is classified into one of 6 categories
        Γåô
≡ƒôï Disposal steps + eco tips are generated
        Γåô
≡ƒôè Result saved to session history
```

### Waste Categories

| Category | Bin | Examples |
|---|---|---|
| ΓÖ╗∩╕Å Recyclable | ≡ƒö╡ Blue Bin | Paper, plastic bottles, glass, metal cans |
| ≡ƒî┐ Organic | ≡ƒƒó Green Bin | Food scraps, vegetable peels, coffee grounds |
| ΓÜá∩╕Å Hazardous | ≡ƒö╢ Special Collection | Batteries, paint, pesticides, chemicals |
| ≡ƒÆ╗ E-Waste | ≡ƒƒú E-Waste Center | Phones, laptops, chargers, TVs |
| ≡ƒÅÑ Medical | ≡ƒ⌐║ Medical Waste | Syringes, medicines, bandages, PPE |
| ≡ƒùæ∩╕Å General | ΓÜ½ Black Bin | Styrofoam, dirty diapers, chip packets |

---

## ≡ƒÜÇ Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- A free [Groq API Key](https://console.groq.com) ΓÇö for the cloud AI engine
- *(Optional)* Python 3.8+ ΓÇö only needed for the NEU-Bin local model

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

> ΓÜá∩╕Å `keys.json` is in `.gitignore` ΓÇö it will **never** be committed to GitHub. Alternatively, just enter your key in the app UI ΓÇö it saves to `localStorage`.

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

## ≡ƒ¢á∩╕Å Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Cloud AI | [Groq](https://groq.com) ΓÇö Llama 4 Vision / Qwen 27B Vision |
| Local AI | Python Flask + TensorFlow ResNet50 (NEU-Bin) |
| Dev Server | Node.js (`dev.js`) |
| Hosting | GitHub Pages (static) |

---

## ≡ƒôü Project Structure

```
ecosort-ai/
Γö£ΓöÇΓöÇ index.html          # Main application UI
Γö£ΓöÇΓöÇ styles.css          # All styling (dark glassmorphism theme)
Γö£ΓöÇΓöÇ app.js              # Core app logic, AI integration, history
Γö£ΓöÇΓöÇ dev.js              # Local dev server (Node.js)
Γö£ΓöÇΓöÇ neubin_server.py    # Local AI model server (Python/Flask)
Γö£ΓöÇΓöÇ neubin_model.h5     # Pre-trained ResNet50 waste classifier
Γö£ΓöÇΓöÇ keys.json           # API keys (gitignored ΓÇö not in repo)
Γö£ΓöÇΓöÇ favicon.png         # App icon
ΓööΓöÇΓöÇ package.json        # NPM config
```

---

## ≡ƒñ¥ Contributing

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

## ≡ƒôä License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ≡ƒÆÜ to help households make smarter waste decisions ≡ƒîì

**[Γ¡É Star this repo](https://github.com/Shreya456456/ecosort-ai) if you found it useful!**

</div>

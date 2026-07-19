"""
NEU-Bin Local Model Server
Serves the ResNet50 waste classification model via a simple REST API.
Classifies into: Glass & Metal, Organic, Other (general), Paper, Plastic

Usage:
    1. Download the model from:
       https://drive.google.com/file/d/1wamwLZsclQYYsx5dLThTqZG5sJSLR7oS/view?usp=sharing
    2. Place the .h5 file in this directory as: neubin_model.h5
    3. Run: python neubin_server.py
    4. Server starts at http://localhost:5050
"""

import base64
import io
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

import numpy as np

# ── Model loading ────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'neubin_model.h5')
LABELS = ['Glass & Metal', 'Organic', 'Other', 'Paper', 'Plastic']

# Map NEU-Bin classes → EcoSort categories
CATEGORY_MAP = {
    'Glass & Metal': 'recyclable',
    'Organic':       'organic',
    'Other':         'general',
    'Paper':         'recyclable',
    'Plastic':       'recyclable',
}

EMOJI_MAP = {
    'Glass & Metal': '🥫',
    'Organic':       '🌿',
    'Other':         '🗑️',
    'Paper':         '📄',
    'Plastic':       '♻️',
}

model = None

def load_neubin_model():
    global model
    try:
        from tensorflow.keras.models import load_model
        print(f"[NEU-Bin] Loading model from {MODEL_PATH} ...")
        try:
            model = load_model(MODEL_PATH)
            print("[NEU-Bin] Model loaded successfully via load_model!")
            return True
        except Exception as load_err:
            print(f"[NEU-Bin] load_model failed: {load_err}")
            print("[NEU-Bin] Rebuilding architecture manually and loading weights by name...")
            from tensorflow.keras.applications import ResNet50V2
            from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, Input
            from tensorflow.keras.models import Model
            
            input_tensor = Input(shape=(224, 224, 3), name='resnet50v2_input')
            base_model = ResNet50V2(include_top=False, weights=None, input_tensor=input_tensor)
            x = base_model.output
            x = GlobalAveragePooling2D(name='global_average_pooling2d_3')(x)
            x = Dense(64, activation='relu', name='dense_6')(x)
            x = Dropout(0.2, name='dropout_3')(x)
            outputs = Dense(5, activation='softmax', name='dense_7')(x)
            
            model = Model(inputs=input_tensor, outputs=outputs)
            model.load_weights(MODEL_PATH, by_name=True)
            print("[NEU-Bin] Model weights loaded successfully by_name!")
            return True
    except FileNotFoundError:
        print(f"[NEU-Bin] Model file not found: {MODEL_PATH}")
        print("[NEU-Bin] Download from: https://drive.google.com/file/d/1wamwLZsclQYYsx5dLThTqZG5sJSLR7oS/view")
        return False
    except Exception as e:
        print(f"[NEU-Bin] Failed to load model: {e}")
        return False


def preprocess_image(image_bytes):
    """Preprocess image for ResNet50 input (224x224, ImageNet normalisation)."""
    from PIL import Image
    from tensorflow.keras.applications.resnet50 import preprocess_input

    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    arr = preprocess_input(arr)
    return np.expand_dims(arr, axis=0)


def predict(image_bytes):
    """Run inference and return result dict."""
    x = preprocess_image(image_bytes)
    preds = model.predict(x, verbose=0)[0]
    idx = int(np.argmax(preds))
    label = LABELS[idx]
    confidence = int(round(float(preds[idx]) * 100))

    return {
        'item':             label,
        'label':            label,
        'category':         CATEGORY_MAP[label],
        'confidence':       confidence,
        'material':         label,
        'subcategory':      label,
        'why':              f'NEU-Bin ResNet50 classified this as {label} with {confidence}% confidence.',
        'urgency':          'normal',
        'recyclable_parts': 'None' if label == 'Other' else label,
        'eco_impact':       'Proper disposal reduces landfill waste and supports recycling.',
        'model':            'NEU-Bin ResNet50 (87.5% accuracy)',
        'all_scores':       {LABELS[i]: int(round(float(preds[i]) * 100)) for i in range(len(LABELS))},
        'tips': [
            {'icon': EMOJI_MAP[label], 'title': f'{label} detected', 'desc': f'Place in the correct bin for {CATEGORY_MAP[label]} waste.'},
            {'icon': '🧠', 'title': 'NEU-Bin AI', 'desc': 'Classified by ResNet50 model trained on 3,495 waste images.'},
            {'icon': '♻️', 'title': 'Reduce first', 'desc': 'Best practice: reduce consumption before recycling.'},
        ]
    }


# ── HTTP Server ───────────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress default request logs

    def send_json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/status':
            self.send_json(200, {
                'status': 'ok' if model is not None else 'model_not_loaded',
                'model':  'NEU-Bin ResNet50',
                'labels': LABELS
            })
        else:
            self.send_json(404, {'error': 'Not found'})

    def do_POST(self):
        if self.path != '/classify':
            self.send_json(404, {'error': 'Not found'})
            return

        try:
            length = int(self.headers.get('Content-Length', 0))
            body   = json.loads(self.rfile.read(length))
            data_url = body.get('image', '')

            # Strip data:...;base64, prefix
            if ',' in data_url:
                data_url = data_url.split(',', 1)[1]

            image_bytes = base64.b64decode(data_url)

            if model is None:
                self.send_json(503, {'error': 'Model not loaded. Download neubin_model.h5 first.'})
                return

            result = predict(image_bytes)
            print(f"[NEU-Bin] Classified: {result['label']} ({result['confidence']}%)")
            self.send_json(200, result)

        except Exception as e:
            print(f"[NEU-Bin] Error: {e}")
            self.send_json(500, {'error': str(e)})


if __name__ == '__main__':
    print("=" * 55)
    print("  NEU-Bin Local Model Server")
    print("=" * 55)

    model_loaded = load_neubin_model()

    if not model_loaded:
        print("\n Starting server anyway — /status will report model_not_loaded")
        print(" Download the model and restart to enable local inference.\n")

    port = 5050
    server = HTTPServer(('localhost', port), Handler)
    print(f"[NEU-Bin] Server running at http://localhost:{port}")
    print(f"[NEU-Bin] POST /classify  — classify an image")
    print(f"[NEU-Bin] GET  /status    — check model status")
    print(f"[NEU-Bin] Press Ctrl+C to stop\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[NEU-Bin] Server stopped.")

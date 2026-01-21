import cv2
import numpy as np
from tensorflow.keras.models import load_model

model = load_model("models/dr_classifier.h5")

CLASSES = ["No_DR", "Mild_DR", "Severe_DR"]

def classify_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=(0, -1))

    preds = model.predict(img)[0]
    idx = np.argmax(preds)

    return CLASSES[idx], float(preds[idx])

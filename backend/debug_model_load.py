import os
import tensorflow as tf
from tensorflow.keras.models import load_model
import traceback

# Import custom objects from segmentation.py
# We can just redefine them here to be sure, or import them.
# Let's redefine to match segmentation.py exactly
def dice_loss(y_true, y_pred):
    smooth = 1e-6
    intersection = tf.reduce_sum(y_true * y_pred)
    return 1 - (2. * intersection + smooth) / (
        tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + smooth
    )

def combined_loss(y_true, y_pred):
    bce = tf.keras.losses.BinaryCrossentropy()(y_true, y_pred)
    return bce + dice_loss(y_true, y_pred)

model_path = r"c:\Users\praveen\Desktop\DiabeticReferenceProject\backend\models\attention_unet.h5"

print(f"Attempting to load model from: {model_path}")
try:
    model = load_model(model_path, custom_objects={
        'dice_loss': dice_loss,
        'combined_loss': combined_loss
    })
    print("Model loaded successfully!")
except Exception:
    traceback.print_exc()

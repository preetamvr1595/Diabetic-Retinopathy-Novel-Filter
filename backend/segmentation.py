import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, UpSampling2D,
    Input, BatchNormalization, Activation,
    concatenate, Multiply
)
from tensorflow.keras.models import Model, load_model

# ==============================
# MODEL DEFINITION (Must match training)
# ==============================
def conv_block(x, filters):
    x = Conv2D(filters, 3, padding='same')(x)
    x = BatchNormalization()(x)
    x = Activation('relu')(x)

    x = Conv2D(filters, 3, padding='same')(x)
    x = BatchNormalization()(x)
    x = Activation('relu')(x)
    return x

def attention_gate(x, g, filters):
    theta_x = Conv2D(filters, 1, padding='same')(x)
    phi_g = Conv2D(filters, 1, padding='same')(g)
    add = Activation('relu')(theta_x + phi_g)
    psi = Conv2D(1, 1, padding='same')(add)
    psi = Activation('sigmoid')(psi)
    return Multiply()([x, psi])

def Attention_UNet(input_shape=(256,256,1)):
    inputs = Input(input_shape)

    c1 = conv_block(inputs, 64)
    p1 = MaxPooling2D()(c1)

    c2 = conv_block(p1, 128)
    p2 = MaxPooling2D()(c2)

    c3 = conv_block(p2, 256)
    p3 = MaxPooling2D()(c3)

    c4 = conv_block(p3, 512)
    p4 = MaxPooling2D()(c4)

    bn = conv_block(p4, 1024)

    u4 = UpSampling2D()(bn)
    a4 = attention_gate(c4, u4, 512)
    d4 = conv_block(concatenate([u4, a4]), 512)

    u3 = UpSampling2D()(d4)
    a3 = attention_gate(c3, u3, 256)
    d3 = conv_block(concatenate([u3, a3]), 256)

    u2 = UpSampling2D()(d3)
    a2 = attention_gate(c2, u2, 128)
    d2 = conv_block(concatenate([u2, a2]), 128)

    u1 = UpSampling2D()(d2)
    a1 = attention_gate(c1, u1, 64)
    d1 = conv_block(concatenate([u1, a1]), 64)

    outputs = Conv2D(1, 1, activation='sigmoid')(d1)

    return Model(inputs, outputs)

def dice_loss(y_true, y_pred):
    smooth = 1e-6
    intersection = tf.reduce_sum(y_true * y_pred)
    return 1 - (2. * intersection + smooth) / (
        tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + smooth
    )

def combined_loss(y_true, y_pred):
    bce = tf.keras.losses.BinaryCrossentropy()(y_true, y_pred)
    return bce + dice_loss(y_true, y_pred)

# ==============================
# LAZY LOAD MODEL
# ==============================
model = None

def get_model():
    global model
    if model is not None:
        return model

    curr_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(curr_dir, "models", "attention_unet.h5")
    
    if not os.path.exists(model_path):
        print(f"Warning: Segmentation model not found at {model_path}")
        return None

    print(f"Loading Segmentation Model from {model_path}...")
    try:
        # Try loading full model with compile=False (safer for inference)
        model = load_model(model_path, custom_objects={
            'dice_loss': dice_loss,
            'combined_loss': combined_loss
        }, compile=False)
        print("Segmentation Model Loaded Successfully (Full Load).")
    except Exception as e:
        print(f"Full model load failed ({e}), attempting invalid layer workaround...")
        try:
            # Fallback: Build architecture and load weights
            model = Attention_UNet()
            model.load_weights(model_path)
            print("Segmentation Model Loaded Successfully (Weights Only).")
        except Exception as e2:
            print(f"Error loading model: {e2}")
            model = None
            
    return model

# ==============================
# INFERENCE FUNCTION
# ==============================
def segment_image(image_path):
    model = get_model()
    if model is None:
        print("Model not loaded, cannot segment.")
        return None

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None
    
    original_shape = img.shape[:2] # (H, W)
    
    # Preprocess
    img_resized = cv2.resize(img, (256, 256))
    img_norm = img_resized / 255.0
    img_input = np.expand_dims(img_norm, axis=(0, -1)) # (1, 256, 256, 1)
    
    # Predict
    pred = model.predict(img_input)[0] # (256, 256, 1)
    
    # Post-process
    mask = (pred > 0.5).astype(np.uint8) * 255
    mask_resized = cv2.resize(mask, (original_shape[1], original_shape[0]), interpolation=cv2.INTER_NEAREST)
    
    # Save mask
    dir_name = os.path.dirname(image_path)
    base_name = os.path.basename(image_path)
    mask_filename = f"mask_{base_name}"
    mask_path = os.path.join(dir_name, mask_filename)
    
    cv2.imwrite(mask_path, mask_resized)
    
    return mask_path

import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, UpSampling2D,
    Input, BatchNormalization, Activation,
    concatenate, Multiply
)
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# ==============================
# PATHS
# ==============================
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = PROJECT_ROOT
IMAGE_DIR = os.path.join(BASE_PATH, "images")
MASK_DIR = os.path.join(BASE_PATH, "dataset", "masks")

IMG_SIZE = 256
EPOCHS = 15
BATCH_SIZE = 2

# ==============================
# LOAD DATA
# ==============================
images = []
masks = []

for img_name in os.listdir(IMAGE_DIR):
    img_path = os.path.join(IMAGE_DIR, img_name)
    mask_path = os.path.join(MASK_DIR, img_name)

    if not os.path.exists(mask_path):
        continue

    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

    if img is None or mask is None:
        continue

    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    mask = cv2.resize(mask, (IMG_SIZE, IMG_SIZE))

    img = img / 255.0
    mask = (mask > 0).astype(np.float32)

    images.append(img)
    masks.append(mask)

X = np.array(images)[..., np.newaxis]
y = np.array(masks)[..., np.newaxis]

print(f"Loaded {len(X)} image-mask pairs")

# ==============================
# TRAIN / VALIDATION SPLIT
# ==============================
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==============================
# MODEL COMPONENTS
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

# ==============================
# LOSS FUNCTIONS
# ==============================
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
# COMPILE MODEL
# ==============================
model = Attention_UNet()
model.compile(
    optimizer=Adam(1e-4),
    loss=combined_loss,
    metrics=['accuracy']
)

model.summary()

# ==============================
# TRAIN MODEL
# ==============================
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE
)

# ==============================
# SAVE MODEL
# ==============================
model_path = os.path.join(PROJECT_ROOT, "attention_unet.h5")
model.save(model_path)
print(f"\n✅ Model saved as {model_path}")

# ==============================
# QUICK VISUAL TEST
# ==============================
idx = np.random.randint(len(X_val))
pred = model.predict(X_val[idx:idx+1])[0]
pred_mask = (pred > 0.5).astype(np.uint8)

plt.figure(figsize=(10,4))
plt.subplot(1,3,1)
plt.title("Input Image")
plt.imshow(X_val[idx].squeeze(), cmap='gray')
plt.axis('off')

plt.subplot(1,3,2)
plt.title("True Mask")
plt.imshow(y_val[idx].squeeze(), cmap='gray')
plt.axis('off')

plt.subplot(1,3,3)
plt.title("Predicted Mask")
plt.imshow(pred_mask.squeeze(), cmap='gray')
plt.axis('off')

plt.show()

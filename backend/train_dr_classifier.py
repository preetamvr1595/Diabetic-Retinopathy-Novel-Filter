import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split

# ----------------------------
# LOSS FUNCTIONS (same as training)
# ----------------------------
def dice_loss(y_true, y_pred):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)
    numerator = 2 * tf.reduce_sum(y_true * y_pred)
    denominator = tf.reduce_sum(y_true + y_pred)
    return 1 - numerator / denominator

def bce_loss(y_true, y_pred):
    return tf.keras.losses.binary_crossentropy(y_true, y_pred)

combined_loss = lambda y_true, y_pred: bce_loss(y_true, y_pred) + dice_loss(y_true, y_pred)

IMG_SIZE = 224
DATASET = "dataset"  # Directory where DR folders are located
MASK_DIR = os.path.join("dataset", "dataset", "masks")  # Path to pre-generated masks

classes = ["No_DR", "Mild_DR", "Severe_DR"]
label_map = {c:i for i,c in enumerate(classes)}

X, y = [], []

for cls in classes:
    folder = os.path.join(DATASET, cls)
    print(f"Checking folder: {folder}")
    if not os.path.exists(folder):
        print(f"Folder {folder} does not exist")
        continue
    files = os.listdir(folder)
    print(f"Found {len(files)} files in {cls}")
    for img_name in files:
        img_path = os.path.join(folder, img_name)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            continue

        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

        # 🔥 USE IMAGE ONLY (no mask)
        combined = (img/255.0)[..., np.newaxis]

        X.append(combined)
        y.append(label_map[cls])

print(f"Total samples loaded: {len(X)}")

X = np.array(X)
y = to_categorical(y, num_classes=3)

X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2)

# ----------------------------
# CNN MODEL
# ----------------------------
model = Sequential([
    Conv2D(32,(3,3),activation='relu',input_shape=(224,224,1)),
    MaxPooling2D(2,2),
    Conv2D(64,(3,3),activation='relu'),
    MaxPooling2D(2,2),
    Flatten(),
    Dense(128,activation='relu'),
    Dropout(0.5),
    Dense(3,activation='softmax')
])

model.compile(
    optimizer=Adam(0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train,y_train,epochs=15,batch_size=8,validation_split=0.1)

model.save("dr_classifier.h5")
print("✅ DR Classification Model Saved")

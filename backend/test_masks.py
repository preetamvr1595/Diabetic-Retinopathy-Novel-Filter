import os
import cv2
import random
import matplotlib.pyplot as plt

# ==============================
# PATH CONFIGURATION
# ==============================
BASE_PATH = r"dataset"   # keep dataset in same folder
IMAGE_DIR = os.path.join(BASE_PATH, "images")
MASK_DIR = os.path.join(BASE_PATH, "dataset", "masks")

# ==============================
# PICK RANDOM IMAGE
# ==============================
img_name = random.choice(os.listdir(IMAGE_DIR))

img_path = os.path.join(IMAGE_DIR, img_name)
mask_path = os.path.join(MASK_DIR, img_name)

# ==============================
# READ IMAGE & MASK
# ==============================
img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

if img is None or mask is None:
    raise ValueError("Image or mask not found!")

img = cv2.resize(img, (256, 256))
mask = cv2.resize(mask, (256, 256))

# ==============================
# CREATE OVERLAY
# ==============================
overlay = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
overlay[mask > 0] = [255, 0, 0]  # RED vessels

# ==============================
# DISPLAY RESULTS
# ==============================
plt.figure(figsize=(12,4))

plt.subplot(1,3,1)
plt.title("Original Image")
plt.imshow(img, cmap="gray")
plt.axis("off")

plt.subplot(1,3,2)
plt.title("Segmentation Mask")
plt.imshow(mask, cmap="gray")
plt.axis("off")

plt.subplot(1,3,3)
plt.title("Overlay (Mask on Image)")
plt.imshow(overlay)
plt.axis("off")

plt.tight_layout()
plt.savefig("mask_visualization.png", dpi=300, bbox_inches='tight')
print("✅ Visualization saved as 'mask_visualization.png'")
# plt.show()  # Commented out for terminal execution

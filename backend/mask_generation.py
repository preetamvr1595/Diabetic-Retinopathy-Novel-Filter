import os
import cv2
import numpy as np

# ==============================
# PATH CONFIGURATION (SAFE)
# ==============================
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = os.path.join(PROJECT_ROOT, "dataset")

IMAGE_DIR = os.path.join(PROJECT_ROOT, "images")
MASK_DIR = os.path.join(BASE_PATH, "masks")

os.makedirs(MASK_DIR, exist_ok=True)

print("PROJECT ROOT:", PROJECT_ROOT)
print("IMAGE DIR:", IMAGE_DIR)
print("MASK DIR:", MASK_DIR)

if not os.path.isdir(IMAGE_DIR):
    raise FileNotFoundError(f"Image folder not found: {IMAGE_DIR}")

# Debug: List contents of IMAGE_DIR
print("Contents of IMAGE_DIR:", os.listdir(IMAGE_DIR))


print("\nStarting pseudo-mask generation...\n")

# ==============================
# PROCESS EACH IMAGE
# ==============================
for img_name in os.listdir(IMAGE_DIR):

    img_path = os.path.join(IMAGE_DIR, img_name)

    # Skip folders
    if os.path.isdir(img_path):
        continue

    # ------------------------------
    # 1. READ IMAGE
    # ------------------------------
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        continue

    img = cv2.resize(img, (256, 256))

    # ------------------------------
    # 2. CONTRAST ENHANCEMENT (CLAHE)
    # ------------------------------
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(img)

    # ------------------------------
    # 3. ADAPTIVE THRESHOLDING
    # ------------------------------
    mask = cv2.adaptiveThreshold(
        enhanced,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        11,
        2
    )

    # ------------------------------
    # 4. LIGHT MORPHOLOGICAL OPENING
    # ------------------------------
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    # ------------------------------
    # 5. REMOVE ONLY VERY SMALL NOISE
    # ------------------------------
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)

    clean_mask = np.zeros_like(mask)
    min_area = 30  # relaxed threshold (IMPORTANT)

    for i in range(1, num_labels):  # skip background
        if stats[i, cv2.CC_STAT_AREA] > min_area:
            clean_mask[labels == i] = 255

    # ------------------------------
    # 6. FINAL MASK (NO EROSION)
    # ------------------------------
    final_mask = clean_mask

    # ------------------------------
    # 7. SAVE MAS
    # ------------------------------
    save_path = os.path.join(MASK_DIR, img_name)
    cv2.imwrite(save_path, final_mask)

    print(f"Saved mask: {save_path}")

print("\n✅ Pseudo-mask generation completed successfully.")
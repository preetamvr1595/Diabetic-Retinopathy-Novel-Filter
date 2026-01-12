import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.filters import gabor
from skimage.metrics import structural_similarity as ssim
from skimage.measure import shannon_entropy

# -----------------------------
# IMAGE PATH
# -----------------------------
IMAGE_PATH = r"archive (28)\retino\train\DR\f762c272c522_png.rf.a851c5b93b86e39e8c488723ca360f36.jpg"

img = cv2.imread(IMAGE_PATH)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# -----------------------------
# FILTER DEFINITIONS
# -----------------------------

def median_filter(img):
    return cv2.medianBlur(img, 5)

def gaussian_filter(img):
    return cv2.GaussianBlur(img, (5, 5), 0)

def clahe_filter(img):
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(img)

def sobel_filter(img):
    return cv2.Sobel(img, cv2.CV_64F, 1, 1, ksize=3)

def laplacian_filter(img):
    return cv2.Laplacian(img, cv2.CV_64F)

def gabor_filter(img):
    g, _ = gabor(img, frequency=0.6)
    return cv2.normalize(g, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

# -----------------------------
# NOVEL FILTER (PDF-ALIGNED)
# -----------------------------

def novel_filter(img):
    med = median_filter(img)
    clahe_img = clahe_filter(med)
    gabor_img = gabor_filter(clahe_img)
    novel = cv2.addWeighted(clahe_img, 0.6, gabor_img, 0.4, 0)
    return novel

# -----------------------------
# METRICS
# -----------------------------

def mse(img1, img2):
    return np.mean((img1 - img2) ** 2)

def psnr(img1, img2):
    mse_val = mse(img1, img2)
    if mse_val == 0:
        return 100
    return 20 * np.log10(255.0 / np.sqrt(mse_val))

# -----------------------------
# APPLY FILTERS
# -----------------------------

median = median_filter(gray)
gaussian = gaussian_filter(gray)
clahe_img = clahe_filter(gray)

filters = {
    "Original": gray,
    "Median": median,
    "Gaussian": gaussian,
    "CLAHE": clahe_img,
    "Sobel": sobel_filter(gray),
    "Laplacian": laplacian_filter(gray),
    "Gabor": gabor_filter(gray),
    "Novel": novel_filter(gray)
}

# -----------------------------
# DISPLAY IMAGES
# -----------------------------

plt.figure(figsize=(15, 10))
for i, (name, image) in enumerate(filters.items()):
    plt.subplot(3, 3, i + 1)
    plt.imshow(image, cmap='gray')
    plt.title(name)
    plt.axis('off')
plt.tight_layout()
plt.show()

# -----------------------------
# METRIC COMPARISON
# -----------------------------

print("\nFILTER COMPARISON METRICS\n")

for name, image in filters.items():
    if name == "Original":
        continue
    print(f"{name}:")
    print("  MSE:", mse(gray, image))
    print("  PSNR:", psnr(gray, image))
    print("  SSIM:", ssim(gray, image))
    print("  Entropy:", shannon_entropy(image))
    print()

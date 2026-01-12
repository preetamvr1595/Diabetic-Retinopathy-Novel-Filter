import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.filters import gabor
from skimage.measure import shannon_entropy
from skimage.metrics import structural_similarity as ssim
import pandas as pd

# ==============================
# LOAD IMAGE (GRAYSCALE)
# ==============================
IMAGE_PATH = r"archive (28)\retino\train\DR\f762c272c522_png.rf.a851c5b93b86e39e8c488723ca360f36.jpg"

img = cv2.imread(IMAGE_PATH, cv2.IMREAD_GRAYSCALE)
if img is None:
    raise ValueError("Image not found")

img = cv2.resize(img, (512, 512))

# ==============================
# METRIC FUNCTIONS
# ==============================
def mse(img1, img2):
    return np.mean((img1.astype("float") - img2.astype("float")) ** 2)

def psnr(img1, img2):
    mse_val = mse(img1, img2)
    if mse_val == 0:
        return 100
    return 20 * np.log10(255.0 / np.sqrt(mse_val))

# ==============================
# APPLY FILTERS
# ==============================
filters = {}

filters["Original"] = img
filters["Mean"] = cv2.blur(img, (5,5))
filters["Median"] = cv2.medianBlur(img, 5)
filters["Gaussian"] = cv2.GaussianBlur(img, (5,5), 0)
filters["Bilateral"] = cv2.bilateralFilter(img, 9, 75, 75)

filters["Sobel"] = cv2.convertScaleAbs(
    cv2.Sobel(img, cv2.CV_64F, 1, 1, ksize=3))

filters["Prewitt"] = cv2.filter2D(
    img, -1, np.array([[1,0,-1],[1,0,-1],[1,0,-1]]))

filters["Laplacian"] = cv2.convertScaleAbs(
    cv2.Laplacian(img, cv2.CV_64F))

gabor_real, _ = gabor(img, frequency=0.6)
filters["Gabor"] = cv2.normalize(
    gabor_real, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
filters["CLAHE"] = clahe.apply(img)

# ==============================
# 🔥 NOVEL FILTER (PROPOSED)
# Median + CLAHE + Sobel
# ==============================
novel = cv2.medianBlur(img, 5)
novel = clahe.apply(novel)
novel = cv2.convertScaleAbs(
    cv2.Sobel(novel, cv2.CV_64F, 1, 1, ksize=3))
filters["Novel_AHREF"] = novel

# ==============================
# DISPLAY IMAGES + VALUES
# ==============================
plt.figure(figsize=(18, 14))

results = []

for i, (name, image) in enumerate(filters.items(), 1):
    m = mse(img, image)
    p = psnr(img, image)
    e = shannon_entropy(image)
    s = ssim(img, image)

    results.append([name, round(m,2), round(p,2), round(e,4), round(s,4)])

    plt.subplot(4, 4, i)
    plt.imshow(image, cmap='gray')
    plt.title(f"{name}\nMSE:{m:.1f} | PSNR:{p:.1f}\nENT:{e:.2f} | SSIM:{s:.2f}")
    plt.axis("off")

plt.suptitle("Diabetic Retinopathy Filter Comparison (Grayscale)", fontsize=16)
plt.tight_layout()
plt.show()

# ==============================
# PRINT TABLE (FOR DOCUMENT)
# ==============================
df = pd.DataFrame(
    results,
    columns=["Filter", "MSE", "PSNR", "Entropy", "SSIM"]
)

print("\n📊 FILTER PERFORMANCE TABLE\n")
print(df.sort_values(by=["PSNR", "Entropy", "SSIM"], ascending=False))

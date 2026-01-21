from filter_test import (
    filter_mean,
    filter_median,
    filter_gaussian,
    filter_bilateral,
    filter_laplacian_sharpen,
    filter_unsharp_masking,
    filter_clahe,
    filter_ideal_lpf,
    filter_gaussian_lpf,
    filter_ideal_hpf,
    filter_homomorphic,
    filter_median_gamma,
    filter_median_laplacian,
    filter_clahe_wavelet,
    filter_ace_me_novel,
    compute_metrics
)
import cv2
import numpy as np

def apply_all_filters(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")

    # Resize for performance (Limit max dimension to 512)
    h, w = img.shape
    max_dim = 512
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h))

    results = {}
    filters = {
        "Original": lambda x: x,
        "Mean": filter_mean,
        "Median": filter_median,
        "Gaussian": filter_gaussian,
        "Bilateral": filter_bilateral,
        "Laplacian": filter_laplacian_sharpen,
        "Unsharp_Mask": filter_unsharp_masking, # Fixed key name
        "CLAHE": filter_clahe,
        "Ideal_LPF": filter_ideal_lpf,
        "Gaussian_LPF": filter_gaussian_lpf,
        "Ideal_HPF": filter_ideal_hpf,
        "Homomorphic": filter_homomorphic,
        "Median_Gamma": filter_median_gamma,
        "Median_Laplacian": filter_median_laplacian,
        "CLAHE_Wavelet": filter_clahe_wavelet,
        "ACE_ME_Novel": filter_ace_me_novel
    }

    for name, func in filters.items():
        try:
            processed = func(img)
            # Ensure processed is same size/type as img
            if processed.shape != img.shape:
                processed = cv2.resize(processed, (img.shape[1], img.shape[0]))
                
            metrics = compute_metrics(img, processed)
            
            results[name] = {
                "metrics": metrics,
                "image": processed
            }
        except Exception as e:
            print(f"Filter {name} failed: {e}")
            # Fallback to original if filter fails
            results[name] = {
                "metrics": {"PSNR": 0, "SSIM": 0, "MSE": 0, "Entropy": 0, "CII": 0},
                "image": img
            }

    return results

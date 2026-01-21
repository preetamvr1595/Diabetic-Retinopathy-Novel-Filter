
import os
import cv2
import numpy as np
from filters import apply_all_filters

def test_filters():
    # Create a dummy image
    img = np.zeros((512, 512), dtype=np.uint8)
    cv2.rectangle(img, (100, 100), (400, 400), 255, -1)
    cv2.line(img, (0, 0), (512, 512), 128, 5)
    
    img_path = "temp_debug_img.jpg"
    cv2.imwrite(img_path, img)
    
    print(f"Created dummy image: {img_path}")
    
    try:
        print("Running apply_all_filters...")
        results = apply_all_filters(img_path)
        print(f"Success! Generated {len(results)} filters.")
        print("Filter names:", list(results.keys()))
        
        # Check content of one
        first = list(results.keys())[0]
        print(f"Metrics for {first}: {results[first]['metrics']}")
        print(f"Image shape for {first}: {results[first]['image'].shape}")
        
    except Exception as e:
        print(f"FATAL ERROR in apply_all_filters: {e}")
        import traceback
        traceback.print_exc()
    
    # Clean up
    if os.path.exists(img_path):
        os.remove(img_path)

if __name__ == "__main__":
    test_filters()

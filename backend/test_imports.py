
print("Start test_imports.py")
try:
    import cv2
    print("cv2 imported")
    import matplotlib
    # Force non-interactive backend
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    print("plt imported")
    import filter_test
    print("filter_test imported exception as e")
except Exception as e:
    print(f"Error  in this entire cv2: {e}")
print("End test_imports.py")

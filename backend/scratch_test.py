import os
import numpy as np

def test_model():
    print("[TEST] Initializing Keras model test...")
    
    # Check model path
    model_path = os.path.join(os.path.dirname(__file__), "models", "plant_disease_model.keras")
    if not os.path.exists(model_path):
        print(f"[TEST ERROR] Model file not found at {model_path}")
        return
        
    print(f"[TEST] Loading model from {model_path}...")
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(model_path)
        print("[TEST SUCCESS] Model loaded successfully!")
        
        # Test input shape
        print(f"[TEST] Model Input Shape: {model.input_shape}")
        
        # Generate a dummy leaf image representing a 224x224 RGB image
        dummy_img = np.random.rand(1, 224, 224, 3).astype(np.float32)
        
        print("[TEST] Running model prediction on dummy input...")
        predictions = model.predict(dummy_img)
        predicted_class = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class]
        
        print(f"[TEST SUCCESS] Predicted class index: {predicted_class}")
        print(f"[TEST SUCCESS] Prediction confidence: {confidence * 100:.2f}%")
        
    except Exception as e:
        print(f"[TEST ERROR] Model prediction failed: {e}")

if __name__ == "__main__":
    test_model()

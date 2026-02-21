"""
Script to fix scikit-learn version compatibility for the model
Run this once to ensure the correct version is installed
"""
import subprocess
import sys

def fix_sklearn():
    print("Fixing scikit-learn version compatibility...")
    try:
        # Install the correct version
        subprocess.check_call([sys.executable, "-m", "pip", "install", "scikit-learn==1.2.2", "--force-reinstall", "--no-deps"])
        print("✓ scikit-learn 1.2.2 installed successfully")
        
        # Verify installation
        import sklearn
        print(f"✓ Current scikit-learn version: {sklearn.__version__}")
        
        # Test model loading
        import joblib
        try:
            model = joblib.load('ml_models/dtmodel.pkl')
            print("✓ Model loaded successfully!")
            return True
        except Exception as e:
            print(f"✗ Model loading failed: {e}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        print("\nPlease run manually:")
        print("  pip install scikit-learn==1.2.2 --force-reinstall")
        return False

if __name__ == "__main__":
    fix_sklearn()

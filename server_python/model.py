import joblib
import tensorflow as tf


diabetesModel = joblib.load('./PKL/diabetes_model.pkl')

stressModel = joblib.load('./PKL/stress_model.pkl')

model = tf.keras.models.load_model('./PKL/model.h5')

sepsiModel = joblib.load('./PKL/sepsis.pkl')

sepsisScaler = joblib.load('./PKL/scaler.pkl')
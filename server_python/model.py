import joblib
import tensorflow as tf


diabetesModel = joblib.load('./PKL/diabetes_model.pkl')

stressModel = joblib.load('./PKL/stress_model.pkl')

model = tf.keras.models.load_model('./PKL/model.h5')

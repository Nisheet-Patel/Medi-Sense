from flask import Blueprint,jsonify,request
import numpy as np
from model import diabetesModel,stressModel,sepsiModel, sepsisScaler
import pandas as pd

modelRouter = Blueprint('modelRouter',__name__)

@modelRouter.route('/diabetes',methods=['POST'])
def get_diabetes_model():
    try:
        data = request.json
        features = []
        keys = ['Pregnancies','Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigreeFunction','Age']

        #⁡⁣⁣⁢Accessing all features⁡
        for feature in keys:
            value = int(data.get(feature))
            if value is None:
                raise ValueError(f'Missing value for {feature}')
            features.append(value)

        print("Received Features:", features)

        #⁡⁣⁣⁢Make Prediction⁡
        prediction = diabetesModel.predict([features])

        print("IsDiabetes : ",prediction)

        return jsonify({'message' : "Response OK",'prediction' : bool(prediction == 1)}),200

    except Exception as e:
        print('Error at diabetes model controller : ',str(e))
        return jsonify({'message' : "Internal Server Error"}),500



@modelRouter.route('/stress',methods=["POST"])
def get_stress_model():

    try:
        data = request.json
        print(data)

        features = []

        feature_keys = ['Education', 'Gender', 'Engnat', 'Age', 'Married', 'Familysize', 'stress_sum']

        #⁡⁣⁣⁢Accessing all features⁡
        for key in feature_keys:
            value = int(data.get(key))

            if(value is None):
                raise ValueError(f"value missing for {key}")
            features.append(value)

        #⁡⁣⁣⁢Make Prediction⁡
        prediction = stressModel.predict([features])

        print("Stress : ",prediction)

        return jsonify({'message' : 'Response OK','prediction' : str(prediction[0])}),200

    except Exception as e:
        print("Error In stress model : ",str(e))
        return jsonify({"message" : "Internal Server Error"}),500
    

@modelRouter.route('/sepsis',methods=['POST'])
def get_sepsis_model():
    try:
        data = request.json

        features = []

        feature_keys = ['Hour', 'HR', 'O2Sat', 'Temp', 'MAP', 'Resp', 'BUN', 'Chloride',
            'Creatinine', 'Glucose', 'Hct', 'Hgb', 'WBC', 'Platelets',
            'Age', 'HospAdmTime', 'ICULOS', '0', '1']  # Removed 'SepsisLabel'

        for feature in feature_keys:
            value  = float(data.get(feature))
            if value is None:
                raise ValueError(f"Missing value for {feature}")  
            features.append(value)

        # Example: Raw user input (values in original scale)
        if(int(data.get('HR'))>120 or int(data.get('HR'))<90 or int(data.get('Platelets'<150))):
            return jsonify({'message' : 'Response OK','prediction' : True}),200
        # user_input = np.array([[5, 90, 98, 37.2, 80, 20, 15, 105, 1.2, 120, 40, 13, 10, 250, 65, -10, 12, 0, 1]])

        user_input = np.array([features])

        # Convert to DataFrame
        user_input_df = pd.DataFrame(user_input, columns=feature_keys)
        
        # Apply the same standardization as during training
        user_input_scaled = sepsisScaler.transform(user_input_df)

        # Convert back to DataFrame
        user_input_df_scaled = pd.DataFrame(user_input_scaled, columns=feature_keys)

        # Make prediction
        prediction = sepsiModel.predict(user_input_df_scaled)

        # Output prediction
        if prediction[0] == 1:
            print("Sepsis Detected!")
        else:
            print("No Sepsis Detected")

        return jsonify({'message' : 'Response OK','prediction' : bool(prediction[0] == 1)}),200

    except Exception as e:
        print("Error in sepsis model : ",str(e))
        return jsonify({"message" : "Internal Server Error"}),500

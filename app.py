from flask import Flask, jsonify, request
import pandas as pd
import os
import json
import numpy as np
from flask_cors import CORS, cross_origin


app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

model = pd.read_pickle(os.getcwd()+"/model/nb_model.pickle")

@app.route("/api")
@cross_origin()
def test():
	return "Hello"

def predict(symptoms):
	json_file_path = os.getcwd()+'/data.json'
	with open(json_file_path, 'r') as j:
        	data = json.load(j)
	data_dict = json.loads(data)
	symptoms = symptoms.split(",")

	input_data = [0] * len(data_dict['symptom_index'])
	for symptom in symptoms:
        	index = data_dict["symptom_index"][symptom]
        	input_data[index] = 1

	input_data = np.array(input_data).reshape(1,-1)
	response = data_dict["predictions_classes"][model.predict(input_data)[0]]
	return response

@app.route("/api/predict",methods=['POST'])
@cross_origin(origin="*")
def preDisease():

	if request.method == 'POST':
		input = request.json
		prediction = predict(input["symptoms"])
	
	response = str(prediction)
	return response

if __name__ == '__main__':
	app.run(debug=True)

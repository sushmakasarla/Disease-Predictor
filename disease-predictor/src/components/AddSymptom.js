import React, { useState } from "react";
import Dropdown from './Dropdown';
import data from '../data.json';
import './AddSymptom.css';


function AddSymptom(){

    let json_data = JSON.parse(data);
    const options = Object.keys(json_data["symptom_index"])
    const [selectedValue, setSelectedValue] = useState('');

    const [result, setResult] = useState([]);

    const handleSubmit = (event) =>{
        event.preventDefault();
        fetch("http://127.0.0.1:5000/api/predict", {
            method: 'POST',
            headers: { 
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json'
             },
            body: JSON.stringify({"symptoms":[...selectedValue].join(',')})
        })
        .then((res) => res.text())
        .then((result) => {
            setResult(result)
        })
        event.target.reset();
    }

    return (
        <div className='container'>
            <br/><br/>
            <h3>Symptom Selection</h3>
            <br/>
            <form onSubmit={handleSubmit}>
                <Dropdown
                isSearchable
                isMulti="true"
                placeHolder="Select..."
                options={options}
                onChange={(value) => {setSelectedValue(value)}}
            />
            <br/><br/><br/><br/>
            <button type="submit" className='button'>Predict</button>
            <br/><br/>
            <h3>Prediction: </h3>
            <h3>{result}</h3>
            <br/><br/>
            </form>
        </div>
    );
}

export default AddSymptom;
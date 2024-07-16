
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ClientForm() {
  const [formStructure, setFormStructure] = useState([]);
  const [formData, setFormData] = useState({});

  let inputFields  = JSON.parse(localStorage.getItem('inputFields'))

  useEffect(() => {
        if(inputFields){
        setFormStructure(inputFields);
        setFormData(inputFields.reduce((acc, field) => {
            if (field.type === 'radio') {
              acc[field.id] = '';
            } else {
              acc[field.id] = '';
            }
            return acc;
          }, {}));
       }
    
  }, []);

  const handleInputChange = (id, event) => {
    setFormData({
      ...formData,
      [id]: event.target.value
    });
  };
  let tname = localStorage.getItem('tname')

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
 
    axios.post(`http://localhost:3000/create-answer-table/${tname}`, { formData })
      .then(response => {
        console.log(response.data);
        return   axios.post(`http://localhost:3000/submit-second-form/${tname}`, { formData })
      })
      .then(response => {
        console.log(response.data);
        alert("Data Saved")
        window.location.reload()
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
    <h2 className="text-2xl font-bold mb-4 text-center">{tname}'s Form</h2>
    <form onSubmit={handleSubmit}>
      {formStructure.map((field) => (
        <div key={field.id} className="mb-4">
          {field.type === 'text' && (
            <>
              <label className="block text-gray-700 mb-1">
                {field.value} {field.isRequired ? '(Required)' : ''}
              </label>
              <input
                type="text"
                value={formData[field.id] || ''}
                onChange={(event) => handleInputChange(field.id, event)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required={field.isRequired}
              />
            </>
          )}
          {field.type === 'radio' && (
            <>
              <label className="block text-gray-700 mb-1">{field.value} {field.isRequired ? '(Required)' : ''}</label>
              {field.options.map((option) => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`radio${field.id}`}
                    value={option.value}
                    onChange={(event) => handleInputChange(field.id, event)}
                    className="form-radio"
                    required={field.isRequired}
                  />
                  <span className="ml-2">{option.value}</span>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Form
      </button>
    </form>
  </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Form() {
  let [email, setEmail] = useState('')
  let tname = email.split('@')[0]

  const [inputFields, setInputFields] = useState([{ id: 1, type: 'text', value: '', isRequired: false }]);
  const navigation = useNavigate();

  const handleAddField = (type) => {
    const newId = inputFields.length + 1;
    setInputFields([
      ...inputFields,
      { id: newId, type, value: '', isRequired: false, options: [{ id: 1, value: '' }] }
    ]);
  };

  const handleInputChange = (id, event) => {
    const newInputFields = inputFields.map((inputField) => {
      if (id === inputField.id) {
        inputField.value = event.target.value;
      }
      return inputField;
    });
    setInputFields(newInputFields);
  };

  const handleOptionChange = (fieldId, optionId, event) => {
    const newInputFields = inputFields.map((inputField) => {
      if (fieldId === inputField.id) {
        inputField.options = inputField.options.map((option) => {
          if (optionId === option.id) {
            option[event.target.name] = event.target.value;
          }
          return option;
        });
      }
      return inputField;
    });
    setInputFields(newInputFields);
  };

  const handleAddOption = (fieldId) => {
    const newInputFields = inputFields.map((inputField) => {
      if (fieldId === inputField.id) {
        inputField.options = [...inputField.options, { id: inputField.options.length + 1, value: '' }];
      }
      return inputField;
    });
    setInputFields(newInputFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', inputFields);

    localStorage.setItem('inputFields', JSON.stringify(inputFields));
    localStorage.setItem('tname', tname);

    axios.post(`http://localhost:3000/create-question-table/${tname}`, { inputFields })
      .then(response => {
        console.log(response.data);
        return axios.post(`http://localhost:3000/submit-form/${tname}`, { inputFields });
      })
      .then(response => {
        console.log(response.data);
        navigation('/clientForm'); 
      })
      .catch(error => {
        console.error('There was an error creating the table or submitting the form!', error);
      });
  };

  const toggleRequired = (id) => {
    const newInputFields = inputFields.map((inputField) => {
      if (id === inputField.id) {
        inputField.isRequired = !inputField.isRequired;
      }
      return inputField;
    });
    setInputFields(newInputFields);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Dynamic Form</h2>
      <form onSubmit={handleSubmit}>
        {inputFields.map((inputField) => (
          <div key={inputField.id} className="mb-4">
            {inputField.type === 'text' && (
              <>
                <label className="block text-gray-700 mb-1">
                  Question {inputField.id} {inputField.isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder='Enter Your Question'
                  name={`input${inputField.id}`}
                  value={inputField.value}
                  onChange={(event) => handleInputChange(inputField.id, event)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required={inputField.isRequired}
                />
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={inputField.isRequired}
                      onChange={() => toggleRequired(inputField.id)}
                    />
                    <span className="ml-2">Required</span>
                  </label>
                </div>
              </>
            )}
            {inputField.type === 'radio' && (
              <>
                <label className="block text-gray-700 mb-1">
                  Question {inputField.id} {inputField.isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={`label${inputField.id}`}
                  onChange={(event) => handleInputChange(inputField.id, event)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                  placeholder="Enter Your Question"
                  required={inputField.isRequired}
                />
                {inputField.options.map((option) => (
                  <div key={option.id} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name={`radio${inputField.id}`}
                      value={option.value}
                      className="form-radio"
                      onChange={(event) => handleInputChange(inputField.id, event)}
                     
                    />
                    <input
                      type="text"
                      name="value"
                      value={option.value}
                      onChange={(event) => handleOptionChange(inputField.id, option.id, event)}
                      className="ml-2 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={`Option ${option.id} value`}
                      required={inputField.isRequired}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(inputField.id)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Option
                </button>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={inputField.isRequired}
                      onChange={() => toggleRequired(inputField.id)}
                    />
                    <span className="ml-2">Required</span>
                  </label>
                </div>
              </>
            )}
          </div>
        ))}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => handleAddField('text')}
            className="mr-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Text Question
          </button>
          <button
            type="button"
            onClick={() => handleAddField('radio')}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Radio Question
          </button>
        </div>
        <label className="block text-gray-700 mb-1">
                  Register Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                 onChange={(e)=>setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                  placeholder="Enter Your Email "
                  required
                />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Form
        </button>
      </form>
    </div>
  );
}

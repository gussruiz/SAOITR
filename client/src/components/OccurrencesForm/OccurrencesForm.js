import React from 'react'
import './OccurrencesForm.css';

const OccurrencesForm = () => {
  return (
    <div className='OccurrencesForm-conatiner'>
      <form className='OccurrencesForm-form'>
        <div className='OccurrencesForm-conatiner_input'>
          <label className='OccurrencesForm-label' htmlFor="name">Name:</label>
          <input className='OccurrencesForm-input' type="text" id="name" placeholder="Name" />
        </div>
        <div className='OccurrencesForm-conatiner_input'>
          <label className='OccurrencesForm-label' htmlFor="phone">Phone:</label>
          <input className='OccurrencesForm-input' type="text" id="phone" placeholder="Phone" />
        </div>
        <div className='OccurrencesForm-conatiner_input'>
          <label className='OccurrencesForm-label' htmlFor="option">Option:</label>
          <select className='OccurrencesForm-input OccurrencesForm-label' id="option">
            <option className='OccurrencesForm-option' value="">Select an option</option>
            <option className='OccurrencesForm-option' value="option1">Option 1</option>
            <option className='OccurrencesForm-option' value="option2">Option 2</option>
            <option className='OccurrencesForm-option' value="option3">Option 3</option>
          </select>
        </div>
        <button className='OccurrencesForm-button' type="submit">Submit</button>
      </form>
    </div>
  )
}

export default OccurrencesForm
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect';
import { HealthService } from '../services/HealthService';

import '../styles/DataForm.css';
import '../styles/Background.css';

function UserInfoForm() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    weight: '',
    height: '',
    age: '',
    dietType: '',
    goal: '',
  });

  const [step, setStep] = useState(0);

  //? Used for auto focus when go to next
  let input_fields = useRef(document.getElementsByTagName("input"));

  const submit_data = useCallback(() => {
    HealthService.add(userData);
  }, [userData]);
  
  function back_step() {
    setStep(step - 1);
  }

  const next_step = useCallback(() => {
    if(Object.values(userData).at(step) === '') {
      return;
    }
    if(step < 4) {
      setTimeout(() => {
        input_fields.current[step+1].focus();
      }, 10);
    }
    setStep(step + 1);
  }, [input_fields, step, userData]);


  // Load user data from local storage
  useEffect(() => {
    console.log(input_fields);
    
    const loggedInEmail = localStorage.getItem('email');
    console.log(loggedInEmail);
    if (loggedInEmail) {
      setUserData((prevData) => ({
        ...prevData,
        email: loggedInEmail,
      }));
    }
  }, []);
  
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === "Enter") step < 6?next_step():submit_data();
    });
  }, [next_step, submit_data, step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="bg bg-dataform"></div>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 className='question'>What is your {Object.keys(userData).at(step)}?</h1>
        <p className='count'><span>{step+1}</span>/{Object.keys(userData).length}</p>
        <div className="input-field-container">
          <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" style={{pointerEvents: step===0?"visible":"none", "opacity": step===0?"1":"0"}} />
          <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" style={{pointerEvents: step===1?"visible":"none", "opacity": step===1?"1":"0"}} />
          <input type="number" name="weight" value={userData.weight} onChange={handleChange} placeholder="Weight" style={{pointerEvents: step===2?"visible":"none", "opacity": step===2?"1":"0"}}  />
          <input type="number" name="height" value={userData.height} onChange={handleChange} placeholder="Height" style={{pointerEvents: step===3?"visible":"none", "opacity": step===3?"1":"0"}}  />
          <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" style={{pointerEvents: step===4?"visible":"none", "opacity": step===4?"1":"0"}}  />
          <CustomSelect title={"Select Diet Type"} values={["Vegetarian", "Vegan", "Keto", "Other"]} onChange={handleChange} placeholder={"Diet Type"} style={{pointerEvents: step===5?"visible":"none", "opacity": step===5?"1":"0"}} />
          <input type="text" name="goal" value={userData.goal} onChange={handleChange} placeholder="Fitness Goal" style={{visibility: step===6?"visible":"collapse"}}  />
        </div>
        <button type="button" className='action submit' style={{visibility: step===6?"visible":"collapse"}} onClick={submit_data}>Submit</button>
        <button type="button" className='action next'style={{visibility: step<6?"visible":"collapse"}} onClick={next_step} >Next</button>
        <button type="button" className='action back'style={{visibility: step>0?"visible":"hidden"}} onClick={back_step} >Back</button>
      </form>
      <Link to="/" className="homepage-button">Menu</Link>
      </>
  );
}

export default UserInfoForm;
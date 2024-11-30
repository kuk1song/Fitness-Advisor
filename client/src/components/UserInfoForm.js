import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect';
import { AuthService } from '../services/AuthService';

import '../styles/DataForm.css';
import '../styles/Background.css';

function UserInfoForm() {
  const [userData, setUserData] = useState({
    // name: '',
    // email: '',
    weight: '',
    height: '',
    age: '',
    dietType: '',
    goal: '',
  });

  const [step, setStep] = useState(0);

  //? Used for auto focus when go to next
  let input_fields = useRef(document.getElementsByTagName("input"));

  function backStep() {
    setStep(step - 1);
  }

  const nextStep = useCallback(() => {
    console.log(userData)
    console.log("step:", step)
    if(Object.values(userData).at(step) === '') {
      return;
    }
   
    if(step < 3) {
      setTimeout(() => {
        input_fields.current[step+1].focus();
      }, 10);
    }
    setStep(step + 1);
  }, [input_fields, step, userData]);

  const [userName, setUserName] = useState('');
  useEffect(() => {
    async function loadUserName() {
      const user = await AuthService.getUser();
      if (user) {
        setUserName(user.name);
      }
    }
    loadUserName();
  }, []);
  
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === "Enter") nextStep();
    });
  }, [nextStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if((name === "weight" || name === "height" || name === "age") &&(value < 1)) {
      console.log("stop")
      return;
    }
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
  };

  return (
    <>
      <div className="bg bg-dataform"></div>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Hi, {userName || 'Guest'}!</h1>
        <h1 className='question'>What is your {Object.keys(userData).at(step)}?</h1>
        <div className="input-field-container">
          {/* <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" style={{visibility: step===0?"visible":"collapse"}} />
          <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" style={{visibility: step===1?"visible":"collapse"}} /> */}
          <input type="number" name="weight" value={userData.weight} onChange={handleChange} placeholder="Weight (Lbs)" style={{visibility: step===0?"visible":"collapse"}}  />
          <input type="number" name="height" value={userData.height} onChange={handleChange} placeholder="Height (Meters)" style={{visibility: step===1?"visible":"collapse"}}  />
          <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" style={{visibility: step===2?"visible":"collapse"}}  />
          <CustomSelect title={"Select Diet Type"} values={["Vegetarian", "Vegan", "Keto", "Other"]} onChange={handleChange} placeholder={"Diet Type"} style={{display: step===3?"block":"none"}} />
          {/* <select name="dietType" value={userData.dietType} onChange={handleChange} style={{visibility: step===5?"visible":"collapse"}} >
            <option value="">Select Diet Type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="other">Other</option>
          </select> */}
          <input type="text" name="goal" value={userData.goal} onChange={handleChange} placeholder="Fitness Goal" style={{visibility: step===4?"visible":"collapse"}}  />
        </div>
        <button type="submit" className='submit' style={{visibility: step===5?"visible":"collapse"}} >Submit</button>
        <button type="button" className='action next'style={{visibility: step<5?"visible":"collapse"}} onClick={nextStep} >Next</button>
        <button type="button" className='action back'style={{visibility: step>0?"visible":"hidden"}} onClick={backStep} >Back</button>
      </form>
      <Link to="/" className="homepage-button">Menu</Link>
      </>
  );
}

export default UserInfoForm;
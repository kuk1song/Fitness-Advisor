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
  const [alertVisible, setAlertVisible] = useState(false);

  //? Used for auto focus when go to next
  let input_fields = useRef(document.getElementsByTagName("input"));

  function backStep() {
    setStep(step - 1);
  }

  const nextStep = useCallback(() => {
    console.log(userData)
    console.log("step:", step)
    if (Object.values(userData).at(step) === '') {
      return;
    }
    // Check if user has entered a valid format email
    if (step === 1) {
      const email = userData.email;
      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // If it fails validation then return alert and prevent nextStep
      if (!emailRegex.test(email)) {
        if (!alertVisible) {
          alert('Please enter a valid email address.');
          setAlertVisible(true)
        }
        return
      }
    }
    setAlertVisible(false)
    if (step)
      if (step < 5) {
        setTimeout(() => {
          input_fields.current[step + 1].focus();
        }, 10);
      }
    setStep(step + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const handleEnter = (e) => {
      // Ensure nextStep is only called once per Enter press
      if (e.key === "Enter") {
        e.preventDefault();
        nextStep();
      }
    }
    document.addEventListener('keydown', handleEnter);

    // Remove event listener to avoid duplication
    return () => {
      document.removeEventListener('keydown', handleEnter)
    }
  }, [nextStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "weight" || name === "height" || name === "age") && (value < 1)) {
      console.log("stop")
      return;
    }
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
        <p className='count'><span>{step + 1}</span>/{Object.keys(userData).length}</p>
        <div className="input-field-container">
          <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" style={{ pointerEvents: step === 0 ? "visible" : "none", "opacity": step === 0 ? "1" : "0" }} />
          <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" style={{ pointerEvents: step === 1 ? "visible" : "none", "opacity": step === 1 ? "1" : "0" }} />
          <input type="number" name="weight" value={userData.weight} onChange={handleChange} placeholder="Weight (Lbs)" style={{ pointerEvents: step === 2 ? "visible" : "none", "opacity": step === 2 ? "1" : "0" }} />
          <input type="number" name="height" value={userData.height} onChange={handleChange} placeholder="Height (Meters)" style={{ pointerEvents: step === 3 ? "visible" : "none", "opacity": step === 3 ? "1" : "0" }} />
          <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" style={{ pointerEvents: step === 4 ? "visible" : "none", "opacity": step === 4 ? "1" : "0" }} />
          <CustomSelect title={"Select Diet Type"} values={["Vegetarian", "Vegan", "Keto", "Other"]} onChange={handleChange} placeholder={"Diet Type"} style={{ pointerEvents: step === 5 ? "visible" : "none", "opacity": step === 5 ? "1" : "0" }} />
          <input type="text" name="goal" value={userData.goal} onChange={handleChange} placeholder="Fitness Goal" style={{ visibility: step === 6 ? "visible" : "collapse" }} />
        </div>
        <button type="submit" className='submit' style={{ visibility: step === 6 ? "visible" : "collapse" }} >Submit</button>
        <button type="button" className='action next' style={{ visibility: step < 6 ? "visible" : "collapse" }} onClick={nextStep} >Next</button>
        <button type="button" className='action back' style={{ visibility: step > 0 ? "visible" : "hidden" }} onClick={backStep} >Back</button>
      </form>
      <Link to="/" className="homepage-button">Menu</Link>
    </>
  );
}

export default UserInfoForm;
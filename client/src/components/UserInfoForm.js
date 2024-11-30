import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect';
import { HealthService } from '../services/HealthService';
import { useNavigate } from 'react-router-dom';

import '../styles/DataForm.css';
import '../styles/Background.css';

function UserInfoForm() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    weight: '',
    height: '',
    age: '',
    dietType: '',
    goal: '',
    email: ''
  });

  const [step, setStep] = useState(0);
  const [handlingSubmit, setHandlingSubmit] = useState(false); // Used to check if is currently handling submit or not...

  //? Used for auto focus when go to next
  let input_fields = useRef(document.getElementsByTagName("input"));

  function backStep() {
    setStep(step - 1);
  }

  const nextStep = useCallback(() => {
    // Check if the step is higher than the length (except email so that's why it's - 2)
    if (step >= Object.values(userData).length - 2) {
      handleSubmit();
      return;
    }

    // Check if the user enter a real value or just empty string
    if (Object.values(userData).at(step) === '') {
      return;
    }

    if (step < 2) {
      setTimeout(() => {
        input_fields.current[step + 1].focus();
      }, 10);
    }
    setStep(step + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input_fields, step, userData]);


  // Load user data from local storage
  useEffect(() => {
    const loggedInEmail = localStorage.getItem('email');
    console.log(loggedInEmail);
    if (loggedInEmail) {
      setUserData((prevData) => ({
        ...prevData,
        email: loggedInEmail,
      }));
    }
    else {
      console.error("Email doesn't loaded");
      navigate("/login");
    }
  }, [navigate]);

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

    // It makes the user can put an empty value in order to let them insert another number. (if not it the first number can't be erased! You can try it by yourself. Atleast it is like that in my case..)
    if ((name === "weight" || name === "height" || name === "age") && (value < 1) && value !== "" && isNaN(value)) {
      return;
    }
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    if (e)
      e.preventDefault();

    if (!handlingSubmit) {
      if (userData.email) {
        HealthService.add(userData).then((value) => {
          if (value) {
            alert("Successfully update data!");
          }
          else {
            alert("Update data failed!");
            console.error(value);
          }
        }).catch((err) => {
          alert("Update data failed unexpectedly!");
          console.error(err);
        }).finally(() => {
          setHandlingSubmit(false);
        })

      }
      else {
        console.error("Email doesn't loaded");
      }
    }
  };

  return (
    <>
      <div className="bg bg-dataform"></div>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 className='question'>What is your {Object.keys(userData).at(step)}?</h1>
        <p className='count'><span>{step + 1}</span>/{Object.keys(userData).length - 1}</p>
        <div className="input-field-container">
          <input type="number" name="weight" value={userData.weight} onChange={handleChange} placeholder="Weight (Lbs)" style={{ pointerEvents: step === 0 ? "visible" : "none", "opacity": step === 0 ? "1" : "0" }} />
          <input type="number" name="height" value={userData.height} onChange={handleChange} placeholder="Height (Meters)" style={{ pointerEvents: step === 1 ? "visible" : "none", "opacity": step === 1 ? "1" : "0" }} />
          <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" style={{ pointerEvents: step === 2 ? "visible" : "none", "opacity": step === 2 ? "1" : "0" }} />
          <CustomSelect title={"Select Diet Type"} values={["Vegetarian", "Vegan", "Keto", "Other"]} onChange={handleChange} placeholder={"Diet Type"} style={{ pointerEvents: step === 3 ? "visible" : "none", "opacity": step === 3 ? "1" : "0" }} />
          <input type="text" name="goal" value={userData.goal} onChange={handleChange} placeholder="Fitness Goal" style={{ visibility: step === 4 ? "visible" : "collapse" }} />
        </div>
        <button type="submit" className='submit' style={{ visibility: step === 4 ? "visible" : "collapse" }} >Submit</button>
        <button type="button" className='action next' style={{ visibility: step < 4 ? "visible" : "collapse" }} onClick={nextStep} >Next</button>
        <button type="button" className='action back' style={{ visibility: step > 0 ? "visible" : "hidden" }} onClick={backStep} >Back</button>
      </form>
      <Link to="/" className="homepage-button">Menu</Link>
    </>
  );
}

export default UserInfoForm;
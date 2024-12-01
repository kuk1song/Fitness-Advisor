import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect';
import { AuthService } from '../services/AuthService';

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
  });

  const [step, setStep] = useState(0); // Used to check which step is currently on
  const [handlingSubmit, setHandlingSubmit] = useState(false); // Used to check if is currently handling submit or not...

  // intialize the inputRefs
  const inputRefs = useRef([]);

  const backStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const nextStep = useCallback(() => {
    // Check if the step is higher than the length (except email so that's why it's - 2)
    if (step >= Object.values(userData).length - 2) {
      handleSubmit();
      return;
    }

    // Check if the user enter a real value or just empty string
    const currentValue = Object.values(userData)[step];
    if (!currentValue) {
      console.error('Current step data is empty!');
      return;
    }

    // 自动聚焦到下一个字段
    if (step < Object.keys(userData).length - 2) {
      setTimeout(() => {
        inputRefs.current[step + 1]?.focus();
      }, 10);
    }

    // 进入下一步
    setStep((prev) => prev + 1);
  }, [step, userData]);

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
        <h1>Hi, {userName || 'Guest'}!</h1>
        <h1 className="question">What is your {Object.keys(userData)[step]}?</h1>
        <p className="count">
          <span>{step + 1}</span>/{Object.keys(userData).length}
        </p>
        <div className="input-field-container">
          {Object.keys(userData).map((key, index) => {
            if (key === 'dietType') {
              return (
                <CustomSelect
                  key={key}
                  title="Select Diet Type"
                  values={['Vegetarian', 'Vegan', 'Keto', 'Other']}
                  onChange={(e) => handleChange({ target: { name: key, value: e } })}
                  placeholder="Diet Type"
                  style={{ display: step === index ? 'block' : 'none' }}
                />
              );
            }

            return (
              <input
                key={key}
                ref={(el) => (inputRefs.current[index] = el)}
                type={key === 'goal' ? 'text' : 'number'}
                name={key}
                value={userData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                style={{
                  display: step === index ? 'block' : 'none',
                }}
              />
            );
          })}
        </div>
        <div className="button-group">
          <button
            type="button"
            className="action back"
            style={{ visibility: step > 0 ? 'visible' : 'hidden' }}
            onClick={backStep}
          >
            Back
          </button>
          {step < Object.keys(userData).length - 1 ? (
            <button type="button" className="action next" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit" className="submit">
              Submit
            </button>
          )}
        </div>
      </form>
      <Link to="/" className="homepage-button">
        Menu
      </Link>
    </>
  );
}


export default UserInfoForm;
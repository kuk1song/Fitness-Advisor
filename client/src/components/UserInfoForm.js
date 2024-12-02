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
    activityLevel: '',
    fitnessExperience: '',
    preferredExerciseTypes: '',
    mealFrequency: '',
    sleepHours: '',
    goal: '',
  });

  const [step, setStep] = useState(0); // used to check which step is currently on
  const [handlingSubmit, setHandlingSubmit] = useState(false); // used to check if is currently handling submit or not...

  // intialize the inputRefs
  const inputRefs = useRef([]);

  const totalSteps = Object.keys(userData).length;
  
  // check if the current step is the last step
  const isLastStep = step === totalSteps - 1;
  
  // load the user name
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

  const backStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();  // prevent the default form submission
    if (handlingSubmit) return; // if already handling submit, prevent duplicate submission
    setHandlingSubmit(true);
    
    // check if any fields are missing
    const missingFields = Object.entries(userData).filter(([key, value]) => !value);
    if (missingFields.length > 0) {
      alert(`Please fill out all fields before submitting: ${missingFields.map(([key]) => key).join(', ')}`);
      setHandlingSubmit(false);
      return;
    }

    try {
      const response = await HealthService.add(userData); // submit the health data to the Atlas
      if (!response.success) throw new Error('Failed to submit data');
      alert('Health data successfully submitted!');
      navigate('/calendar'); 
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the data. Please try again.');
    } finally {
      setHandlingSubmit(false);
    }
  }, [userData, handlingSubmit, navigate]);

  const nextStep = useCallback(() => {
    const totalSteps = Object.keys(userData).length;
    
    if (step < totalSteps - 1 ) {
      const currentKey = Object.keys(userData)[step];
      const currentValue = userData[currentKey];
      
      if (!currentValue) {
        alert(`Please fill out: ${currentKey}`);
        return;
      }

      setStep((prev) => prev + 1);

      // auto focus to the next input
      setTimeout(() => {
        inputRefs.current[step + 1]?.focus();
      }, 10);
    }
  }, [step, userData]);

  useEffect(() => {
    const handleEnter = (e) => {
      // ensure nextStep is only called once per Enter press
      if (e.key === "Enter") {
        e.preventDefault();
        if (isLastStep) {
          // if it is the last step, focus on the submit button
          document.querySelector('.submit')?.focus();
        } else {
          nextStep();
        }
      }
    };

    document.addEventListener('keydown', handleEnter);

    // remove event listener to avoid duplication
    return () => {
      document.removeEventListener('keydown', handleEnter)
    }
  }, [nextStep, isLastStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // it makes the user can put an empty value in order to let them insert another number. (if not it the first number can't be erased! You can try it by yourself. At least it is like that in my case..)
    if ((name === "weight" || name === "height" || name === "age") && (value < 1) && value !== "" && isNaN(value)) {
      console.error(`${name} should be a number.`);
      return;
    }
    setUserData({ ...userData, [name]: value });
  };

  return (
    <>
      <div className="bg bg-dataform"></div>
      <form
        onSubmit={handleSubmit}
        style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Hi, {userName || 'Guest'}!</h1>
        <h1 className="question">What is your {Object.keys(userData)[step]}?</h1>
        <p className="count">
          <span>{step + 1} </span>/{Object.keys(userData).length}
        </p>
        <div className="input-field-container">
          {Object.keys(userData).map((key, index) => {
             if (key === 'dietType' || key === 'activityLevel' || key === 'fitnessExperience' || key === 'mealFrequency') {
              const options = {
                dietType: ['Vegetarian', 'Vegan', 'Keto', 'Other'],
                activityLevel: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'],
                fitnessExperience: ['Never', 'Beginner', 'Intermediate', 'Advanced'],
                mealFrequency: ['2-3 meals', '3-5 meals', '6+ meals'],
              };
              return (
                <CustomSelect
                  key={key}
                  title={`Select ${key}`}
                  values={options[key]}
                  onChange={(value) => handleChange({ target: { name: key, value } })}
                  placeholder={`Select ${key}`}
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
          {step < totalSteps - 1 ? (
            <button
              type="button"
              className="action next"
              onClick={nextStep}
            >
              Next
            </button>
          ) : null}
        </div>
        {/* Submit button, only displayed when on the last step */}
        {step === totalSteps - 1 && (
          <button
            type="submit"
            className="submit"
          >
            {handlingSubmit ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form>
      <Link to="/" className="homepage-button">
        Menu
      </Link>
    </>
  );
}

export default UserInfoForm;
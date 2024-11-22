import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);

  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '20px' }}>
      <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" />
      <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" readOnly />
      <input type="number" name="weight" value={userData.weight} onChange={handleChange} placeholder="Weight" />
      <input type="number" name="height" value={userData.height} onChange={handleChange} placeholder="Height" />
      <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" />
      <select name="dietType" value={userData.dietType} onChange={handleChange}>
        <option value="">Select Diet Type</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="keto">Keto</option>
        <option value="other">Other</option>
      </select>
      <input type="text" name="goal" value={userData.goal} onChange={handleChange} placeholder="Fitness Goal" />
      <button type="submit">Submit</button>
      <Link to="/" className="homepage-button">Homepage</Link>
    </form>
  );
}

export default UserInfoForm;
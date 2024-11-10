import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
    // can transform data here before sending to server
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" onChange={handleChange} placeholder="Name" />
      <input type="email" name="email" onChange={handleChange} placeholder="Email" />
      <input type="number" name="weight" onChange={handleChange} placeholder="Weight" />
      <input type="number" name="height" onChange={handleChange} placeholder="Height" />
      <input type="number" name="age" onChange={handleChange} placeholder="Age" />
      <select name="dietType" onChange={handleChange}>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="keto">Keto</option>
        <option value="other">Other</option>
      </select>
      <input type="text" name="goal" onChange={handleChange} placeholder="Fitness Goal" />
      <button type="submit">Submit</button>
      <Link to="/" className="homepage-button">Homepage</Link>
    </form>
  );
}

export default UserInfoForm;
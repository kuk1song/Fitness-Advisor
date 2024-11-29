import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';
import UserInfoForm from './UserInfoForm';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.getUserData(); // get user data from the server
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {/* sned the user data to UserInfoForm */}
      <UserInfoForm initialUserData={user} />
    </div>
  );
}

export default UserProfile;
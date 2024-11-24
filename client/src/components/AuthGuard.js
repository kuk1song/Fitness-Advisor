import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        }
    }, [navigate]);

    return <>{children}</>;
};

export default AuthGuard;

import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/config';

import { Spin } from 'antd';
import { deleteUser } from 'firebase/auth';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                console.log('AuthChange');
                if (isError && user) {
                    deleteUser(user).catch(err => {
                    console.log("AuthProvider.js deleteUser err", err)  
                    })
                }
                if (user) {
                    const { displayName, email, photoURL, uid } = user;
                    setUser({
                        displayName,
                        email,
                        photoURL,
                        uid,
                    });
                    setIsLoading(false)
                    return navigate('/home');
                }
                setIsLoading(false)
                return navigate('/login');
            });
            return () => {
                unsubscribe();
            };
    }, [navigate, isError]);

    const value = { user, setIsError };

    return (
        <AuthContext.Provider value={value}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    );
}

export { AuthContext }
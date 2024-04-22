import React, { useContext, useState } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signin = async (username, password) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_SERVER_BASE}/auth/login`, {
                username: username,
                password: password,
            });

            setUser(res.data.user);
            console.log(res.data.user);
            window.localStorage.setItem('jwt', res.data.jwt);

            return res.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const signout = () => {
        setUser(null);
    };
    return <AuthContext.Provider value={{ user, signout, signin }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
    const authContext = useContext(AuthContext);
    return authContext;
};

export default AuthProvider;

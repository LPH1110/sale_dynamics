import React, { useContext, useState } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signin = async (username, password) => {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_BASE}/auth/login`, {
            username: username,
            password: password,
        });
        setUser(res.data.data.userDTO);
        window.localStorage.setItem('jwt', res.data.data.jwt);

        return res.data;
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

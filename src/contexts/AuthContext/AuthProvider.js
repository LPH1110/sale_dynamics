import React, { useContext, useState } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signin = async (username, password) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER_BASE}/account/login.php?username=${username}&password=${password}`,
            );
            if (res.data) {
                setUser(res.data.user_info);
                console.log(res.data.user_info);
            }

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

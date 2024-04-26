import axios from 'axios';

const request = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE + '/',
});

export const get = async (path, options) => {
    let config = {
        ...options,
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const res = await request.get(path, config);
    return res.data;
};

export const post = async (path, params) => {
    let config = {
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const res = await request.post(path, params, config);
    return res.data;
};

export default request;

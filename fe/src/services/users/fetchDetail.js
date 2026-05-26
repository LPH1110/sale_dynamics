import { request } from '~/utils';

const fetchAccount = async (username) => {
    try {
        const user = await request.get(`user/detail?username=${username}`);
        return user;
    } catch (error) {
        console.error('Failed to fetch user detail', error);
    }
};

export default fetchAccount;

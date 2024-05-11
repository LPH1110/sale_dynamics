const { request } = require('~/utils');

const fetchOrdersByUsername = async (username) => {
    try {
        const res = request.get(`user/orders?username=${username}`);
        return res;
    } catch (error) {
        console.error('Failed to fetch orders by username', error);
    }
};

export default fetchOrdersByUsername;

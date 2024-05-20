const { request } = require('~/utils');

const fetchOrders = async (phone) => {
    try {
        const res = await request.get(`customers/detail/orders?phone=${phone}`);
        return res;
    } catch (error) {
        console.error('Failed to fetch customer orders', error);
    }
};

export default fetchOrders;

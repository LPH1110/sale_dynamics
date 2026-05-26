const { request } = require('~/utils');

const createOrder = async (data) => {
    try {
        const res = request.post('orders/create', data);
        return res;
    } catch (error) {
        console.error('Failed to create new order', error);
    }
};

export default createOrder;

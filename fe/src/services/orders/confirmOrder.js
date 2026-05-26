const { request } = require('~/utils');

const confirmOrder = async (orderId) => {
    try {
        const res = await request.get(`orders/confirm?orderId=${orderId}`);
        return res;
    } catch (error) {
        console.error('Failed to confirm order with id: ' + orderId, error);
    }
};

export default confirmOrder;

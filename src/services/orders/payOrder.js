const { request } = require('~/utils');

const payOrder = async ({ orderId, received, excess, customerOwed }) => {
    try {
        const res = await request.post('orders/payment', { orderId, received, excess, customerOwed });
        return res;
    } catch (error) {
        console.error('Failed to pay order', error);
    }
};

export default payOrder;

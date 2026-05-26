const { request } = require('~/utils');

const findById = async (orderId) => {
    try {
        const res = await request.get(`orders/detail?orderId=${orderId}`);
        return res;
    } catch (error) {
        console.error('Failed to fetch order by id: ' + orderId, error);
    }
};

export default findById;

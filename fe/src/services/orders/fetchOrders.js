import { request } from '~/utils';

const fetchOrders = async () => {
    try {
        const res = request.get('orders');
        return res;
    } catch (error) {
        console.error('Failed to fetch orders', error);
    }
};

export default fetchOrders;

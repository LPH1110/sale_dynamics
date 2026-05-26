import { request } from '~/utils';

const createCustomer = async (data) => {
    try {
        const res = request.post('/customers/create', data);
        return res;
    } catch (error) {
        console.error('Failed to create new customer', error);
    }
};

export default createCustomer;

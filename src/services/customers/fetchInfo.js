import { request } from '~/utils';

const fetchInfo = async (phone) => {
    try {
        const customer = await request.get(`customers/detail?phone=${phone}`);
        return customer;
    } catch (error) {
        console.error('Failed to fetch customer info', error);
    }
};

export default fetchInfo;

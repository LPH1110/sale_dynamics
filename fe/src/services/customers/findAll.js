const { request } = require('~/utils');

const findAll = async () => {
    try {
        const res = request.get('customers');
        return res;
    } catch (error) {
        console.error('Failed to fetch all customers', error);
    }
};

export default findAll;

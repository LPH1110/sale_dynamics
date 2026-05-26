const { request } = require('~/utils');

const saveProduct = async (data) => {
    try {
        const res = await request.update('products/update', data);
        return res;
    } catch (error) {
        console.error('Failed to sava product', error);
    }
};

export default saveProduct;

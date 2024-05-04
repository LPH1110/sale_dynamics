const { request } = require('~/utils');

const findByKeyword = async (infix) => {
    try {
        const res = await request.get(`products/keyword?infix=${infix}`);
        return res;
    } catch (error) {
        console.error('Failed to fetch products by keyword', error);
        return [];
    }
};

export default findByKeyword;

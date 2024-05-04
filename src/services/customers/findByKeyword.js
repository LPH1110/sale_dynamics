const { request } = require('~/utils');

const findByKeyword = async (infix) => {
    try {
        const res = await request.get(`customers/keyword?infix=${infix}`);
        return res;
    } catch (error) {
        console.error('Failed to fetch customers by keyword', error);
    }
};

export default findByKeyword;

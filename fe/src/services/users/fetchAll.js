const { request } = require('~/utils');

const fetchAll = async () => {
    try {
        const users = await request.get('admin/users');
        return users;
    } catch (error) {
        console.log(error);
    }
};

export default fetchAll;

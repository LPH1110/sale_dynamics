const { request } = require('~/utils');

const changePassword = async (username, newPassword) => {
    try {
        const res = await request.post(`user/change-password`, {
            username: username,
            newPassword: newPassword,
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export default changePassword;

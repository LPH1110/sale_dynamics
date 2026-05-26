const authorizeAdmin = (user) => {
    for (let i = 0; i < user.authorities.length; i++) {
        if (user.authorities[i].authority.localeCompare('ADMIN') === 0) return true;
    }
    return false;
};

export default authorizeAdmin;

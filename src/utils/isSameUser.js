const isSameUser = (left, right) => {
    return left?.username.localeCompare(right?.username) === 0;
};

export default isSameUser;

const isSameUser = (left, right) => {
    console.log(left?.username.localeCompare(right?.username) === 0);
    return left?.username.localeCompare(right?.username) === 0;
};

export default isSameUser;

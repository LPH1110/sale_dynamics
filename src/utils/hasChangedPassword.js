const hasChangedPassword = (user) => {
    return user.changedPasswordDate > user.createdDate;
};

export default hasChangedPassword;

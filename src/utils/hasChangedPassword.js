const hasChangedPassword = (user) => {
    console.log(user.changedPasswordDate > user.createdDate);
    return user.changedPasswordDate > user.createdDate;
};

export default hasChangedPassword;

const isTomorrow = (date) => {
    let now = new Date();
    return date.getTime() > now.getTime();
};

export default isTomorrow;

const formatArrayDate = (date) => {
    let year = date[0],
        month = date[1],
        day = date[2],
        hour = date[3],
        minute = date[4],
        second = date[5];
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export default formatArrayDate;

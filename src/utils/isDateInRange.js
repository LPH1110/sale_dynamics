const isDateInRange = (date, start, end) => {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
};

export default isDateInRange;

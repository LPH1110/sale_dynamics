const commasNumber = (amount: Number) => {
    return amount.toLocaleString(undefined, { maximumFractionDigits: 3 });
};

export default commasNumber;

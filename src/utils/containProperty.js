const containProperty = (propertyName, properties) => {
    properties.forEach((property) => {
        if (property.name.localeCompare(propertyName) === 0) return true;
    });
    return false;
};

export default containProperty;

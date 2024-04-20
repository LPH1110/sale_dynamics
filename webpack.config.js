module.exports = {
    resolve: {
        fallback: {
            util: require.resolve('util'),
            path: require.resolve('path-browserify'),
            crypto: false,
        },
    },
};

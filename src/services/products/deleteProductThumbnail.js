const { default: axios } = require('axios');
const { request } = require('~/utils');

const deleteProductThumbnail = async ({ barcode, thumbnailId }) => {
    console.log('In delete product thumbnail: ' + barcode);
    try {
        const response = await request.post('products/delete-thumbnail', {
            barcode: barcode,
            thumbnailId: thumbnailId,
        });
        return response;
    } catch (error) {
        console.error('Failed to remove this thumbnail', error);
    }
};

export default deleteProductThumbnail;

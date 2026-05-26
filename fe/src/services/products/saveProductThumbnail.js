import axios from 'axios';

const saveProductThumbnail = async (barcode, thumbnail) => {
    let formData = new FormData();
    formData.append('barcode', barcode);
    formData.append('thumbnail', thumbnail, thumbnail.name);

    console.log('Saving: ', barcode + ' - ' + thumbnail.name);

    try {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_BASE}/products/save-thumbnail`, formData, {
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('jwt'),
                'Content-Type': 'multipart/form-data;charset=UTF-8',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Failed to save thumbnail', error);
    }
};

export default saveProductThumbnail;

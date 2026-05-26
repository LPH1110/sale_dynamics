import { request } from '~/utils';

const fetchProductDetail = async (barcode) => {
    try {
        const res = await request.get(`products/detail?barcode=${barcode}`);
        return res;
    } catch (error) {
        console.error(error);
    }
};

export default fetchProductDetail;

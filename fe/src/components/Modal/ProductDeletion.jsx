import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ProductDetailContext } from '~/contexts/pool';
import { Spinner } from '~/icons';
import { request } from '~/utils';

const ProductDeletion = ({ setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { productDetail } = useContext(ProductDetailContext);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            await request.get(`products/disable?barcode=${productDetail?.barcode}`);
        } catch (error) {
            toast.warn(error.response.data.message);
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };
    return (
        <div className="w-full space-y-4 px-4">
            <h4 className="text-red-500 text-lg">Disable Product</h4>
            <p className="text-sm">Are you sure to disable this product? There is no undo actions.</p>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-700 transition py-2 px-4"
                    type="button"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="text-red-500 py-2 px-4 rounded-sm hover:bg-red-50 transition ring-1 ring-red-500"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default ProductDeletion;

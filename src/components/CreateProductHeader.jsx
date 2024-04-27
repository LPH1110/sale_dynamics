import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from '~/icons';
import { request } from '~/utils';

const CreateProductHeader = ({ productInfo }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const res = await request.post('products/save', JSON.stringify(productInfo));
            toast.success('Create new product successfully');
            navigate(`/products/detail/${productInfo.barcode}`);
        } catch (error) {
            toast.error('Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <header className="bg-white p-4 flex items-center justify-center border-b">
            <div className="container flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create new product</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/products')}
                        type="button"
                        className="border rounded-sm py-2 px-4 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-500 min-w-[4rem] hover:bg-blue-600 rounded-sm transition text-white font-semibold py-2 px-4"
                    >
                        {isLoading ? <Spinner /> : 'Save'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default CreateProductHeader;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const VariantProductCard = ({ productId }) => {
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/products/get_by_id.php?product_id=${productId}`,
                );

                if (product.data) {
                    setProduct(product.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        // fetchProduct()
    }, [productId]);
    return (
        <div className="bg-white p-4 rounded-sm shadow-md">
            <div className="flex items-center gap-4">
                <div className="border rounded-md w-12 h-12 bg-gray-300"></div>
                <div className="text-sm">
                    <h4 className="font-semibold">Product name</h4>
                    <p className="my-1 text-gray-500">0 variants</p>
                    <Link
                        to={`/products/detail/${productId}`}
                        className="text-blue-500 flex items-center gap-1 text-xs hover:text-blue-600 transition hover:underline"
                    >
                        <ArrowLeftIcon className="w-3 h-3" />
                        Product detail
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VariantProductCard;

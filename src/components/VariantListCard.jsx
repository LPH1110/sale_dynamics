import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
const VariantListCard = ({ productId }) => {
    const [variants, setVariants] = useState([
        {
            id: uuidv4(),
            name: 'Default title',
        },
        {
            id: uuidv4(),
            name: 'Default title',
        },
        {
            id: uuidv4(),
            name: 'Default title',
        },
    ]);

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const variants = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/variants/get_by_product_id.php?product_id=${productId}`,
                );

                if (variants.data) {
                    setVariants(variants.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        // fetchVariants()
    }, [productId]);
    return (
        <div className="bg-white p-4 rounded-sm shadow-md">
            <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                List of variants
            </label>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="space-y-4">
                {variants.map((variant) => (
                    <Link to={`/products/${productId}/variants/${variant.id}`} className="flex gap-4 hover:opacity-80">
                        <div className="border rounded-md w-12 h-12 bg-gray-300"></div>
                        <div>
                            <h4 className="font-semibold text-sm">{variant.name}</h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VariantListCard;

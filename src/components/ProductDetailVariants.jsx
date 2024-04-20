import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { actions, useStore } from '~/store';
import axios from 'axios';

const VariantRow = ({ data }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <input className="w-4 h-4" type="checkbox" />
                <div className="relative w-12 h-12 rounded-sm border bg-gray-100 text-gray-500">
                    <PhotoIcon className="w-5 h-5 absolute inset-0 max-w-full max-h-full inline-block m-auto" />
                </div>
                <Link className="text-blue-500 hover:text-blue-600 hover:underline transition text-sm">
                    Default title
                </Link>
            </div>
            <div className="text-end space-y-1">
                <p className="text-sm font-semibold">
                    0 <span className="underline">đ</span>
                </p>
                <p className="text-xs text-gray-500">0 available at 1 warehouse</p>
            </div>
        </div>
    );
};

const ProductDetailVariants = ({ productId, setOpenModal, setModalAction }) => {
    const [variants, setVariants] = useState([1, 2, 3]);
    const [state, dispatch] = useStore();
    const { productChanges } = state;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/variants/get_by_product_id.php?product_id=${productId}`,
                );
                if (res.data) {
                    setVariants(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        // fetchVariants()
    }, []);

    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center justify-between">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Variants
                </label>
                <button
                    type="button"
                    className="text-sm hover:underline font-semibold text-blue-500 transition"
                    onClick={() => {
                        if (Object.keys(productChanges).length > 0) {
                            setModalAction('confirm-cancel-product-updates');
                            setOpenModal(true);
                            dispatch(actions.setCancelProductChangesOption(`/products/1/variant-new`));
                        } else {
                            navigate(`/products/1/variant-new`);
                        }
                    }}
                >
                    Add new variant
                </button>
            </div>
            {/* Spacer */}
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="flex gap-3 text-sm items-center">
                <label className="font-semibold">Batch select:</label>
                {/* Select buttons */}
                <div className="flex items-center gap-4">
                    <button className="text-blue-500 hover:underline font-semibold" type="button">
                        Select all
                    </button>
                    <button className="text-blue-500 hover:underline font-semibold" type="button">
                        Unselect
                    </button>
                </div>
                {/* Variant titles */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="text-white bg-gray-400 hover:bg-blue-100 hover:text-blue-600 hover:underline transition p-1.5 rounded-sm"
                    >
                        Default title
                    </button>
                </div>
            </div>
            {/* Body */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-4">
                    <input type="checkbox" className="w-4 h-4" />
                    <h4 className="font-semibold text-sm">1 variants</h4>
                </div>
                <button
                    type="button"
                    className="hover:text-blue-500 transition hover:shadow-sm flex gap-2 items-center justify-center text-sm px-3 py-2 rounded-sm border bg-white"
                >
                    <PencilIcon className="w-4 h-4" /> Edit variant <ChevronDownIcon className="w-4 h-4" />
                </button>
            </div>
            {/* Spacer */}
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            {/* variants go here */}
            <div className="space-y-4">
                {variants.map((variant) => (
                    <Fragment key={variant}>
                        <VariantRow data={variant} />
                    </Fragment>
                ))}
            </div>
            {/* Spacer */}
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <p className="text-end">Total at all warehouses: 0 available</p>
        </section>
    );
};

export default ProductDetailVariants;

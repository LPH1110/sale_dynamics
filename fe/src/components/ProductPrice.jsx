import { useEffect, useState } from 'react';
import { Tooltip } from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { QuestionMarkCircleIcon } from '~/icons';
import { authorizeAdmin } from '~/utils';

const ProductPrice = ({ productDetail, setProductDetail }) => {
    const { user } = UserAuth();
    const handleChange = (propName, value) => {
        if (Number(value) && productDetail[propName] !== Number(value)) {
            setProductDetail((prev) => ({
                ...prev,
                [propName]: Number(value),
            }));
        }
    };
    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Price
                </label>
            </div>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                        <label htmlFor="salePrice" className="font-semibold block text-sm text-gray-600">
                            Sale price
                        </label>
                        <Tooltip placement="top" message="The price sold to customers">
                            <button type="button" className="w-4 h-4 text-blue-500">
                                <QuestionMarkCircleIcon />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="space-y-2 ">
                        <input
                            className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="salePrice"
                            id="salePrice"
                            readOnly={!authorizeAdmin(user)}
                            defaultValue={productDetail?.salePrice}
                            onBlur={(e) => handleChange('salePrice', e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                        <label htmlFor="comparedPrice" className="font-semibold block text-sm text-gray-600">
                            Compared price
                        </label>
                        <Tooltip
                            placement="top"
                            message="The price hasn't been applied sale offers and must be higher than sale price"
                        >
                            <button type="button" className="w-4 h-4 text-blue-500">
                                <QuestionMarkCircleIcon />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="space-y-2">
                        <input
                            className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="comparedPrice"
                            id="comparedPrice"
                            readOnly={!authorizeAdmin(user)}
                            autoComplete="off"
                            defaultValue={productDetail?.comparedPrice}
                            onBlur={(e) => handleChange('comparedPrice', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPrice;

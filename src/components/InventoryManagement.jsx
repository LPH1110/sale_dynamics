import React from 'react';
import { Tooltip } from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { QuestionMarkCircleIcon } from '~/icons';
import { authorizeAdmin } from '~/utils';

const InventoryManagement = ({ productDetail, setProductDetail }) => {
    const { user } = UserAuth();
    const handleChange = (propName, value) => {
        if (productDetail[propName].localeCompare(value) !== 0) {
            setProductDetail((prev) => ({
                ...prev,
                [propName]: value,
            }));
        }
    };
    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Inventory management
                </label>
            </div>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                        <label htmlFor="provider" className="font-semibold block text-sm text-gray-600">
                            SKU
                        </label>
                        <Tooltip
                            placement="top"
                            message="SKU - Product id should be unique, including letters and numbers"
                        >
                            <button type="button" className="w-4 h-4 text-blue-500">
                                <QuestionMarkCircleIcon />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                        <input
                            readOnly={!authorizeAdmin(user)}
                            onBlur={(e) => handleChange('sku', e.target.value)}
                            className="w-full"
                            defaultValue={productDetail?.sku}
                            type="text"
                            name="sku"
                            id="sku"
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                        <label htmlFor="productType" className="font-semibold block text-sm text-gray-600">
                            Barcode
                        </label>
                        <Tooltip placement="top" message="Barcode is provided by producers">
                            <button type="button" className="w-4 h-4 text-blue-500">
                                <QuestionMarkCircleIcon />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="space-y-2">
                        <input
                            readOnly={!authorizeAdmin(user)}
                            onBlur={(e) => handleChange('barcode', e.target.value)}
                            className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="barcode"
                            defaultValue={productDetail?.barcode}
                            id="barcode"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InventoryManagement;

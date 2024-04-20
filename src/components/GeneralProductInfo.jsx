import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { SearchPopper } from '~/components';
import { ChevronDownIcon } from '~/icons';
import { actions, useStore } from '~/store';

const providers = [
    {
        title: 'Lixibox',
    },
    {
        title: 'Noritake',
    },
    {
        title: 'Limousine',
    },
    {
        title: 'default',
    },
];

const productTypes = [
    {
        title: 'clothe',
    },
    {
        title: 'shoes',
    },
    {
        title: 'default',
    },
];

const GeneralProductInfo = ({ ref, productDetail, handleChangeProductInfo, formik }) => {
    const [state, dispatch] = useStore();
    const [createProvider, setCreateProvider] = useState('default');
    const [createCategory, setCreateCategory] = useState('default');

    const setValue = (propName, value) => {
        dispatch(actions.addProductChanges({ propName, value }));
        dispatch(actions.setProductDetail({ [propName]: value }));
    };

    const handleOnBlur = useCallback(
        (propName, value) => {
            if (propName && productDetail[propName].localeCompare(value) !== 0) {
                dispatch(actions.addProductChanges({ propName, value }));
            }
        },
        [dispatch, productDetail],
    );

    return (
        <section className="bg-white rounded-sm shadow-md border p-4 space-y-4">
            <h4 className="font-semibold">General information</h4>
            <div className="h-[1px] w-full bg-gray-300"></div>
            <div className="py-2 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="productName" className="font-semibold block text-sm text-gray-600">
                        Product name
                    </label>
                    {formik ? (
                        <input
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="productName"
                            id="productName"
                            ref={ref}
                            autoComplete="off"
                            onChange={formik?.handleChange}
                            onBlur={(e) => handleChangeProductInfo('name', e.target.value)}
                            value={formik?.values.productName}
                        />
                    ) : (
                        <input
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="productName"
                            id="productName"
                            autoComplete="off"
                            defaultValue={productDetail.name}
                            onBlur={(e) => handleOnBlur('name', e.target.value)}
                        />
                    )}
                    {formik?.errors.productName ? (
                        <div className="text-sm text-red-500">{formik?.errors.productName}</div>
                    ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                        <label htmlFor="provider" className="font-semibold block text-sm text-gray-600">
                            Provider
                        </label>
                        <SearchPopper
                            value={productDetail?.provider || createProvider}
                            items={providers}
                            setValue={(value) => {
                                if (productDetail) {
                                    setValue('provider', value);
                                } else {
                                    setCreateProvider(value);
                                    handleChangeProductInfo('provider', value);
                                }
                            }}
                        >
                            <div className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                <input
                                    className="w-full"
                                    value={productDetail?.provider || createProvider}
                                    readOnly
                                    type="text"
                                    name="provider"
                                    id="provider"
                                    autoComplete="off"
                                />
                                <button type="button" className="w-4 h-4">
                                    <ChevronDownIcon />
                                </button>
                            </div>
                        </SearchPopper>
                    </div>
                    <div className="space-y-2 w-full">
                        <label htmlFor="productType" className="font-semibold block text-sm text-gray-600">
                            Product type
                        </label>
                        <SearchPopper
                            value={productDetail?.category || createCategory}
                            items={productTypes}
                            setValue={(value) => {
                                if (productDetail) {
                                    setValue('category', value);
                                } else {
                                    setCreateCategory(value);
                                    handleChangeProductInfo('category', value);
                                }
                            }}
                        >
                            <div className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                <input
                                    className="w-full"
                                    type="text"
                                    readOnly
                                    value={productDetail?.category || createCategory}
                                    name="category"
                                    id="category"
                                    autoComplete="off"
                                />
                                <button type="button" className="w-4 h-4">
                                    <ChevronDownIcon />
                                </button>
                            </div>
                        </SearchPopper>
                    </div>
                </div>
                <div className="space-y-2 w-full">
                    <label className="font-semibold block text-sm text-gray-600" htmlFor="description">
                        Product Description
                    </label>
                    <textarea
                        className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition"
                        name="description"
                        id="description"
                        placeholder="Write a description for this product"
                        cols="30"
                        rows="10"
                        autoComplete="off"
                        onBlur={(e) => {
                            if (productDetail) {
                                handleOnBlur('description', e.target.value);
                            } else {
                                handleChangeProductInfo('description', e.target.value);
                            }
                        }}
                    ></textarea>
                </div>
            </div>
        </section>
    );
};

export default GeneralProductInfo;

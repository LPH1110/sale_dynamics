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

const GeneralProductInfo = ({ ref, productDetail, setProductChanged, handleChangeProductInfo, formik }) => {
    const [fields, setFields] = useState({
        name: '',
        description: '',
        provider: '',
        category: '',
    });

    const handleChange = (key, value) => {
        setFields((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
        setProductChanged(true);
    };

    useEffect(() => {
        if (productDetail !== null) {
            setFields({
                name: productDetail?.name,
                description: productDetail?.description,
                provider: productDetail?.provider,
                category: productDetail?.category,
            });
        }
    }, [productDetail]);

    return (
        <section className="bg-white rounded-sm shadow-md border p-4 space-y-4">
            <h4 className="font-semibold">General information</h4>
            <div className="h-[1px] w-full bg-gray-300"></div>
            <div className="py-2 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="font-semibold block text-sm text-gray-600">
                        Product name
                    </label>
                    {formik ? (
                        <input
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="name"
                            id="name"
                            ref={ref}
                            autoComplete="off"
                            onChange={formik?.handleChange}
                            value={formik?.values.name}
                        />
                    ) : (
                        <input
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            value={fields.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    )}
                    {formik?.errors.name ? <div className="text-sm text-red-500">{formik?.errors.name}</div> : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                        <label htmlFor="provider" className="font-semibold block text-sm text-gray-600">
                            Provider
                        </label>
                        <SearchPopper
                            value={fields.provider}
                            items={providers}
                            setValue={(value) => {
                                handleChange('provider', value);
                            }}
                        >
                            <div className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                <input
                                    className="w-full"
                                    value={fields.provider}
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
                            value={fields.category}
                            items={productTypes}
                            setValue={(value) => {
                                handleChange('category', value);
                            }}
                        >
                            <div className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                <input
                                    className="w-full"
                                    type="text"
                                    readOnly
                                    value={fields.category}
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
                        value={fields.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    ></textarea>
                </div>
            </div>
        </section>
    );
};

export default memo(GeneralProductInfo);

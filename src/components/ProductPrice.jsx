import { useState } from 'react';
import { Tooltip } from '~/components';
import { QuestionMarkCircleIcon } from '~/icons';

const ProductPrice = ({
    initial = {
        salePrice: 0,
        comparedPrice: 0,
    },
    title = 'Product price',
    formik,
    handleChangeProductInfo,
}) => {
    const [salePrice, setSalePrice] = useState(initial.salePrice);
    const [comparedPrice, setComparedPrice] = useState(initial.comparedPrice);

    const handleOnBlur = (propName, value) => {
        if (initial[propName] !== value) {
            handleChangeProductInfo(propName, value);
        }
    };
    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    {title}
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
                        {formik ? (
                            <input
                                onBlur={(e) => handleOnBlur('salePrice', Number(e.target.value.replaceAll(' ', '')))}
                                className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                name="salePrice"
                                id="salePrice"
                                autoComplete="off"
                                onChange={formik?.handleChange}
                                value={formik?.values.salePrice}
                            />
                        ) : (
                            <input
                                onBlur={(e) => handleOnBlur('salePrice', Number(e.target.value.replaceAll(' ', '')))}
                                className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                name="salePrice"
                                id="salePrice"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                autoComplete="off"
                            />
                        )}

                        {formik?.errors.salePrice ? (
                            <div className="text-sm text-red-500">{formik.errors.salePrice}</div>
                        ) : null}
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
                        {formik ? (
                            <input
                                onBlur={(e) =>
                                    handleOnBlur('comparedPrice', Number(e.target.value.replaceAll(' ', '')))
                                }
                                className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                name="comparedPrice"
                                id="comparedPrice"
                                autoComplete="off"
                                onChange={formik.handleChange}
                                value={formik.values.comparedPrice}
                            />
                        ) : (
                            <input
                                onBlur={(e) =>
                                    handleOnBlur('comparedPrice', Number(e.target.value.replaceAll(' ', '')))
                                }
                                className="w-full border p-2 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                name="comparedPrice"
                                id="comparedPrice"
                                autoComplete="off"
                                value={comparedPrice}
                                onChange={(e) => setComparedPrice(e.target.value)}
                            />
                        )}

                        {formik?.errors.comparedPrice ? (
                            <div className="text-sm text-red-500">{formik.errors.comparedPrice}</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPrice;

import { SearchPopper } from '~/components';
import { ChevronDownIcon } from '~/icons';

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

const GeneralProductInfo = ({ productDetail, setProductChanged, setProductDetail }) => {
    const handleChange = (propName, value) => {
        if (productDetail[propName].localeCompare(value) !== 0) {
            setProductDetail((prev) => ({
                ...prev,
                [propName]: value,
            }));
        }
        if (setProductChanged) {
            setProductChanged(true);
        }
    };

    return (
        <section className="bg-white rounded-sm shadow-md border p-4 space-y-4">
            <h4 className="font-semibold">General information</h4>
            <div className="h-[1px] w-full bg-gray-300"></div>
            <div className="py-2 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="font-semibold block text-sm text-gray-600">
                        Product name
                    </label>
                    <input
                        className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="off"
                        defaultValue={productDetail?.name}
                        onBlur={(e) => handleChange('name', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                        <label htmlFor="provider" className="font-semibold block text-sm text-gray-600">
                            Provider
                        </label>
                        <SearchPopper
                            value={productDetail?.provider}
                            items={providers}
                            setValue={(value) => handleChange('provider', value)}
                        >
                            <div className="flex items-center border p-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                <input
                                    className="w-full"
                                    value={productDetail?.provider}
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
                            value={productDetail?.category}
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
                                    value={productDetail?.category}
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
                        defaultValue={productDetail?.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    ></textarea>
                </div>
            </div>
        </section>
    );
};

export default GeneralProductInfo;

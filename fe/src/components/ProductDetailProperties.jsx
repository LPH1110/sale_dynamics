import { PlusIcon } from '@heroicons/react/24/outline';
import { Fragment, memo } from 'react';
import ProductDetailProperty from './ProductDetailProperty';

const ProductDetailProperties = ({ productDetail, setProductDetail, setProductChanged }) => {
    const handleDeleteProperty = (propName) => {
        setProductDetail((prev) => {
            let next = prev.properties.filter((property) => property?.name.localeCompare(propName) !== 0);
            return {
                ...prev,
                properties: next,
            };
        });
        if (setProductChanged) {
            setProductChanged(true);
        }
    };

    const handleAddProperty = () => {
        if (productDetail?.properties.length < 3) {
            setProductDetail((prev) => {
                let sampleName = 'Sample title';
                let newProperty = { name: sampleName, tags: ['sample tag'] };
                let next = [...prev.properties, newProperty];
                return {
                    ...prev,
                    properties: next,
                };
            });
            if (setProductChanged) {
                setProductChanged(true);
            }
        }
    };

    const handleSaveProperty = (index, newName, tags) => {
        setProductDetail((prev) => {
            let next = [...prev.properties];
            next[index] = { name: newName, tags: tags };
            return {
                ...prev,
                properties: next,
            };
        });
        if (setProductChanged) {
            setProductChanged(true);
        }
    };

    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Properties
                </label>
            </div>
            {/* Spacer */}
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>

            <div className="space-y-4">
                {/* Property blocks go here */}
                <div className="space-y-6">
                    {productDetail?.properties.map((property, index) => {
                        return (
                            <Fragment key={index}>
                                <ProductDetailProperty
                                    index={index}
                                    handleDeleteProperty={handleDeleteProperty}
                                    handleSaveProperty={handleSaveProperty}
                                    property={property}
                                    setProductDetail={setProductDetail}
                                    setProductChanged={setProductChanged}
                                />
                            </Fragment>
                        );
                    })}
                </div>
                <div className="h-[1px] my-4 w-full bg-gray-100"></div>
                {productDetail?.properties.length < 3 && (
                    <button
                        type="button"
                        onClick={handleAddProperty}
                        className="hover:text-blue-600 transition text-blue-500 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" /> Add more property
                    </button>
                )}
            </div>
        </section>
    );
};

export default memo(ProductDetailProperties);

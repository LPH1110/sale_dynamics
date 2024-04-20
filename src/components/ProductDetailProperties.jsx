import { PlusIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { actions, useStore } from '~/store';
import ProductProperty from './ProductProperty';
import axios from 'axios';

const ProductDetailProperties = ({ productDetail }) => {
    const [, dispatch] = useStore();
    const [properties, setProperties] = useState([]);

    const handleDeleteProperty = (propIndex) => {
        let next = productDetail.properties.filter((property, index) => index !== propIndex);
        dispatch(actions.addProductChanges({ propName: 'properties', value: [...next] }));
        dispatch(actions.setProductDetail({ properties: next }));
    };

    const handleAddProperty = () => {
        if (productDetail.properties.length < 3) {
            let sampleName = 'Sample title';
            let newProperty = { name: sampleName, tags: ['sample tag'] };
            let next = [...productDetail.properties, newProperty];
            dispatch(
                actions.addProductChanges({
                    propName: 'properties',
                    value: [...productDetail.properties, newProperty],
                }),
            );
            dispatch(actions.setProductDetail({ properties: next }));
        }
    };

    const handleSaveProperty = (index, newName, tags) => {
        let next = [...productDetail.properties];
        next[index] = { name: newName, tags: tags };
        dispatch(actions.addProductChanges({ propName: 'properties', value: next }));
        dispatch(actions.setProductDetail({ properties: next }));
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/properties/get_by_product_id.php?product_id=${productDetail.product_id}`,
                );
                if (res.data) {
                    setProperties(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        // fetchProperties()
    }, []);

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
                    {productDetail.properties.map((property, index) => {
                        return (
                            <Fragment key={index}>
                                <ProductProperty
                                    index={index}
                                    handleDeleteProperty={handleDeleteProperty}
                                    handleSaveProperty={handleSaveProperty}
                                    propertyName={property.name}
                                    tags={property.tags}
                                />
                            </Fragment>
                        );
                    })}
                </div>
                <div className="h-[1px] my-4 w-full bg-gray-100"></div>
                {productDetail.properties.length < 3 && (
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

export default ProductDetailProperties;

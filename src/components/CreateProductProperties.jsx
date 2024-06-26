import { Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import { CreateProductProperty } from '~/components';

const CreateProductProperties = ({ properties, setProductInfo }) => {
    const [showProperties, setShowProperties] = useState(false);

    const handleAddProperty = () => {
        setProductInfo((prev) => ({
            ...prev,
            properties: [
                ...prev.properties,
                {
                    name: 'Sample title',
                    tags: [],
                },
            ],
        }));
    };

    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Properties
                </label>
            </div>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <input
                        onChange={(e) => setShowProperties(!showProperties)}
                        type="checkbox"
                        name="propertycb"
                        id="propertycb"
                    />
                    <label htmlFor="propertycb" className="text-sm">
                        This product has many categories (such as color, size,...)
                    </label>
                </div>
                <Transition
                    as={Fragment}
                    show={showProperties}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div>
                        {/* Heading labels */}
                        <div className="grid grid-cols-4 gap-8 mb-4">
                            <label className="font-semibold block text-sm text-gray-600">Properties</label>
                            <label className="font-semibold block text-sm text-gray-600 col-span-2">Tags</label>
                        </div>
                        {/* Property blocks go here */}
                        <div className="space-y-6">
                            {properties.map((property, index) => {
                                return (
                                    <CreateProductProperty
                                        index={index}
                                        property={property}
                                        setProductInfo={setProductInfo}
                                    />
                                );
                            })}
                        </div>
                        <div className="h-[1px] my-4 w-full bg-gray-100"></div>
                        {properties.length < 3 && (
                            <button
                                type="button"
                                onClick={handleAddProperty}
                                className="hover:text-blue-600 transition text-blue-500 font-semibold text-sm flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" /> Add more property
                            </button>
                        )}
                    </div>
                </Transition>
            </div>
        </section>
    );
};

export default CreateProductProperties;

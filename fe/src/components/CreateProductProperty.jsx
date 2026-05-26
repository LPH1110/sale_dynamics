import { TrashIcon } from '@heroicons/react/24/outline';
import { Fragment, useRef, useState } from 'react';
import { ProductSavedProperty } from '~/components';
import ProductPropertyTag from './ProductPropertyTag';
import Tooltip from './Tooltip';

const CreateProductProperty = ({ index, property, setProductInfo }) => {
    const [propName, setPropName] = useState(property.name);
    const [saved, setSaved] = useState(true);
    const addTagInput = useRef();

    const handleDeleteTag = (tagIndex) => {
        setProductInfo((prev) => {
            let newProperties = prev.properties;
            newProperties[index].tags = newProperties[index].tags.filter((tag, index) => index !== tagIndex);
            return { ...prev, properties: [...newProperties] };
        });
    };

    const handleChangeTag = (tagIndex, value) => {
        setProductInfo((prev) => {
            if (prev.properties[index].tags[tagIndex].localeCompare(value) !== 0) {
                let newProperties = prev.properties;
                newProperties[index].tags[tagIndex] = value;
                return { ...prev, properties: [...newProperties] };
            }
            return prev;
        });
    };

    const handleDeleteProperty = (propIndex) => {
        setProductInfo((prev) => {
            let newProperties = prev.properties.filter((prop, index) => index !== propIndex);
            return {
                ...prev,
                properties: [...newProperties],
            };
        });
        setSaved(true);
    };

    const handleChangePropertyName = (value) => {
        setProductInfo((prev) => {
            if (prev.properties[index].name.localeCompare(value) !== 0) {
                let newProperties = prev.properties;
                newProperties[index].name = value;
                return {
                    ...prev,
                    properties: [...newProperties],
                };
            }
            return prev;
        });
    };

    const handleAddTag = (value) => {
        if (value !== '') {
            setProductInfo((prev) => {
                let newProperties = prev.properties;
                newProperties[index].tags = [...newProperties[index].tags, value];
                return {
                    ...prev,
                    properties: [...newProperties],
                };
            });
            addTagInput.current.value = '';
            addTagInput.current.focus();
        }
    };

    return saved ? (
        <Fragment key={propName}>
            <ProductSavedProperty propertyName={property.name} tags={property.tags} setSaved={setSaved} />
        </Fragment>
    ) : (
        <Fragment key={propName}>
            <div className="grid grid-cols-4 gap-8">
                <div className="flex items-start gap-3">
                    <input
                        id={propName}
                        name={propName}
                        type="text"
                        defaultValue={property.name}
                        onBlur={(e) => handleChangePropertyName(e.target.value)}
                        autoComplete="off"
                        className="border w-full p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition"
                    />
                    <Tooltip placement="top" message="Delete this property">
                        <button
                            onClick={() => handleDeleteProperty(index)}
                            type="button"
                            className="text-red-500 hover:bg-red-50 p-3 rounded-md"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
                <div className="col-span-2 gap-4 flex flex-col">
                    {property.tags.map((tag, index) => {
                        return (
                            <Fragment key={tag}>
                                <ProductPropertyTag
                                    handleDeleteTag={handleDeleteTag}
                                    handleChangeTag={handleChangeTag}
                                    tag={tag}
                                    index={index}
                                />
                            </Fragment>
                        );
                    })}
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            id="add_new_tag"
                            name="add_new_tag"
                            placeholder="Enter new tag"
                            autoComplete="off"
                            ref={addTagInput}
                            onBlur={(e) => handleAddTag(e.target.value)}
                            className="w-full border p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition"
                        />
                        <div className="w-4 h-4"></div>
                    </div>
                </div>
            </div>
            {/* Save button goes here */}
            <div className="grid grid-cols-4 gap-8">
                <div></div>
                <div className="col-span-2">
                    <button
                        type="button"
                        onClick={() => setSaved(true)}
                        className="py-2 px-4 border border-blue-500 text-blue-500 rounded-md text-sm hover:bg-blue-500 hover:text-white transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default CreateProductProperty;

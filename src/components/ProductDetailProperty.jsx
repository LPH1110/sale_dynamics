import { TrashIcon } from '@heroicons/react/24/outline';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { ProductSavedProperty } from '~/components';
import ProductPropertyTag from './ProductPropertyTag';
import Tooltip from './Tooltip';

const ProductProperty = ({
    index,
    property,
    handleSaveProperty,
    handleDeleteProperty,
    setProductDetail,
    setProductChanged,
}) => {
    const [saved, setSaved] = useState(true);
    const addTagInput = useRef();

    const handleChangeNewTag = (e) => {
        let newTagInput = e.target;
        if (newTagInput.value !== '' && ((newTagInput && e.keyCode === 13) || e.type === 'blur')) {
            handleAddTag(newTagInput.value);
            newTagInput.value = '';
            newTagInput.focus();
        }
    };

    const handleChangeTag = (tagIndex, value) => {
        setProductDetail((prev) => {
            let next = prev.properties;
            next[index].tags[tagIndex] = value;
            return {
                ...prev,
                properties: next,
            };
        });
        setProductChanged(true);
    };

    const handleAddTag = (newTag) => {
        setProductDetail((prev) => {
            let next = prev.properties;
            next[index].tags = [...next[index].tags, newTag];
            return {
                ...prev,
                properties: next,
            };
        });
        setProductChanged(true);
    };

    const handleDeleteTag = (targetTag) => {
        setProductDetail((prev) => {
            let next = prev.properties;
            next[index].tags = next[index].tags.filter((tag) => tag !== targetTag);
            return {
                ...prev,
                properties: next,
            };
        });
        setProductChanged(true);
    };

    const handleChangePropertyName = (value) => {
        setProductDetail((prev) => {
            let next = prev.properties;
            next[index].name = value;
            return {
                ...prev,
                properties: next,
            };
        });
        setProductChanged(true);
    };

    return saved ? (
        <Fragment key={property?.name}>
            <ProductSavedProperty property={property} setSaved={setSaved} />
        </Fragment>
    ) : (
        <Fragment key={property?.name}>
            <div className="grid grid-cols-4 gap-8">
                <div className="flex items-start gap-3">
                    <input
                        id={property?.name}
                        name={property?.name}
                        type="text"
                        defaultValue={property?.name}
                        autoComplete="off"
                        onBlur={(e) => handleChangePropertyName(e.target.value)}
                        className="border w-full p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition"
                    />
                    <Tooltip placement="top" message="Delete this property">
                        <button
                            onClick={() => handleDeleteProperty(property?.name)}
                            type="button"
                            className="text-red-500 hover:bg-red-50 p-3 rounded-md"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
                <div className="col-span-2 gap-4 flex flex-col">
                    {property?.tags.map((tag, index) => {
                        return (
                            <Fragment key={tag}>
                                <ProductPropertyTag
                                    tag={tag}
                                    index={index}
                                    handleDeleteTag={handleDeleteTag}
                                    handleChangeTag={handleChangeTag}
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
                            onBlur={handleChangeNewTag}
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
                        onClick={() => {
                            handleSaveProperty(index, property?.name, property.tags);
                            console.log(addTagInput.current.value);
                            if (addTagInput.current.value !== '') {
                                handleAddTag(addTagInput.current.value);
                            }
                            setSaved(true);
                        }}
                        className="py-2 px-4 border border-blue-500 text-blue-500 rounded-md text-sm hover:bg-blue-500 hover:text-white transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default memo(ProductProperty);

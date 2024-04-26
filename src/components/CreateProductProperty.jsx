import { TrashIcon } from '@heroicons/react/24/outline';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { ProductSavedProperty } from '~/components';
import ProductPropertyTag from './ProductPropertyTag';
import Tooltip from './Tooltip';
import { actions, useStore } from '~/store';
import axios from 'axios';

const CreateProductProperty = ({ index, property, handleSaveProperty, handleDeleteProperty }) => {
    const [propName, setPropName] = useState(property.name);
    const [saved, setSaved] = useState(true);
    const addTagInput = useRef();

    const handleDeleteTag = (index) => {};

    const handleChangeTag = (index, value) => {};

    return saved ? (
        <Fragment key={propName}>
            <ProductSavedProperty propertyName={propName} tags={property.tags} setSaved={setSaved} />
        </Fragment>
    ) : (
        <Fragment key={propName}>
            <div className="grid grid-cols-4 gap-8">
                <div className="flex items-start gap-3">
                    <input
                        id={propName}
                        name={propName}
                        type="text"
                        value={propName}
                        onChange={(e) => setPropName(e.target.value)}
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
                        className="py-2 px-4 border border-blue-500 text-blue-500 rounded-md text-sm hover:bg-blue-500 hover:text-white transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default memo(CreateProductProperty);

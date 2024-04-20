import React from 'react';

const ProductSavedProperty = ({ propertyName, tags, setSaved }) => {
    return (
        <div className="text-sm grid grid-cols-4">
            <div>
                <h4 className="font-semibold">{propertyName}</h4>
            </div>
            <div className="col-span-2 flex gap-2 flex-wrap">
                {tags.map((tag) => (
                    <span className="p-2 rounded-md bg-gray-100">{tag}</span>
                ))}
            </div>
            <div className="flex items-center justify-end">
                <button
                    onClick={() => setSaved(false)}
                    type="button"
                    className="py-2 px-4 bg-gray-100 border rounded-md hover:bg-gray-200"
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default ProductSavedProperty;

import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const ProductPropertyTag = ({ tag, index, handleDeleteTag, handleChangeTag }) => {
    return (
        <div className="flex gap-2 items-center">
            <input
                id={tag}
                name={tag}
                defaultValue={tag}
                onBlur={(e) => handleChangeTag(index, e.target.value)}
                type="text"
                autoComplete="off"
                className="w-full border p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition"
            />
            <button onClick={() => handleDeleteTag(index)} type="button">
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ProductPropertyTag;

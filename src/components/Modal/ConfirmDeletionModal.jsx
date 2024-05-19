import React, { useState } from 'react';
import { Spinner } from '~/icons';
import { actions, useStore } from '~/store';
import axios from 'axios';
import { request } from '~/utils';
import { productService } from '~/services';

const ConfirmDeletionModal = ({ tableName, setData, setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, dispatch] = useStore();
    const { checkedRows } = state;

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await request.post(`${tableName}/disable`, JSON.stringify(checkedRows));
            switch (tableName) {
                case 'products':
                    const products = await request.get(`products`);
                    setData(products);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Failed to delete data', error);
        } finally {
            dispatch(actions.clearCheckedRows());
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="w-full space-y-4 px-4">
            <div className="space-y-2">
                <h2>Delete Confirmation</h2>
                <p className="text-sm text-gray-600">
                    Are you sure to permanently delete {checkedRows.length} {tableName}? There is no undo action.
                </p>
                <ul>
                    {checkedRows.map((checked) => (
                        <li key={checked.id} className="text-sm">
                            {checked.username}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                >
                    {isLoading ? <Spinner /> : 'Continue'}
                </button>
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmDeletionModal;

import React, { useState } from 'react';
import { Spinner } from '~/icons';
import { useStore } from '~/store';
import axios from 'axios';

const ConfirmDeletionModal = ({ tableName, data, setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [state] = useStore();
    const { checkedRows } = state;

    console.log(checkedRows);

    const handleDeleteAccounts = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/${tableName}/delete`, checkedRows);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4 px-4">
            <div className="space-y-2">
                <h2>Delete Confirmation</h2>
                <p className="text-sm text-gray-600">
                    Are you sure to permanently delete {checkedRows.length} {tableName}?
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
                    onClick={handleDeleteAccounts}
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

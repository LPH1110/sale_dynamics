import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from '~/icons';
import { userService } from '~/services';
import { sendBlockedNoti } from '~/services/mail';
import { useStore } from '~/store';
import { request } from '~/utils';

const BlockAccountConfirmation = ({ setAccounts, tableName, setOpen }) => {
    const [state] = useStore();
    const { checkedRows } = state;
    const [isLoading, setIsLoading] = useState(false);

    const handleBlockAccount = async () => {
        setIsLoading(true);
        await checkedRows.forEach(async (data) => {
            try {
                const res = await request.get(`admin/user/block?username=${data.username}`);
                //send email
                sendBlockedNoti({
                    to_email: data.email,
                    to_name: data.fullName,
                    from_name: 'Le Phu Hao',
                });
            } catch (error) {
                console.error('Failed to block account', error);
            }
        });
        setIsLoading(false);
        setOpen(false);
        const users = await userService.fetchAll();
        setAccounts(users);
    };

    return (
        <div className="w-full space-y-4 px-4">
            <div className="space-y-2">
                <h2>Block Account Confirmation</h2>
                <p className="text-sm text-gray-600">
                    Are you sure to block {checkedRows.length} {tableName}?
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
                    onClick={handleBlockAccount}
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

export default BlockAccountConfirmation;

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountDetailContext from '~/contexts/pool/AccountDetailContext';
import { Spinner } from '~/icons';
import { request } from '~/utils';

const AccountUnblockConfirm = ({ setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { account } = useContext(AccountDetailContext);
    const navigate = useNavigate();

    const handleUnblock = async () => {
        try {
            setIsLoading(true);
            const res = await request.get(`admin/user/unblock?username=${account.username}`);
            toast.success(res);
        } catch (error) {
            console.error('Failed to unblock this account', error);
        } finally {
            setIsLoading(false);
            setOpen(false);
            navigate('/accounts');
        }
    };
    return (
        <div className="w-full space-y-4 px-4">
            <div className="space-y-2">
                <h2 className="text-xl capitalize">Account Unblock Confirmation</h2>
                <p className="text-sm text-gray-600">Are you sure to unlock this account?</p>
            </div>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    type="button"
                    onClick={handleUnblock}
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

export default AccountUnblockConfirm;

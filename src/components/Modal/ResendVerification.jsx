import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from '~/icons';
import sendVerificationMail from '~/services/mail';
import { useStore } from '~/store';
import { request } from '~/utils';

const ResendVerification = ({ setOpen }) => {
    const [state] = useStore();
    const { checkedRows } = state;
    const [isLoading, setIsLoading] = useState(false);

    const handleResend = () => {
        setIsLoading(true);
        checkedRows.forEach(async (row) => {
            try {
                if (!row.enabled) {
                    // fetch token
                    const token = await request.get(`admin/generate-verify-token?username=${row.username}`);
                    // send email
                    console.log(token);
                    await sendVerificationMail({
                        to_email: row.email,
                        to_name: row.fullName,
                        from_name: 'Le Phu Hao',
                        message: `http://localhost:3000/verify-account/${token}`,
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        });
        setOpen(false);
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-2">
                <h2 className="font-semibold">Resend Verification</h2>
                <p className="text-sm text-gray-600">Please confirm if you want to verify these user</p>
                <ul className="text-sm text-blue-500">
                    {checkedRows.map((row) => (
                        <li>{row.username}</li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    type="button"
                    onClick={handleResend}
                    className="bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                >
                    {isLoading ? <Spinner /> : 'Resend'}
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

export default ResendVerification;

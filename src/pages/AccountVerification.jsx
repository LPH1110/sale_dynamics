import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from '~/icons';
import { request } from '~/utils';

const AccountActivated = () => {
    return (
        <section className="h-screen flex justify-center items-start bg-scooter-gradient">
            <section className="w-full mt-20 max-w-[26rem] shadow-lg rounded-md p-4 inline-block bg-white space-y-6">
                <div className="gap-2 flex flex-col items-center">
                    <CheckBadgeIcon className="w-12 h-12 text-scooter-gradient" />
                    <h2 className="text-center">You have successfully active your account!</h2>
                    <p className="text-sm text-gray-600 text-center">
                        Now you can{' '}
                        <Link className="text-blue-500 hover:underline" to="/sign-in">
                            sign in
                        </Link>{' '}
                        to our CMS
                    </p>
                </div>
            </section>
        </section>
    );
};

const AccountVerification = () => {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${process.env.REACT_APP_SERVER_BASE}/auth/verify-user?token=${token}`);
                if (res.data.localeCompare('activated')) {
                    setVerified(true);
                } else {
                    toast.error(res);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAccount();
    }, [token]);

    return verified ? (
        <AccountActivated />
    ) : (
        <section className="h-screen flex justify-center items-start bg-scooter-gradient">
            <section className="flex flex-col items-center w-full mt-20 max-w-[26rem] shadow-lg rounded-md p-4 bg-white space-y-6">
                <h2 className="text-xl font-semibold  text-gray-600">Activating your account</h2>
                {isLoading ? (
                    <Spinner className="w-12 h-12" />
                ) : (
                    <div className="flex items-center justify-center gap-2 flex-col">
                        <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />
                        <p className="text-sm text-gray-600 text-center px-6">
                            Invalid verification token. Please contact to your admin to re-send another verification
                            mail
                        </p>
                    </div>
                )}
            </section>
        </section>
    );
};

export default AccountVerification;

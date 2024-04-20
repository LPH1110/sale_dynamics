import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from '~/icons';

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
    const { userId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [timeout, setTimeOut] = useState();

    useEffect(() => {
        setIsLoading(true);
        const verifyAccount = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/accounts/verify.php?userId=${userId}`,
                );
                if (res.data) {
                    setVerified(true);
                    console.log(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        setTimeOut(
            setTimeout(() => {
                setIsLoading(false);
                setVerified(true);
            }, 2000),
        );

        return () => clearTimeout(timeout);

        // verifyAccount();
    }, [userId]);

    return verified ? (
        <AccountActivated />
    ) : (
        <section className="h-screen flex justify-center items-start bg-scooter-gradient">
            <section className="flex flex-col items-center w-full mt-20 max-w-[26rem] shadow-lg rounded-md p-4 bg-white space-y-6">
                <h2 className="text-xl font-semibold  text-gray-600">Activating your account</h2>
                {isLoading && <Spinner className="w-12 h-12" />}
            </section>
        </section>
    );
};

export default AccountVerification;

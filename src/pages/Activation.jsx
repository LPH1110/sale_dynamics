import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Spinner } from '~/icons';

const Activation = () => {
    const { user_id } = useParams();
    const [activated, setActivated] = useState(true);

    useEffect(() => {
        const activateAccount = async () => {
            try {
                // const res = axios.post(
                //     `${process.env.REACT_APP_SERVER_BASE}/final_pos/api/account/activate.php?user_id=${user_id}`,
                // );
            } catch (error) {
                console.log(error);
            }
        };
        activateAccount();
    }, []);

    return (
        <section className="h-screen flex justify-center items-start bg-scooter-gradient">
            <section className="w-full inline-flex items-center justify-center mt-20 max-w-[26rem] shadow-lg rounded-md p-4 bg-white space-y-6">
                {!activated ? (
                    <Spinner />
                ) : (
                    <div className="space-y-2">
                        <h2 className="text-center">Your account has been activated!</h2>
                        <p className="text-sm text-gray-600 text-center">
                            Now you can{' '}
                            <Link className="text-blue-500 hover:underline" to="/sign-in">
                                sign in
                            </Link>{' '}
                            to our CMS
                        </p>
                    </div>
                )}
            </section>
        </section>
    );
};

export default Activation;

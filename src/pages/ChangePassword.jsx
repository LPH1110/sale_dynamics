import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Spinner } from '~/icons';

const ChangeSuccess = () => {
    return (
        <section className="h-screen flex justify-center items-start bg-scooter-gradient">
            <section className="w-full mt-20 max-w-[26rem] shadow-lg rounded-md p-4 inline-block bg-white space-y-6">
                <div className="space-y-2">
                    <h2 className="text-center">You have successfully changed your password!</h2>
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

const ChangePassword = () => {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [changed, setChanged] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPass: '',
            repeatPass: '',
        },
        validationSchema: Yup.object({
            newPass: Yup.string().required('Password is required').min(8, 'At least 8 characters'),
            repeatPass: Yup.string().oneOf([Yup.ref('newPass'), null], 'Passwords must match'),
        }),
        onSubmit: async (data) => {
            try {
                setIsLoading(true);
                const res = await axios.post(
                    `${process.env.REACT_APP_SERVER_BASE}/pos_backend/api/account/change_password.php`,
                    { username: username, newPassword: data.newPass },
                );
                if (!res.message) {
                    setChanged(true);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return changed ? (
        <ChangeSuccess />
    ) : (
        <section className="h-screen flex justify-center items-start bg-scooter-gradient">
            <section className="w-full mt-20 max-w-[26rem] shadow-lg rounded-md p-4 inline-block bg-white space-y-6">
                <h2 className="text-xl font-semibold text-left text-gray-600">Change your password</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <section className="flex justify-between">
                        <section className="flex flex-col w-full gap-4">
                            <label htmlFor="newPass" className="py-1 text-gray-600 flex-1 text-sm capitalize">
                                New password
                            </label>
                            <label htmlFor="repeatPass" className="py-1 text-gray-600 flex-1 text-sm capitalize">
                                Repeat password
                            </label>
                        </section>
                        <section className="space-y-4">
                            <div className="space-y-1">
                                <div className="border px-2 py-1 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                    <input
                                        onChange={formik.handleChange}
                                        value={formik.values.newPass}
                                        type="password"
                                        id="newPass"
                                        name="newPass"
                                    />
                                </div>
                                {formik.errors.newPass ? (
                                    <div className="text-sm text-red-500">{formik.errors.newPass}</div>
                                ) : null}
                            </div>
                            <div className="space-y-1">
                                <div className="border px-2 py-1 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition">
                                    <input
                                        onChange={formik.handleChange}
                                        value={formik.values.repeatPass}
                                        type="password"
                                        id="repeatPass"
                                        name="repeatPass"
                                    />
                                </div>
                                {formik.errors.repeatPass ? (
                                    <div className="text-sm text-red-500">{formik.errors.repeatPass}</div>
                                ) : null}
                            </div>
                        </section>
                    </section>
                    <section className="flex justify-end items-center gap-2 text-sm">
                        <button
                            type="submit"
                            className="flex justify-center min-w-[4rem] bg-blue-500 hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                        >
                            {isLoading ? <Spinner /> : 'Continue'}
                        </button>
                    </section>
                </form>
            </section>
        </section>
    );
};

export default ChangePassword;

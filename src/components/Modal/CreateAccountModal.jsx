import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { request } from '~/utils';
import { toast } from 'react-toastify';
import { Spinner } from '~/icons';
import { userService } from '~/services';
import { sendVerification } from '~/services/mail';

const CreateAccountModal = ({ setAccounts, setOpen }) => {
    const { user } = UserAuth();
    const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            fullName: '',
            phoneNumber: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().required('Email is required'),
        }),
        onSubmit: async (data) => {
            try {
                setIsLoading(true);
                // create user
                const res = await request.post('admin/create', {
                    fullName: data.fullName,
                    phone: data.phoneNumber,
                    email: data.email,
                    password: data.password,
                });
                // send mail
                sendVerification({
                    to_email: data.email,
                    to_name: data.fullName,
                    from_name: 'Le Phu Hao',
                    message: `http://localhost:3000/verify-account/${res.token}`,
                });

                const users = await userService.fetchAll();
                setAccounts(users);
                toast.success(`Create ${data.fullName} successfully!`);
            } catch (error) {
                console.log(error);
                toast.error("Can't create account");
            } finally {
                setIsLoading(false);
                setOpen(false);
            }
        },
    });

    return (
        <section className="space-y-4 w-full px-4">
            <h1 className="text-lg font-semibold">Quick Create: Account</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="flex justify-between">
                    <div className="space-y-6 flex flex-col">
                        <label htmlFor="fullName" className="py-1 flex-1 text-sm capitalize">
                            Full name
                        </label>
                        <label htmlFor="phoneNumber" className="py-1 flex-1 text-sm capitalize">
                            Phone Number
                        </label>
                        <label htmlFor="email" className="py-1 flex-1 text-sm capitalize">
                            Email
                        </label>
                        <label htmlFor="password" className="py-1 flex-1 text-sm capitalize">
                            Password
                        </label>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2 w-full">
                            <input
                                onChange={formik.handleChange}
                                value={formik.values.fullName}
                                className="border w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                placeholder="---"
                                name="fullName"
                                id="fullName"
                            />
                            {formik.errors.fullName ? (
                                <div className="text-sm text-red-500">{formik.errors.fullName}</div>
                            ) : null}
                        </div>
                        <div className="space-y-2 w-full">
                            <input
                                onChange={formik.handleChange}
                                value={formik.values.phoneNumber}
                                className="border w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                placeholder="---"
                                name="phoneNumber"
                                id="phoneNumber"
                            />
                            {formik.errors.phoneNumber ? (
                                <div className="text-sm text-red-500">{formik.errors.phoneNumber}</div>
                            ) : null}
                        </div>
                        <div className="space-y-2 w-full">
                            <input
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                className="border w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                placeholder="---"
                                name="email"
                                id="email"
                            />
                            {formik.errors.email ? (
                                <div className="text-sm text-red-500">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="space-y-2 w-full">
                            <input
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                className="border w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                type="text"
                                placeholder="---"
                                name="password"
                                id="password"
                            />
                            {formik.errors.password ? (
                                <div className="text-sm text-red-500">{formik.errors.password}</div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 text-sm">
                    <button
                        type="submit"
                        className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                    >
                        {isLoading ? <Spinner /> : 'Save & Close'}
                    </button>
                    <button
                        onClick={() => setOpen(false)}
                        type="button"
                        className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreateAccountModal;

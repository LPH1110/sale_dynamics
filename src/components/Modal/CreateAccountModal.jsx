import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';

const CreateAccountModal = ({ setOpen }) => {
    const { user } = UserAuth();
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
                const mailRes = await emailjs.send(
                    process.env.REACT_APP_EMAILJS_SERVICE_ID,
                    process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                    {
                        to_email: data.email,
                        to_name: data.fullName,
                        from_name: user.fullName,
                        message: 'This is yoru login link', // Login link
                    },
                    {
                        publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
                        privateKey: process.env.REACT_APP_EMAILJS_PRIVATE_KEY,
                    },
                );
                console.log(data);
                const createAccountRes = await axios.post(
                    `${process.env.REACT_APP_SERVER_BASE}/final_pos/api/account/create.php`,
                    JSON.stringify({ fullName: data.fullName, email: data.email }),
                );
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <section className="space-y-4 w-full">
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
                        className="bg-blue-500 hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                    >
                        Save & close
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

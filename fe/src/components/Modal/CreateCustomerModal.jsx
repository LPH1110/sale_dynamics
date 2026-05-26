import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { CreateOrderContext } from '~/contexts/pool';
import { Spinner } from '~/icons';
import { customerService } from '~/services';

const CreateCustomerModal = ({ setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { setCustomer } = useContext(CreateOrderContext)
    const formik = useFormik({
        initialValues: {
            lastname: '',
            firstname: '',
            email: '',
            gender: '',
            address: '',
            phone: '',
            country: '',
            city: '',
            district: '',
            ward: '',
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First name is required'),
            phone: Yup.string().required('Phone number must be provided'),
        }),
        onSubmit: async (data) => {
            setIsLoading(true);
            const customer = await customerService.createCustomer(data);
            toast.success('Created new customer: ' + customer.firstname + ' ' + customer.lastname);
            setCustomer(customer)
            setIsLoading(false);
            setOpen(false);
        },
    });
    return (
        <div className="w-full">
            <div className="px-4 pb-4 border-b">
                <h2 className="font-semibold">Create Customer</h2>
            </div>
            <form autoComplete="off" onSubmit={formik.handleSubmit} className="pt-4 px-4 text-sm space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="lastname" className="font-semibold block text-slate-500">
                            Last name
                        </label>
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            placeholder="Enter last name"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            className="w-full p-2 rounded-sm ring-1 ring-slate-300 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="firstname" className="font-semibold block text-slate-500">
                            First name
                        </label>
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            placeholder="Enter first name"
                            className="w-full p-2 rounded-sm ring-1 ring-slate-300 focus:ring-blue-500 transition"
                        />
                        {formik.errors.firstname ? (
                            <div className="text-sm text-red-500">{formik.errors.firstname}</div>
                        ) : null}
                    </div>
                </div>
                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="font-semibold block text-slate-500">
                        Email address
                    </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        placeholder="Enter email address"
                        className="w-full p-2 rounded-sm ring-1 ring-slate-300 focus:ring-blue-500 transition"
                    />
                </div>
                {/* Gender */}
                <div className="space-y-2 py-4 border-b">
                    <label htmlFor="gender" className="font-semibold block text-slate-500">
                        Gender
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            onChange={formik.getFieldProps('gender').onChange}
                            type="radio"
                            name="gender"
                            id="gender_male"
                            value="male"
                        />
                        <label htmlFor="gender_male">Male</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            onChange={formik.getFieldProps('gender').onChange}
                            type="radio"
                            name="gender"
                            id="gender_female"
                            value="female"
                        />
                        <label htmlFor="gender_male">Female</label>
                    </div>
                </div>
                {/* Additional info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="address" className="font-semibold block text-slate-500">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            placeholder="Enter address"
                            className="w-full p-2 rounded-sm ring-1 ring-slate-300 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="font-semibold block text-slate-500">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            placeholder="Enter phone number"
                            className="w-full p-2 rounded-sm ring-1 ring-slate-300 focus:ring-blue-500 transition"
                        />
                        {formik.errors.phone ? <div className="text-sm text-red-500">{formik.errors.phone}</div> : null}
                    </div>
                </div>
                {/* Actions */}
                <div className="flex items-center justify-end pt-4 border-t gap-2">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="min-w-[4rem] border rounded-sm py-2 bg-white hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center min-w-[4rem] bg-blue-500 hover:bg-blue-600 transition text-white rounded-sm py-2"
                    >
                        {isLoading ? <Spinner /> : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCustomerModal;

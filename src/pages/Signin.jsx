import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Modal } from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { Spinner } from '~/icons';

const Signin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { signin } = UserAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        open: false,
        action: '',
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (data) => {
            try {
                setIsLoading(true);
                const res = await signin(data.username, data.password);
                console.log(res.data);
                if (res.data.userDTO.blocked) {
                    setModal({ open: true, action: 'account-blocked-notification' });
                } else {
                    toast.success(res.message);
                    navigate('/');
                }
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <section className="h-screen flex justify-center items-center bg-scooter-gradient">
            <section className="w-full max-w-[26rem] shadow-lg rounded-md p-6 inline-block bg-white space-y-6">
                <h2 className="text-2xl text-center text-gray-600">Welcome back</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm text-gray-600" htmlFor="email">
                            Username
                        </label>
                        <input
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            placeholder="Enter your username"
                            name="username"
                            id="username"
                        />
                        {formik.errors.username ? (
                            <div className="text-sm text-red-500">{formik.errors.username}</div>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm block text-gray-600" htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            id="password"
                        />
                        {formik.errors.password ? (
                            <div className="text-sm text-red-500">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <div>
                        <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 text-center p-3 rounded-sm bg-blue-500 w-full text-white font-semibold hover:bg-blue-500/90 transition"
                    >
                        {isLoading ? <Spinner /> : 'Sign in'}
                    </button>
                </form>
            </section>
            <Modal
                open={modal.open}
                setOpen={(value) => setModal((prev) => ({ ...prev, open: value }))}
                action={modal.action}
            />
        </section>
    );
};

export default Signin;

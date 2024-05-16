import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderStatus } from '~/components';
import { Spinner } from '~/icons';
import { userService } from '~/services';
import { formatArrayDate, hasChangedPassword, request } from '~/utils';
import NotAllowAccess from './NotAllowAccess';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';

const AccountDetail = () => {
    const { username } = useParams();
    const [account, setAccount] = useState(null);
    const [saveChangesLoading, setSaveChangesLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
    });

    const { user } = UserAuth();

    useEffect(() => {
        const getUserDetail = async () => {
            const detail = await userService.fetchDetail(username);
            setAccount(detail);
            setForm({
                fullName: detail?.fullName,
                phone: detail?.phone,
                email: detail?.email,
            });
        };

        getUserDetail();
    }, [username]);

    const saveChanges = async (e) => {
        e.preventDefault();
        try {
            setSaveChangesLoading(true);
            const res = await request.post(`user/update?username=${username}`, JSON.stringify(form));
            setAccount(res);
            toast.success('Updated user info!');
        } catch (error) {
            console.log(error);
        } finally {
            setSaveChangesLoading(false);
        }
    };

    return !hasChangedPassword(user) ? (
        <NotAllowAccess />
    ) : (
        <section className="h-screen-content overflow-auto py-4 flex items-start justify-center">
            <section className="container space-y-4">
                <section className="bg-white shadow-sm flex items-center gap-4 border rounded-md p-4">
                    <section>
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gray-100 rounded-full"></div>
                    </section>
                    <section>
                        <h2 className="font-semibold">{account?.fullName}</h2>
                        <div>
                            <Link to={`mailto:${account?.email}`} className="text-sm text-gray-600">
                                {account?.email}
                            </Link>
                        </div>
                        <div>
                            <Link to="phone:0935572755" className="text-sm text-gray-600">
                                {account?.phone}
                            </Link>
                        </div>
                    </section>
                </section>
                <section className="grid grid-cols-12 gap-4">
                    {/* Personal Information */}
                    <section className="col-span-4">
                        <div className="bg-white shadow-sm  border rounded-md p-4 space-y-6">
                            <h4 className="text-sm font-semibold">Personal Information</h4>
                            <section>
                                <form onSubmit={saveChanges} className="space-y-6">
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
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2 w-full">
                                                <input
                                                    className="text-sm border w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                                    type="text"
                                                    value={form.fullName}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({ ...prev, fullName: e.target.value }))
                                                    }
                                                    placeholder="---"
                                                    name="fullName"
                                                    id="fullName"
                                                />
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <input
                                                    className="border text-sm w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                                    type="text"
                                                    placeholder="---"
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    value={form.phone}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({ ...prev, phone: e.target.value }))
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <input
                                                    className="border text-sm w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                                    type="text"
                                                    placeholder="---"
                                                    value={form.email}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({ ...prev, email: e.target.value }))
                                                    }
                                                    name="email"
                                                    id="email"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center gap-2 text-sm">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 flex items-center justify-center min-w-[4rem] hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                                        >
                                            {saveChangesLoading ? <Spinner /> : 'Save changes'}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </section>
                    {/* Sales */}
                    <section className="bg-white shadow-sm col-span-8 border rounded-md p-4 space-y-6">
                        <h4 className="text-sm font-semibold">Sales</h4>
                        <div>
                            {account?.orders.map((order) => (
                                <div className="p-4 hover:bg-blue-50 flex items-center justify-between gap-4 w-full">
                                    <Link to={`/orders/detail/${order.id}`} className="font-semibold">
                                        #{order.id}
                                    </Link>
                                    <p>{formatArrayDate(order.createdDate)}</p>
                                    <OrderStatus status={order.status} />
                                    <p className="text-right">$ {order.total}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </section>
            </section>
        </section>
    );
};

export default AccountDetail;

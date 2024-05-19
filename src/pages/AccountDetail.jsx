import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, OrderStatus } from '~/components';
import { Spinner } from '~/icons';
import { userService } from '~/services';
import { authorizeAdmin, formatArrayDate, hasChangedPassword, isSameUser, request } from '~/utils';
import NotAllowAccess from './NotAllowAccess';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { ArrowUpTrayIcon, FolderOpenIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import AccountDetailContext from '~/contexts/pool/AccountDetailContext';

const AccountDetail = () => {
    const { username } = useParams();
    const [account, setAccount] = useState(null);
    const [saveChangesLoading, setSaveChangesLoading] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
    });
    const [modal, setModal] = useState({
        open: false,
        action: '',
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

    const handleChangeAvatar = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatar(file);

        setModal({
            action: 'change-avatar',
            open: true,
        });
    };

    return !hasChangedPassword(user) ? (
        <NotAllowAccess />
    ) : (
        <AccountDetailContext.Provider value={{ account, avatar, setAccount }}>
            <section className="h-screen-content overflow-auto py-4 flex items-start justify-center">
                <section className="container space-y-4 px-4">
                    {/* Header */}
                    <section className="flex items-start justify-between py-4">
                        <section className="flex items-center gap-4">
                            {/* Avatar */}
                            <section>
                                <label
                                    onClick={(e) => {
                                        if (!isSameUser(user, account)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    htmlFor="user-avatar"
                                >
                                    <div className="w-24 h-24 relative text-center rounded-full">
                                        <div className="relative w-full pb-[100%]">
                                            {account?.avatarURL ? (
                                                <img
                                                    className="rounded-full m-auto block max-w-full max-h-full absolute inset-0"
                                                    src={account?.avatarURL}
                                                    alt={account?.username}
                                                />
                                            ) : (
                                                <UserCircleIcon className="text-slate-300 m-auto block max-w-full max-h-full absolute inset-0" />
                                            )}
                                            {/* Overlay */}
                                            {isSameUser(user, account) && (
                                                <div className="rounded-full text-white flex items-center justify-center gap-2 w-full h-full bg-gray-700 absolute z-3 opacity-0 hover:opacity-100 hover:bg-gray-700/60 transition cursor-pointer">
                                                    <ArrowUpTrayIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </label>
                                <input
                                    readOnly={isSameUser(user, account)}
                                    type="file"
                                    className="hidden"
                                    name="user-avatar"
                                    id="user-avatar"
                                    onChange={handleChangeAvatar}
                                    accept="image/*"
                                />
                            </section>
                            {/* Info */}
                            <section>
                                <h2 className="font-semibold text-2xl">{account?.fullName}</h2>
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
                        {authorizeAdmin(user) && account?.blocked ? (
                            <section className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal({
                                            action: 'account-unblock-confirmation',
                                            open: true,
                                        });
                                    }}
                                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-sm ring-1 ring-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition font-semibold"
                                >
                                    <LockOpenIcon className="w-4 h-4" />
                                    Unblock
                                </button>
                            </section>
                        ) : null}
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
                                                        readOnly={isSameUser(user, account)}
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
                                                        readOnly={isSameUser(user, account)}
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
                                                        readOnly={isSameUser(user, account)}
                                                        onChange={(e) =>
                                                            setForm((prev) => ({ ...prev, email: e.target.value }))
                                                        }
                                                        name="email"
                                                        id="email"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {user?.username.localeCompare(account?.username) === 0 && (
                                            <div className="flex justify-end items-center gap-2 text-sm">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 flex items-center justify-center min-w-[4rem] hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                                                >
                                                    {saveChangesLoading ? <Spinner /> : 'Save changes'}
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </section>
                            </div>
                        </section>
                        {/* Sales */}
                        <section className="col-span-8">
                            <section className="bg-white shadow-sm border rounded-md p-4 space-y-6">
                                <h4 className="text-sm font-semibold">Sales</h4>
                                <div>
                                    {account?.orders.length > 0 ? (
                                        account?.orders.map((order) => (
                                            <div className="p-4 hover:bg-blue-50 flex items-center justify-between gap-4 w-full">
                                                <Link to={`/orders/detail/${order.id}`} className="font-semibold">
                                                    #{order.id}
                                                </Link>
                                                <p>{formatArrayDate(order.createdDate)}</p>
                                                <OrderStatus status={order.status} />
                                                <p className="text-right">$ {order.total}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col gap-2 items-center justify-center">
                                            <div className="p-3 rounded-full bg-slate-100 text-slate-300">
                                                <FolderOpenIcon className="w-10 h-10" />
                                            </div>
                                            <p className="text-slate-500">There is no data to present</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </section>
                    </section>
                </section>
                <Modal
                    open={modal.open}
                    action={modal.action}
                    setOpen={(value) => setModal((prev) => ({ ...prev, open: value }))}
                />
            </section>
        </AccountDetailContext.Provider>
    );
};

export default AccountDetail;

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { Spinner } from '~/icons';

const AccountDetail = () => {
    const { userId } = useParams();
    const [account, setAccount] = useState({});
    const [saveChangesLoading, setSaveChangesLoading] = useState(false);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/account/read_by_id.php?user_id=${userId}`,
                );
                setAccount(res.data || {});
            } catch (error) {
                console.log(error);
            }
        };

        fetchAccount();
    }, [userId]);

    return (
        <section className="h-screen-content overflow-auto p-4 space-y-4">
            <section className="bg-white shadow-sm flex items-center gap-4 border rounded-md p-4">
                <section>
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gray-100 rounded-full"></div>
                </section>
                <section>
                    <h2 className="font-semibold">{account?.fullname}</h2>
                    <div>
                        <Link to={`mailto:${account?.email}`} className="text-sm text-gray-600">
                            {account?.email}
                        </Link>
                    </div>
                    <div>
                        <Link to="phone:0935572755" className="text-sm text-gray-600">
                            0935572755
                        </Link>
                    </div>
                </section>
            </section>
            <section className="">
                <section className="grid grid-cols-12 gap-4">
                    {/* Personal Information */}
                    <section className="bg-white shadow-sm col-span-4 border rounded-md p-4 space-y-6">
                        <h4 className="text-sm font-semibold">Personal Information</h4>
                        <section>
                            <form className="space-y-6">
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
                                                value={account?.fullname}
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
                                            />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <input
                                                className="border text-sm w-full px-2 py-1 rounded-sm ring-2 ring-transparent focus:ring-blue-400 transition"
                                                type="text"
                                                placeholder="---"
                                                value={account?.email}
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
                    </section>
                    {/* Sales */}
                    <section className="bg-white shadow-sm col-span-8 h-12 border rounded-md p-4">
                        <h4 className="text-sm font-semibold">Sales</h4>
                    </section>
                </section>
            </section>
        </section>
    );
};

export default AccountDetail;

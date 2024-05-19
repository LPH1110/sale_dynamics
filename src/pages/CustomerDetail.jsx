import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CustomerCard } from '~/components';
import { Spinner } from '~/icons';
import { request } from '~/utils';

const CustomerDetail = () => {
    const { phone } = useParams();
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            try {
                setIsLoading(true);
                const customer = await request.get(`customers/detail?phone=${phone}`);
                setCustomer(customer);
            } catch (error) {
                console.error('Failed to fetch customer info', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomerInfo();
    }, [phone]);

    return (
        <section className="h-screen-content overflow-auto flex flex-col">
            {isLoading ? (
                <section className="container mx-auto pt-6 px-4 flex items-center justify-center">
                    <Spinner />
                </section>
            ) : (
                <section className="container pt-6 px-4 mx-auto space-y-4">
                    <section>
                        <h1 className="font-semibold text-xl">Customer Information</h1>
                    </section>
                    <section className="grid grid-cols-12 gap-4 h-full">
                        <section className="col-span-8 space-y-4">
                            {/* General */}
                            <div className="rounded-md bg-white shadow-sm border p-4 space-y-4">
                                {/* Headers */}
                                <div className="flex items-center gap-3">
                                    {customer?.avatarURL ? (
                                        <div className="w-12 h-12 rounded-full">
                                            <img src={customer.avatarURL} alt="customer avatar" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
                                    )}
                                    <h4 className="font-semibold">{customer?.firstname + ' ' + customer?.lastname}</h4>
                                </div>
                                {/* Content */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="text-center space-y-2">
                                        <Link
                                            to={`/orders/detail/lastest`}
                                            className="text-blue-500 hover:text-blue-600 transition text-sm"
                                        >
                                            Latest order
                                        </Link>
                                        <h4 className="font-semibold">2024-05-15 12:42:19</h4>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-slate-500 text-sm">Accumulating Revenue</h4>
                                        <h4 className="font-semibold">$2,345,687</h4>
                                        <p className="text-slate-500">17 Orders</p>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-slate-500 text-sm">Average</h4>
                                        <h4 className="font-semibold">$234,324</h4>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-slate-500 text-sm">Owed Amount</h4>
                                        <h4 className="font-semibold">- $761,123</h4>
                                    </div>
                                </div>
                            </div>
                            {/* History orders */}
                            <div className="rounded-md bg-white shadow-sm border p-4 space-y-4">
                                
                            </div>
                        </section>
                        <section className="col-span-4">
                            <CustomerCard customer={customer} />
                        </section>
                    </section>
                </section>
            )}
        </section>
    );
};

export default CustomerDetail;

import { Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CustomerCard } from '~/components';
import { Spinner } from '~/icons';
import { customerService } from '~/services';
import { commasNumber, formatArrayDate } from '~/utils';

const OrderDropDown = ({ data }) => {
    const [dropped, setDropped] = useState(false);
    return (
        <div onClick={() => setDropped(!dropped)} className="px-4 space-y-4 cursor-pointer border-b pb-4">
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Link to={`/orders/detail/${data?.id}`} className="text-blue-500 hover:text-blue-600 transition">
                        Order #{data?.id}
                    </Link>
                    <div className="flex items-center gap-2">
                        <h4 className="text-slate-500">{formatArrayDate(data?.createdDate)}</h4>
                        {dropped ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronUpIcon className="w-4 h-4" />}
                    </div>
                </div>
                <h4 className="font-semibold">${commasNumber(data?.total)}</h4>
            </div>
            <Transition
                as={Fragment}
                show={dropped}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="space-y-4">
                    {data?.orderItems.map((item) => (
                        <Fragment key={item?.productDTO?.barcode}>
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-md">
                                    <img
                                        className="rounded-md"
                                        src={item?.productDTO?.thumbnails[0].url}
                                        alt={item?.productDTO.name}
                                    />
                                </div>
                                <p>{item?.productDTO?.name}</p>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </Transition>
        </div>
    );
};

const CustomerDetail = () => {
    const { phone } = useParams();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAccumulatingRevenue = useCallback(() => {
        return orders.reduce((acc, order) => {
            return (acc += order?.total);
        }, 0);
    }, [orders]);

    const getOrderAverageAmount = useCallback(() => {
        return Math.ceil(getAccumulatingRevenue() / orders?.length);
    }, [getAccumulatingRevenue, orders?.length]);

    const getTotalOwed = useCallback(() => {
        return orders.reduce((acc, order) => {
            return (acc += order?.customerOwed);
        }, 0);
    }, [orders]);

    useEffect(() => {
        const getInfo = async () => {
            setIsLoading(true);
            const customer = await customerService.fetchInfo(phone);
            const orders = await customerService.fetchOrders(phone);

            setCustomer(customer);
            setOrders(orders);

            setIsLoading(false);
        };

        getInfo();
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
                                        <div className="w-12 h-12 bg-blue-500 text-white text-xl font-bold rounded-full flex items-center justify-center">
                                            <span>{customer?.firstname[0]}</span>
                                            <span>{customer?.lastname[0]}</span>
                                        </div>
                                    )}
                                    <h4 className="font-semibold">{customer?.firstname + ' ' + customer?.lastname}</h4>
                                </div>
                                {/* Content */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="text-center space-y-2">
                                        <Link
                                            to={`/orders/detail/${orders[0]?.id}`}
                                            className="text-blue-500 hover:text-blue-600 transition text-sm"
                                        >
                                            Latest order
                                        </Link>
                                        <h4 className="font-semibold">
                                            {orders[0] && formatArrayDate(orders[0].createdDate)}
                                        </h4>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-slate-500 text-sm">Accumulating Revenue</h4>
                                        <h4 className="font-semibold">${commasNumber(getAccumulatingRevenue())}</h4>
                                        <p className="text-slate-500">{orders?.length} Orders</p>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-slate-500 text-sm">Average</h4>
                                        <h4 className="font-semibold">${commasNumber(getOrderAverageAmount())}</h4>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-slate-500 text-sm">Owed Amount</h4>
                                        <h4 className="font-semibold">${getTotalOwed()}</h4>
                                    </div>
                                </div>
                            </div>
                            {/* History orders */}
                            <div className="rounded-md bg-white shadow-sm border py-4 space-y-4">
                                {orders?.map((order) => (
                                    <Fragment key={order?.id}>
                                        <OrderDropDown data={order} />
                                    </Fragment>
                                ))}
                                <div className="flex items-center justify-end gap-2 px-4">
                                    <button
                                        type="button"
                                        className="shadow-md p-3 rounded-md hover:bg-blue-500 transition hover:text-white bg-slate-100"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" />
                                    </button>
                                    <ul className="flex gap-2 text-sm">
                                        <li className="p-2 rounded-md hover:text-blue-500 transition cursor-pointer">
                                            1
                                        </li>
                                        <li className="p-2 rounded-md hover:text-blue-500 transition cursor-pointer">
                                            2
                                        </li>
                                        <li className="p-2 rounded-md hover:text-blue-500 transition cursor-pointer">
                                            3
                                        </li>
                                        <li className="p-2 rounded-md hover:text-blue-500 transition cursor-pointer">
                                            4
                                        </li>
                                        <li className="p-2 rounded-md hover:text-blue-500 transition cursor-pointer">
                                            ...
                                        </li>
                                    </ul>
                                    <button
                                        className="shadow-md p-3 rounded-md hover:bg-blue-500 transition hover:text-white bg-slate-100"
                                        type="button"
                                    >
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </button>
                                </div>
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

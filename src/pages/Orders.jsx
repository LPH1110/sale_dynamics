import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { PlusIcon, TrashIcon } from '~/icons';
import { orderService, userService } from '~/services';
import { actions, useStore } from '~/store';
import { authorizeAdmin, hasChangedPassword } from '~/utils';
import NotAllowAccess from './NotAllowAccess';

const tableHeadings = [
    {
        id: uuidv4(),
        title: '',
    },
    {
        id: uuidv4(),

        title: 'Order code',
    },
    {
        id: uuidv4(),

        title: 'Created date',
    },
    {
        title: 'Customer',
        id: uuidv4(),
    },
    {
        title: 'Order status',
        id: uuidv4(),
    },
    {
        title: 'Total ($)',
        id: uuidv4(),
    },
];

const DataRow = ({ data }) => {
    const checkRef = useRef();
    const [checked, setChecked] = useState(false);
    const [, dispatch] = useStore();

    const handleChecked = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) {
            dispatch(actions.addCheckedRow(data));
        } else {
            dispatch(actions.deleteCheckedRow(data));
        }
    };

    useEffect(() => {
        return () => {
            dispatch(actions.clearCheckedRows());
        };
    }, []);

    return (
        <tr className={checked ? 'bg-blue-100' : 'hover:bg-blue-100 bg-white'}>
            <td className="text-center p-3 hover:bg-gray-100">
                <input onChange={handleChecked} ref={checkRef} className="w-4 h-4" type="checkbox" />
            </td>
            <td className="text-sm p-3 hover:bg-gray-100 cursor-pointer">
                <Link className="text-blue-500 hover:underline " to={`/orders/detail/${data?.id}`}>
                    {data?.id}
                </Link>
            </td>
            {/* <td className="text-sm p-3 hover:bg-gray-100">{format(data?.createdDate, 'dd/MM/yyyy HH:mm:ss')}</td> */}
            <td className="text-sm p-3 hover:bg-gray-100">
                {data?.customer?.firstname + ' ' + data?.customer?.lastname}
            </td>
            <td className="text-sm p-3 hover:bg-gray-100">
                <OrderStatus status={data.status} />
            </td>
            <td className="text-sm p-3 hover:bg-gray-100">{data?.total}</td>
        </tr>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = UserAuth();

    useEffect(() => {
        const getOrders = async () => {
            let orders = [];
            if (authorizeAdmin(user)) {
                orders = await orderService.fetchOrders();
            } else {
                orders = await userService.fetchOrdersByUsername(user?.username);
            }
            setOrders(orders);
        };

        getOrders();
    }, []);

    return !hasChangedPassword(user) ? (
        <NotAllowAccess />
    ) : (
        <section className="h-screen-content overflow-auto p-4 flex items-start justify-center">
            <section className="container space-y-4">
                {/* Head bar */}
                <section className="bg-white rounded-sm border p-1.5 shadow-md">
                    <div className="whitespace-nowrap flex items-center justify-start flex-row">
                        <Link
                            to="/orders/create-new"
                            className="flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                        >
                            <span className="w-5 h-5 text-emerald-400">
                                <PlusIcon />
                            </span>{' '}
                            New
                        </Link>
                        <button
                            type="button"
                            className="flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                        >
                            <span className="w-5 h-5 text-gray-500">
                                <TrashIcon />
                            </span>{' '}
                            Delete
                        </button>

                        <div className="w-full ml-2 flex gap-2 items-center border py-1 px-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition">
                            <button type="button" className="w-4 h-4">
                                <MagnifyingGlassIcon />
                            </button>
                            <input
                                className="w-full"
                                type="text"
                                placeholder="Searching an order"
                                name="provider"
                                id="provider"
                            />
                        </div>
                    </div>
                </section>
                {/* Table */}
                <section className="bg-white h-screen-9 overflow-auto rounded-sm border px-4 pb-4 shadow-md space-y-6">
                    <h1 className="text-xl font-semibold pt-4">List of Orders</h1>
                    <table className="relative w-full border-collapse">
                        <thead className="border-b top-0 inset-x-0 sticky w-full bg-white">
                            <tr>
                                {tableHeadings.map((heading) => (
                                    <Fragment key={heading.id}>
                                        {heading.title ? (
                                            <th className="hover:bg-gray-100 text-left p-3 font-semibold text-sm capitalize">
                                                {heading.title}
                                            </th>
                                        ) : (
                                            <td className="hover:bg-gray-100 text-center p-3">
                                                <input
                                                    id="check_all"
                                                    name="check_all"
                                                    type="checkbox"
                                                    className="w-4 h-4"
                                                />
                                            </td>
                                        )}
                                    </Fragment>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <Fragment key={order.id}>
                                    <DataRow data={order} />
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </section>
            </section>
        </section>
    );
};

export default Orders;

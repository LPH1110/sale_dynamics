import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDebounce } from '~/store';

import { Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CustomerCard, Modal, OrderItemRow } from '~/components';
import { CreateOrderContext } from '~/contexts/pool';

const CreateOrder = () => {
    const [searchValue, setSearchValue] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [orderChanged, setOrderChanged] = useState(false);
    const [confirmChecked, setConfirmChecked] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        action: '',
    });

    const debounce = useDebounce(searchValue, 600);

    const getProductListQty = useCallback(() => {
        return orderItems.reduce((acc, item) => {
            return (acc += item.quantity);
        }, 0);
    }, []);

    const getTotalAmount = useCallback(() => {
        return orderItems.reduce((acc, item) => {
            return (acc += item.quantity * item.productDTO.salePrice);
        }, 0);
    }, []);

    const getDiscount = () => {
        return 0;
    };

    const handleOpenModal = () => {
        if (searchValue.trim().length > 0) {
            setModal((prev) => ({ action: 'product-search', open: true }));
        }
    };

    useEffect(() => {
        handleOpenModal();
    }, [debounce]);

    return (
        <CreateOrderContext.Provider
            value={{
                confirmChecked,
                setConfirmChecked,
                searchValue,
                setSearchValue,
                orderItems,
                getTotalAmount,
                setOrderItems,
                customer,
                setCustomer,
            }}
        >
            <section className="relative h-screen-content overflow-auto">
                {/* Header */}
                <Transition
                    as={Fragment}
                    show={orderChanged}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <header className="z-10 sticky bg-white top-0 inset-x-0 px-4 flex items-center justify-center shadow-md p-4">
                        <div className="container flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-400">Updates have not been saved</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="border rounded-sm py-2 px-4 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 min-w-[4rem] flex items-center justify-center hover:bg-blue-600 rounded-sm transition text-white font-semibold py-2 px-4"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </header>
                </Transition>

                {/* Body */}
                <section className={orderChanged ? 'flex justify-center pt-6' : 'flex justify-center'}>
                    <section className="container">
                        <header className="p-4 space-y-1">
                            <h2 className="text-xl font-semibold">Order Information</h2>
                        </header>
                        <section className="container grid grid-cols-4 px-4 gap-6">
                            {/* Left side */}
                            <section className="space-y-4 col-span-3">
                                {/* Product */}
                                <div className="bg-white rounded-sm shadow-md border p-4 space-y-4">
                                    <h4 className="font-semibold">Product</h4>
                                    {/* Searching a product */}
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Search bar */}
                                        <div className="relative flex items-center border rounded-md flex-1 ring-1 ring-transparent focus-within:ring-blue-400 transition">
                                            <span className="px-2">
                                                <MagnifyingGlassIcon className="w-4 h-4" />
                                            </span>
                                            <input
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                type="text"
                                                placeholder="Search a product"
                                                className="w-full text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleOpenModal}
                                                className="h-full px-4 py-2 bg-slate-100 rounded-tr-md rounded-br-md text-sm hover:bg-slate-200 transition"
                                            >
                                                Search
                                            </button>
                                        </div>
                                        <span className="text-gray-500 text-sm">or</span>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition"
                                        >
                                            Create optional product
                                        </button>
                                    </div>
                                    {/* product list table */}
                                    {orderItems.length > 0 && (
                                        <table className="relative w-full border-collapse">
                                            <thead className="border-b top-0 inset-x-0 sticky w-full bg-white">
                                                <tr>
                                                    <th className="hover:bg-gray-100 text-left p-3 font-semibold text-xs capitalize">
                                                        Product
                                                    </th>
                                                    <th className="hover:bg-gray-100 text-left p-3 font-semibold text-xs capitalize">
                                                        Quantity
                                                    </th>
                                                    <th className="text-end hover:bg-gray-100 p-3 font-semibold text-xs capitalize">
                                                        Price ($)
                                                    </th>
                                                    <th className="text-end hover:bg-gray-100 p-3 font-semibold text-xs capitalize">
                                                        Amount ($)
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderItems.map((item, index) => (
                                                    <Fragment key={item.productDTO.barcode}>
                                                        <OrderItemRow
                                                            setOrderItems={setOrderItems}
                                                            data={item}
                                                            index={index}
                                                        />
                                                    </Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                {/* Payment */}
                                <div className="bg-white rounded-sm shadow-md border text-sm">
                                    <h4 className="font-semibold p-4">Payment</h4>
                                    <div className="grid grid-cols-2 py-4 border-t border-b">
                                        <div className="px-4 space-y-4 w-full">
                                            <h4 className="font-semibold">Order Note</h4>
                                            <textarea
                                                className="w-full ring-1 ring-slate-300 focus:ring-blue-500 transition p-2 rounded-sm"
                                                name="order_note"
                                                id="order_note"
                                                placeholder="Take your order notes here"
                                            ></textarea>
                                        </div>
                                        <div className="flex w-full justify-between px-4">
                                            <div className="text-left space-y-4">
                                                <div>Product quantity</div>
                                                <div>Total amount</div>
                                                <div>Discount</div>
                                                <div className="font-semibold">Received</div>
                                            </div>
                                            <div className="text-right space-y-4">
                                                <div>{getProductListQty()}</div>
                                                <div>$ {getTotalAmount()}</div>
                                                <div>$ {getDiscount()}</div>
                                                <div>$ {getTotalAmount()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end p-4">
                                        <button
                                            onClick={() => {
                                                if (orderItems.length <= 0) {
                                                    toast.warn('You need to add more items');
                                                } else if (customer === null) {
                                                    toast.warn('Please assign a customer');
                                                } else {
                                                    setModal({ open: true, action: 'create-order' });
                                                }
                                            }}
                                            className="min-w-[4rem] text-white px-4 py-2 rounded-sm bg-blue-500 hover:bg-blue-600 transition"
                                            type="button"
                                        >
                                            Paid
                                        </button>
                                        <button
                                            type="button"
                                            className="min-w-[4rem] text-white px-4 py-2 rounded-sm bg-blue-500 hover:bg-blue-600 transition"
                                        >
                                            Pay later
                                        </button>
                                    </div>
                                </div>
                            </section>
                            {/* Right side */}
                            <section className="space-y-4">
                                {/* Customer */}
                                {customer ? (
                                    <div className="bg-white rounded-sm shadow-md border space-y-4 text-sm">
                                        <div className="p-4 border-b flex items-center justify-between">
                                            <h4 className="font-semibold">Customer Information</h4>
                                            <button onClick={() => setCustomer(null)} type="button">
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="px-4 pb-4 space-y-1">
                                            <Link
                                                className="font-semibold text-blue-500 hover:text-blue-600 transition"
                                                to={`/customers/detail/${customer.firstname}`}
                                            >
                                                {customer.firstname + ' ' + customer.lastname}
                                            </Link>
                                            <p className="text-slate-500">{customer.phone}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <CustomerCard setModal={setModal} />
                                )}
                            </section>
                        </section>
                    </section>
                </section>
                <Modal
                    open={modal.open}
                    setOpen={(value) => setModal((prev) => ({ ...prev, open: value }))}
                    action={modal.action}
                />
            </section>
        </CreateOrderContext.Provider>
    );
};

export default CreateOrder;

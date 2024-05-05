import React, { Fragment, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { OrderPaymentContext } from '~/contexts/pool';
import { Spinner } from '~/icons';
import { orderService } from '~/services';

const paymentMethods = ['Pay by cash', 'Credit card', 'Banking'];

const OrderPaymentModal = ({ setOpen }) => {
    const { orderDetail, setOrderDetail } = useContext(OrderPaymentContext);
    const [isLoading, setIsLoading] = useState(false);
    const [openSubmenu, setOpenSubMenu] = useState(false);
    const [payMethod, setPayMethod] = useState('Pay by cash');
    const [paidAmount, setPaidAmount] = useState(orderDetail?.customerOwed);

    const handleConfirmPayment = async () => {
        setIsLoading(true);
        const savedOrder = await orderService.payOrder({
            orderId: orderDetail?.id,
            received: orderDetail?.received + paidAmount,
            excess: orderDetail?.received + paidAmount - orderDetail?.total,
            customerOwed: orderDetail?.total - (orderDetail?.received + paidAmount),
        });
        setOrderDetail(savedOrder);
        setIsLoading(false);
        setOpen(false);
        toast.success('Pay order successfully!');
    };

    return (
        <div className="w-full">
            <div className="px-4 pb-4 border-b">
                <h2 className="text-xl">Order payment</h2>
            </div>
            <div className="flex items-center justify-between text-sm p-4 border-b">
                <p>Total amount have to be paid</p>
                <p className="font-semibold">$ {orderDetail?.customerOwed}</p>
            </div>
            <div className="flex items-center justify-between p-4 text-sm gap-4 border-b">
                <div
                    onClick={() => setOpenSubMenu(!openSubmenu)}
                    className="relative p-2 rounded-sm w-full focus-within:ring-blue-500 transition ring-1 ring-slate-100 cursor-pointer"
                >
                    <input type="text" value={payMethod} readOnly className="w-full" />
                    {openSubmenu && (
                        <div className="absolute top-[2.5rem] inset-x-0 rounded-sm border shadow-md">
                            <ul>
                                {paymentMethods.map((method) => (
                                    <Fragment key={method}>
                                        <li
                                            onClick={() => {
                                                setPayMethod(method);
                                                setOpenSubMenu(false);
                                            }}
                                            className="p-2 hover:bg-blue-100 bg-white transition"
                                        >
                                            {method}
                                        </li>
                                    </Fragment>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <span>+</span>
                <div className="focus-within:ring-blue-500 transition ring-1 ring-slate-100 rounded-sm p-2">
                    <input
                        className="text-right"
                        type="text"
                        value={paidAmount}
                        onChange={(e) => {
                            if (Number(e.target.value)) {
                                setPaidAmount(Number(e.target.value));
                            }
                        }}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between text-sm p-4 border-b">
                <p>Paid money</p>
                <p className="font-semibold">$ {paidAmount}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 px-4 text-sm">
                <button
                    onClick={() => setOpen(false)}
                    className="min-w-[4rem] py-3 px-4 rounded-sm border bg-white hover:bg-slate-50 transition"
                    type="button"
                >
                    Cancel
                </button>
                <button
                    className="text-white min-w-[4rem] py-3 px-4 rounded-sm bg-blue-500 hover:bg-blue-600 transition"
                    type="button"
                    onClick={handleConfirmPayment}
                >
                    {isLoading ? <Spinner /> : 'Confirm payment'}
                </button>
            </div>
        </div>
    );
};

export default OrderPaymentModal;

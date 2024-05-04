import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { CreateOrderContext } from '~/contexts/pool';
import { orderService } from '~/services';

const paymentMethods = ['Pay by cash', 'Credit card', 'Banking'];

const OrderPaymentModal = ({ setOpen }) => {
    const { orderItems, customer, getTotalAmount, setConfirmChecked, confirmChecked } = useContext(CreateOrderContext);
    const [openSubmenu, setOpenSubMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [payMethod, setPayMethod] = useState('Pay by cash');
    const data = {
        orderItems: orderItems,
        customer: customer,
        totalAmount: getTotalAmount(),
    };

    const [paidAmount, setPaidAmount] = useState(data.totalAmount);

    const getExcessAmount = useCallback(() => {
        return paidAmount - data.totalAmount;
    }, [paidAmount]);

    const handleCreateOrder = async () => {
        setIsLoading(true);
        console.log({
            orderItems: orderItems,
            customer: customer,
            total: data.totalAmount,
            received: paidAmount,
            excess: paidAmount - data.totalAmount,
            confirmed: confirmChecked,
        });
        // const order = await orderService.createOrder({
        //     total: data.totalAmount,
        //     received: paidAmount,
        //     excess: paidAmount - data.totalAmount,
        //     confirmed: true,
        // });
        setIsLoading(false);
    };

    return (
        <div className="w-full">
            <div className="px-4 pb-4 border-b">
                <h2 className="font-semibold">Create Order</h2>
            </div>
            <div className="p-4 flex items-center justify-between border-b text-sm">
                <h4>Total amount</h4>
                <p className="font-semibold">$ {data.totalAmount}</p>
            </div>
            <div className="flex items-center justify-between p-4 text-sm gap-4 border-b">
                <div
                    onFocus={() => setOpenSubMenu(!openSubmenu)}
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
            <div className="p-4 border-b text-sm">
                <div className="flex items-center justify-between">
                    <h4>Paid amount</h4>
                    <p className="font-semibold">$ {paidAmount}</p>
                </div>
                <div className="flex items-center justify-between">
                    <h4>Excess amount</h4>
                    <p className="text-slate-500">$ {getExcessAmount()}</p>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4 px-4 text-sm">
                <div className="space-x-2">
                    <input
                        checked={confirmChecked}
                        onChange={() => setConfirmChecked(!confirmChecked)}
                        type="checkbox"
                        name="order_confirm"
                        id="order_confirm"
                    />
                    <label htmlFor="order_confirm">Confirm this order</label>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(false)}
                        className="min-w-[4rem] py-2 px-4 rounded-sm border bg-white hover:bg-slate-50 transition"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateOrder}
                        className="text-white min-w-[4rem] py-2 px-4 rounded-sm bg-blue-500 hover:bg-blue-600 transition"
                        type="button"
                    >
                        Create order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPaymentModal;

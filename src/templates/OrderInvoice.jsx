import { format } from 'date-fns';
import React, { Fragment, forwardRef, useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { userService } from '~/services';
import { formatArrayDate } from '~/utils';

const OrderInvoice = forwardRef(({ orderDetail }, ref) => {
    const { user } = UserAuth();

    return (
        <div className="p-6 space-y-12" ref={ref}>
            <header>
                <h1 className="text-2xl font-semibold text-center">Sale Dynamics</h1>
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="uppercase font-semibold text-lg">Issued to:</h4>
                            <div>
                                <p className="text-gray-500">
                                    {orderDetail?.customer?.firstname + ' ' + orderDetail?.customer?.lastname}
                                </p>
                                <p className="text-gray-500">{orderDetail?.customer?.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="uppercase font-semibold text-lg">Issued by:</h4>
                            <div>
                                <p className="text-gray-500">{user?.fullName || user?.username}</p>
                                <p className="text-gray-500">{user?.phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <h4 className="uppercase font-semibold text-lg">Invoice no:</h4>

                        <p className="font-semibold">#{orderDetail?.id}</p>
                        <p className="text-gray-500">{orderDetail && formatArrayDate(orderDetail?.createdDate)}</p>
                    </div>
                </div>
            </header>
            {/* Order items */}
            <div className="space-y-6">
                <table className="relative w-full border-collapse border-3 border-blue-500">
                    <thead className="border-b-4 border-blue-500 top-0 inset-x-0 sticky w-full bg-white">
                        <tr>
                            <th className="text-left p-3 font-semibold text-sm capitalize">Product</th>
                            <th className="text-center p-3 font-semibold text-sm capitalize">Quantity</th>
                            <th className="text-right p-3 font-semibold text-sm capitalize">Price ($)</th>
                            <th className="text-right p-3 font-semibold text-sm capitalize">Amount ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetail?.orderItems.map((item, index) => (
                            <Fragment key={item.productDTO.barcode}>
                                <tr>
                                    <td className="py-2">{item.productDTO.name}</td>
                                    <td className="py-2 text-center">{item.quantity}</td>
                                    <td className="py-2 text-right">{item.productDTO.salePrice}</td>
                                    <td className="py-2 text-right">{item.productDTO.salePrice * item.quantity}</td>
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="py-3 border-y border-slate-300 flex items-center justify-between">
                    <h4 className="font-semibold text-lg">TOTAL</h4>
                    <p className="font-semibold text-lg">$ {orderDetail?.total}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center justify-center">
                        {orderDetail && <Barcode value={orderDetail?.id} />}
                    </div>
                    <div className="flex gap-12 px-4">
                        <div className="text-left space-y-2">
                            <div>Discount</div>
                            <div>Customer paid</div>
                            <div>Refund</div>
                            {orderDetail?.excess > 0 ? <div>Excess money</div> : <div>Customer owed</div>}
                            <div className="font-semibold">Received</div>
                        </div>
                        <div className="text-right space-y-2">
                            <p>$ 0</p>
                            <p>$ {orderDetail?.received}</p>
                            <p>$ 0</p>
                            {orderDetail?.excess > 0 ? (
                                <div>$ {orderDetail?.excess}</div>
                            ) : (
                                <div>$ {orderDetail?.customerOwed}</div>
                            )}
                            <p className="font-semibold">$ {orderDetail?.received}</p>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <p className="text-left text-gray-400">
                    If you have any issue on the invoice, feel free to contact our manager. <br />
                    Copyright @ Sale Dynamics Team
                </p>
            </footer>
        </div>
    );
});

export default OrderInvoice;

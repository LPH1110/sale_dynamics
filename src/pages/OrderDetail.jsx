import { ChevronDownIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { Modal, OrderConfirmCard, OrderDetailItemRow, OrderStatus } from '~/components';
import { OrderPaymentContext } from '~/contexts/pool';
import { Spinner } from '~/icons';
import { orderService } from '~/services';
import { OrderInvoice } from '~/templates';
import { formatArrayDate } from '~/utils';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [openActions, setOpenActions] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const [modal, setModal] = useState({
        action: '',
        open: false,
    });

    const invoiceRef = useRef();

    const getProductListQty = useCallback(() => {
        return (
            orderDetail &&
            orderDetail.orderItems.reduce((acc, item) => {
                return (acc += item.quantity);
            }, 0)
        );
    }, [orderDetail]);

    useEffect(() => {
        const getOrder = async () => {
            const order = await orderService.findById(orderId);
            setOrderDetail(order);
        };

        getOrder();
    }, []);

    return (
        <OrderPaymentContext.Provider value={{ orderDetail, setOrderDetail }}>
            <section className="relative h-screen-content overflow-auto bg-gray-100 flex flex-col items-center">
                <section className="container space-y-12">
                    {/* Head section */}
                    <section className="flex items-center justify-between px-4 pt-6">
                        <div className="space-y-2">
                            <div className="flex gap-6">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-500 text-sm">Code</p>
                                    <h1 className="font-semibold text-2xl">#{orderDetail?.id}</h1>
                                </div>
                                <div className="h-full w-[1px] bg-slate-300"></div>
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-500 text-sm">Payment status</p>
                                    <OrderStatus status={orderDetail?.status} />
                                </div>
                            </div>
                            <p>{orderDetail?.createdDate && formatArrayDate(orderDetail.createdDate)}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpenActions(!openActions)}
                                    className="text-sm hover:text-blue-500 transition px-4 py-3 shadow-sm flex items-center justify-center gap-2 bg-slate-200 rounded-md"
                                >
                                    Action{' '}
                                    <span>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </span>
                                </button>
                                {openActions && (
                                    <div className="py-2 text-sm absolute right-0 z-10 top-[3rem] min-w-[12rem] w-full shadow-md rounded-md border bg-white">
                                        <ul className="w-full">
                                            <li className="p-3 hover:bg-blue-500 hover:text-white transition cursor-pointer">
                                                <Link
                                                    className="w-full block"
                                                    to={`/orders/detail/${orderDetail?.id}/refund`}
                                                >
                                                    Refund order
                                                </Link>
                                            </li>
                                            <li className="p-3 hover:bg-blue-500 hover:text-white transition cursor-pointer">
                                                Cancel order
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div>
                                <ReactToPrint
                                    trigger={() => {
                                        return (
                                            <button
                                                type="button"
                                                className="text-sm hover:text-blue-500 transition px-4 py-3 shadow-sm flex items-center justify-center gap-2 bg-slate-200 rounded-md"
                                            >
                                                {isPrinting ? (
                                                    <Spinner />
                                                ) : (
                                                    <>
                                                        Print{' '}
                                                        <span>
                                                            <PrinterIcon className="w-4 h-4" />
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        );
                                    }}
                                    onBeforePrint={() => setIsPrinting(true)}
                                    onAfterPrint={() => setIsPrinting(false)}
                                    content={() => invoiceRef.current}
                                />
                                <div className="hidden">
                                    <OrderInvoice orderDetail={orderDetail} ref={invoiceRef} />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Order body */}
                    <section className="grid grid-cols-4 px-4 gap-6">
                        {/* Left */}
                        <section className="col-span-3 space-y-4">
                            <div className="bg-white shadow-md">
                                <table className="relative w-full border-collapse">
                                    <thead className="border-b top-0 inset-x-0 sticky w-full bg-white">
                                        <tr>
                                            <th className="text-left p-3 font-semibold text-xs capitalize">Product</th>
                                            <th className="text-center p-3 font-semibold text-xs capitalize">
                                                Quantity
                                            </th>
                                            <th className="text-end p-3 font-semibold text-xs capitalize">Price ($)</th>
                                            <th className="text-end p-3 font-semibold text-xs capitalize">
                                                Amount ($)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetail?.orderItems.map((item, index) => (
                                            <Fragment key={item.productDTO.barcode}>
                                                <OrderDetailItemRow data={item} index={index} />
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
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
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="bg-slate-200 hover:bg-slate-300 transition py-2 px-4 rounded-sm"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex w-full justify-between px-4">
                                        <div className="text-left space-y-4">
                                            <div>Product quantity</div>
                                            <div className="font-bold">Total amount</div>
                                            <div>Discount</div>
                                            <div className="font-bold">Customer paid</div>
                                            <div>Refund</div>
                                            {orderDetail?.excess > 0 && <div>Excess money</div>}
                                            <div className="font-bold">Received</div>
                                        </div>
                                        <div className="text-right space-y-4">
                                            <p>{getProductListQty()}</p>
                                            <p className="font-bold">$ {orderDetail?.total}</p>
                                            <p>$ 0</p>
                                            <p className="font-bold">$ {orderDetail?.received}</p>
                                            <p>$ 0</p>
                                            {orderDetail?.excess > 0 && <div>$ {orderDetail.excess}</div>}
                                            <p className="font-bold">$ {orderDetail?.received}</p>
                                        </div>
                                    </div>
                                </div>
                                {orderDetail?.customerOwed > 0 && (
                                    <div className="flex items-center gap-2 justify-end p-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setModal({
                                                    action: 'order-payment',
                                                    open: true,
                                                })
                                            }
                                            className="min-w-[4rem] text-white px-4 py-2 rounded-sm bg-blue-500 hover:bg-blue-600 transition"
                                        >
                                            Pay order
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                        {/* Right */}
                        <section className="space-y-4">
                            <OrderConfirmCard orderDetail={orderDetail} setOrderDetail={setOrderDetail} />
                            <div className="bg-white rounded-sm shadow-md border space-y-4 text-sm">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h4 className="font-semibold">Issued by</h4>
                                </div>
                                <div className="px-4 pb-4 space-y-2">
                                    <Link
                                        to={`/accounts/detail/${orderDetail?.issuer}`}
                                        className="text-blue-500 hover:text-blue-600 transition"
                                    >
                                        {orderDetail?.issuer}
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </section>
                </section>

                <Modal
                    open={modal.open}
                    action={modal.action}
                    setOpen={(value) => setModal((prev) => ({ ...prev, open: value }))}
                />
            </section>
        </OrderPaymentContext.Provider>
    );
};

export default OrderDetail;

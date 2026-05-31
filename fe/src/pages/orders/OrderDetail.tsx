import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  PrinterIcon,
  UserIcon,
  ArrowUturnLeftIcon,
  CheckIcon,
  BanknotesIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  CreditCardIcon,
  EllipsisHorizontalIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import * as orderService from '@/services/order.service';
import { Order } from '@/types/order.types';
import { Badge, Button, Card, Dialog, Input, Spinner } from '@/components/ui';
import clsx from 'clsx';

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Payment popup states
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Confirm states
  const [isConfirming, setIsConfirming] = useState(false);

  // Print section
  const printAreaRef = useRef<HTMLDivElement>(null);

  const fetchOrder = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const data = await orderService.getDetail(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleConfirmOrder = async () => {
    if (!order) return;
    setIsConfirming(true);
    try {
      await orderService.confirm(order.id);
      await fetchOrder();
    } catch (err) {
      console.error('Failed to confirm order:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !amountPaid) return;
    setIsPaying(true);
    try {
      const res = await orderService.pay({
        orderId: order.id,
        received: Number(amountPaid),
        excess: 0,
        customerOwed: 0,
      });
      setOrder(res);
      setPaymentOpen(false);
      setAmountPaid('');
    } catch (err) {
      console.error('Failed to process order payment:', err);
      alert('Payment processing failed. Please check the amount.');
    } finally {
      setIsPaying(false);
    }
  };

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'success';
      case 'UNPAID':
        return 'warning';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'error';
      case 'CONFIRMED':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatDate = (dateArray?: any) => {
    if (!dateArray) return '—';
    if (typeof dateArray === 'string') {
      return new Date(dateArray).toLocaleString('vi-VN');
    }
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day, hour = 0, minute = 0] = dateArray;
      const formattedDate = new Date(year, month - 1, day, hour, minute);
      return formattedDate.toLocaleString('vi-VN');
    }
    return '—';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="w-10 h-10 text-brand-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2 mb-4">This order does not exist or has been archived.</p>
        <Button variant="ghost" onClick={() => navigate('/orders')}>Return to Orders</Button>
      </div>
    );
  }

  const itemsCount = (order.orderItems || []).reduce((sum, item) => sum + item.quantity, 0);
  const outstandingDebt = order.total - order.received;

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">

      {/* 1. FIXED HEADER (Full Width) */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ChevronRightIcon className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Link to="/orders" className="hover:text-brand-500 transition-colors">Orders</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-brand-500 font-medium">#{order.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                Order #{order.id}
              </h1>
              <Badge variant={getStatusVariant(order.status)} className="px-2.5 py-0.5">
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Menu as="div" className="relative">
            <MenuButton as={Button} variant="outline" className="px-3">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-1 shadow-popover ring-1 ring-black/5 outline-hidden z-20">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => navigate(`/orders/detail/${order.id}/refund`)}
                      className={clsx(
                        'w-full flex items-center gap-2 px-4 py-2 text-sm text-left',
                        focus ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50' : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      <ArrowUturnLeftIcon className="w-4 h-4" /> Refund Transaction
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>

          <Button variant="outline" className="flex items-center" onClick={handlePrint}>
            <PrinterIcon className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          {/* Pay Order Option in Header if unpaid */}
          {order.status === 'UNPAID' && outstandingDebt > 0 && (
            <Button onClick={() => setPaymentOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <CreditCardIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Pay Invoice</span>
            </Button>
          )}

          {/* Confirm Button */}
          {order.status === 'UNPAID' && (
            <Button onClick={handleConfirmOrder} isLoading={isConfirming}>
              <CheckIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Confirm</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT (Centered & Constrained) */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 -mr-2 scrollbar-thin">
        <div className="max-w-5xl mx-auto w-full space-y-6 animate-slide-up">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* LEFT COLUMN: Items & Payment Breakdown */}
            <div className="lg:col-span-2 space-y-6">

              {/* Order Items Table */}
              <Card className="p-0 overflow-hidden shadow-sm">
                <div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Order Items ({itemsCount})</h3>
                </div>
                <table className="w-full border-collapse text-left text-sm text-neutral-600 dark:text-neutral-300">
                  <thead className="bg-neutral-50/30 dark:bg-neutral-800/20 text-neutral-500 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3 text-center w-24">Qty</th>
                      <th className="px-6 py-3 text-right w-32">Price</th>
                      <th className="px-6 py-3 text-right w-32">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {(order.orderItems || []).map((item) => (
                      <tr key={item.productDTO?.barcode} className="hover:bg-neutral-50/40 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900 dark:text-neutral-50">
                            {item.productDTO?.name}
                          </div>
                          <div className="text-xs font-mono text-neutral-400 mt-1">
                            {item.productDTO?.barcode}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-neutral-900 dark:text-neutral-50">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(item.productDTO?.salePrice || 0)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-neutral-900 dark:text-neutral-50">
                          {formatCurrency(item.quantity * (item.productDTO?.salePrice || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Payment Summary */}
              <Card className="p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <BanknotesIcon className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Payment Summary</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-neutral-500 dark:text-neutral-400">Discount applied</span>
                    <span className="font-medium text-green-600">-{formatCurrency(0)}</span>
                  </div>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />

                  <div className="flex justify-between items-center text-base font-bold">
                    <span className="text-neutral-900 dark:text-neutral-50">Grand Total</span>
                    <span className="text-brand-600 dark:text-brand-400">{formatCurrency(order.total)}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Customer Paid</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(order.received)}</span>
                    </div>
                    {order.excess > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">Change Returned</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(order.excess)}</span>
                      </div>
                    )}
                    {outstandingDebt > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-red-500 font-medium">Outstanding Balance</span>
                        <span className="font-bold text-red-600">{formatCurrency(outstandingDebt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: Customer & Metadata */}
            <div className="lg:col-span-1 space-y-6">

              {/* Customer Details */}
              <Card className="p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Customer</h3>
                </div>

                {order.customer ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                        {order.customer.firstname?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {order.customer.firstname} {order.customer.lastname}
                        </div>
                        <Link to={`/customers/detail/${order.customer.phone}`} className="text-xs text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                          View Profile
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm pt-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Phone</span>
                        <span className="text-neutral-700 dark:text-neutral-300 font-mono">{order.customer.phone}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Anonymous Walk-in</p>
                  </div>
                )}
              </Card>

              {/* Order Notes */}
              <Card className="p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <DocumentTextIcon className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Order Notes</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                  {order.description || <span className="italic text-neutral-400">No notes attached.</span>}
                </p>
              </Card>

              {/* Metadata */}
              <Card className="p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <InformationCircleIcon className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Details</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Date Created</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{formatDate(order.createdDate)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Issued By</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {order.issuer || 'System'}
                    </span>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Pay Order modal */}
      <Dialog isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Collect Invoice Payment" size="sm">
        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Please enter the amount paid by the customer to settle the outstanding balance of{' '}
            <strong>{formatCurrency(outstandingDebt)}</strong>.
          </p>
          <Input
            label="Amount Paid (VND)"
            type="number"
            required
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder={String(outstandingDebt)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)} disabled={isPaying}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPaying}>
              Submit Payment
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Hidden Invoice print area */}
      <div className="hidden">
        <div ref={printAreaRef} className="p-8 text-neutral-900 bg-white font-sans space-y-6 w-full max-w-[600px]">
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold">SALEDYNAMICS POS</h2>
            <p className="text-xs text-neutral-500 mt-1">Invoice Receipt</p>
          </div>
          <div className="text-xs space-y-1">
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Date:</strong> {formatDate(order.createdDate)}</p>
            <p><strong>Issued by:</strong> {order.issuer}</p>
            <p><strong>Customer:</strong> {order.customer ? `${order.customer.firstname} ${order.customer.lastname} (${order.customer.phone})` : 'Walk-in'}</p>
          </div>
          <div className="h-[1px] bg-neutral-200" />
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-1">Product</th>
                <th className="pb-1 text-center">Qty</th>
                <th className="pb-1 text-right">Price</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.orderItems || []).map((item) => (
                <tr key={item.productDTO?.barcode} className="border-b border-dashed">
                  <td className="py-1.5">{item.productDTO?.name}</td>
                  <td className="py-1.5 text-center">{item.quantity}</td>
                  <td className="py-1.5 text-right">{formatCurrency(item.productDTO?.salePrice || 0)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(item.quantity * (item.productDTO?.salePrice || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs space-y-1.5 text-right font-semibold">
            <p>Total Items: {itemsCount}</p>
            <p className="text-sm font-bold">Grand Total: {formatCurrency(order.total)}</p>
            <p>Received: {formatCurrency(order.received)}</p>
            {order.excess > 0 && <p>Change: {formatCurrency(order.excess)}</p>}
            <p>Status: {order.status}</p>
          </div>
          <div className="text-center pt-6 text-[10px] text-neutral-500 border-t">
            Thank you for shopping with us!
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
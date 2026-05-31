import { Button, Card, Input, Spinner } from '@/components/ui';
import * as orderService from '@/services/order.service';
import { Order } from '@/types/order.types';
import {
  BanknotesIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const OrderRefund: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const data = await orderService.getDetail(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmitting(true);
    try {
      // Mock payment state update to refund status
      await orderService.pay({
        orderId: order.id,
        received: -order.total,
        excess: 0,
        customerOwed: 0,
      });
      navigate(`/orders/detail/${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to process refund.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
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
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Order Not Found
        </h2>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/orders')}>
          Return to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">

      {/* 1. FIXED HEADER (Full Width) */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link to={`/orders/detail/${order.id}`} className="p-2 -ml-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ChevronRightIcon className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Link to="/orders" className="hover:text-brand-500 transition-colors">Orders</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <Link to={`/orders/detail/${order.id}`} className="hover:text-brand-500 transition-colors">#{order.id}</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-brand-500 font-medium">Refund</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              Refund Order
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/orders/detail/${order.id}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="refund-order-form"
            isLoading={isSubmitting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-md border-transparent"
          >
            Confirm Full Refund
          </Button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT (Centered & Constrained) */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 -mr-2 scrollbar-thin">
        <form id="refund-order-form" onSubmit={handleRefundSubmit} className="max-w-3xl mx-auto w-full space-y-6 animate-slide-up">

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-4 text-sm text-red-800 dark:text-red-300">
            <p>
              You are about to initiate a full refund for this transaction. This action will log a negative balance of <strong>{formatCurrency(order.total)}</strong> against the daily sales register.
            </p>
          </div>

          <Card className="p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <DocumentTextIcon className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Invoice Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <UserIcon className="w-5 h-5 text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Customer Name</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                      {order.customer ? `${order.customer.firstname} ${order.customer.lastname}` : 'Walk-in Customer'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 pl-8">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Phone</p>
                    <p className="font-mono">{order.customer?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <BanknotesIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Total Paid to Refund</p>
                    <p className="font-bold text-lg text-neutral-900 dark:text-neutral-50">
                      {formatCurrency(order.received)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <DocumentTextIcon className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Refund Reason</h3>
            </div>

            <div className="pt-2">
              <Input
                label="Notes / Reason for refund"
                required
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Damaged product, incorrect size selection, customer request..."
              />
            </div>
          </Card>

        </form>
      </div>
    </div>
  );
};

export default OrderRefund;
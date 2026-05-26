import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import * as orderService from '@/services/order.service';
import { Order } from '@/types/order.types';
import { Button, Card, Input, Spinner } from '@/components/ui';

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
      <div className="h-96 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Order Not Found
        </h2>
        <Link to="/orders" className="mt-4 text-brand-600 font-semibold hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center text-xs text-neutral-400 gap-1.5">
          <Link to="/orders" className="hover:text-brand-500 hover:underline">
            Orders
          </Link>
          <ChevronRightIcon className="w-3 h-3" />
          <Link to={`/orders/detail/${order.id}`} className="hover:text-brand-500 hover:underline">
            Order #{order.id}
          </Link>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="text-neutral-500 font-medium">Refund</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <ArrowUturnLeftIcon className="w-6 h-6 text-red-500" />
          Refund Order #{order.id}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Initiate refund invoicing for total amount: <strong className="text-neutral-800 dark:text-neutral-200">{formatCurrency(order.total)}</strong>.
        </p>
      </div>

      <form onSubmit={handleRefundSubmit} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Refund Invoice Details
          </h3>
          <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-350">
            <p><strong>Customer Name:</strong> {order.customer ? `${order.customer.firstname} ${order.customer.lastname}` : 'Walk-in Customer'}</p>
            <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
            <p><strong>Total Paid:</strong> {formatCurrency(order.received)}</p>
          </div>

          <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-2" />

          <Input
            label="Refund Reason / Notes"
            required
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="e.g. Damaged product, incorrect size selection"
          />

          <div className="flex gap-2 justify-end mt-4">
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
              isLoading={isSubmitting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Confirm Full Refund
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default OrderRefund;

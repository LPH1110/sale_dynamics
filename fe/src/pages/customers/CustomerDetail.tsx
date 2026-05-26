import { Badge, Button, Card, Spinner } from '@/components/ui';
import * as customerService from '@/services/customer.service';
import { CustomerDTO } from '@/types/customer.types';
import { OrderDTO } from '@/types/order.types';
import {
  CalculatorIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  ScaleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const OrderItemRow: React.FC<{ order: OrderDTO }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      return new Date(dateArray).toLocaleDateString('vi-VN');
    }
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return `${day}/${month}/${year}`;
    }
    return '—';
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden bg-white dark:bg-neutral-900 shadow-sm transition-all">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/orders/detail/${order.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Order #{order.id}
            </Link>
            <Badge variant={getStatusVariant(order.status)} className="text-[10px] px-2 py-0.5">
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-neutral-500">{formatDate(order.createdDate)}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-neutral-900 dark:text-neutral-50">
            {formatCurrency(order.total)}
          </span>
          <div className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            {isOpen ? <ChevronUpIcon className="w-4 h-4 text-neutral-500" /> : <ChevronDownIcon className="w-4 h-4 text-neutral-500" />}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20"
          >
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Order Items
              </p>
              {(order.orderItems || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-neutral-150 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.productDTO?.thumbnails?.[0]?.url ? (
                        <img
                          src={item.productDTO.thumbnails[0].url}
                          alt={item.productDTO.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBagIcon className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/products/detail/${item.productDTO?.barcode}`}
                        className="font-semibold hover:underline text-neutral-800 dark:text-neutral-200"
                      >
                        {item.productDTO?.name}
                      </Link>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">
                    {formatCurrency(item.quantity * (item.productDTO?.salePrice || 0))}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CustomerDetail: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerDTO | null>(null);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomerInfo = async () => {
    if (!phone) return;
    setIsLoading(true);
    try {
      const info = await customerService.getDetail(phone);
      const hist = await customerService.getOrders(phone);
      setCustomer(info);
      setOrders(hist || []);
    } catch (err) {
      console.error('Failed to load customer profile details:', err);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerInfo();
  }, [phone]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = orders.length > 0 ? Math.ceil(totalRevenue / orders.length) : 0;
  const totalOwed = orders.reduce((sum, o) => sum + (o.customerOwed || 0), 0);

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

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Customer Not Found
        </h2>
        <p className="text-sm text-neutral-500 mt-2 mb-4">This profile does not exist or has been removed.</p>
        <Button variant="ghost" onClick={() => navigate('/customers')}>Return to Directory</Button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">

      {/* 1. FIXED HEADER (Full Width) */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link to="/customers" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ChevronRightIcon className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Link to="/customers" className="hover:text-brand-500 transition-colors">Customers</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-brand-500 font-medium">{customer.phone}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {customer.firstname} {customer.lastname}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT (Centered) */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 -mr-2 scrollbar-thin">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="max-w-5xl mx-auto w-full space-y-6"
        >
          {/* Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="flex items-center gap-4 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 rounded-full">
                <CurrencyDollarIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Total Revenue</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mt-0.5">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-[10px] text-brand-600 dark:text-brand-400 mt-1 font-medium">{orders.length} Completed Orders</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-full">
                <CalculatorIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Average Value</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mt-0.5">
                  {formatCurrency(avgOrder)}
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">Per transaction</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full">
                <ScaleIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Owed Debt</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">
                  {formatCurrency(totalOwed)}
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">Outstanding balance</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Orders list history (Left) */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <ShoppingBagIcon className="w-5 h-5 text-brand-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                  Purchase History
                </h3>
              </div>

              {orders.length === 0 ? (
                <Card className="py-16 flex flex-col items-center justify-center text-center text-neutral-500 shadow-sm border-dashed">
                  <ShoppingBagIcon className="w-12 h-12 mb-3 text-neutral-300 dark:text-neutral-600" />
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No purchase history</p>
                  <p className="text-xs mt-1 text-neutral-400">This customer hasn't made any orders yet.</p>
                </Card>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {orders.map((order) => (
                    <motion.div key={order.id} variants={itemVariants}>
                      <OrderItemRow order={order} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Customer Info details card (Right) */}
            <div className="md:col-span-4">
              <Card className="shadow-sm space-y-6 p-6">
                <div className="flex items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg shadow-inner">
                    {customer.firstname?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 leading-tight">
                      {customer.firstname} {customer.lastname}
                    </h4>
                    <Badge variant="neutral" className="mt-1 font-mono text-[10px]">VIP Member</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <PhoneIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Phone Number</p>
                      <p className="font-mono">{customer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <EnvelopeIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Email Address</p>
                      <p>{customer.email || <span className="italic text-neutral-400">Not provided</span>}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <IdentificationIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Gender</p>
                      <p className="capitalize">{customer.gender || <span className="italic text-neutral-400">Unspecified</span>}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <MapPinIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Physical Address</p>
                      <p>{customer.address || <span className="italic text-neutral-400">No address recorded</span>}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDetail;
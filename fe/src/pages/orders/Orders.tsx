import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import * as orderService from '@/services/order.service';
import * as userService from '@/services/user.service';
import { Order } from '@/types/order.types';
import { Badge, Button, DataTableSection } from '@/components/ui';
import { Column } from '@/components/ui/Table';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdFromFilter, setCreatedFromFilter] = useState('');
  const [createdToFilter, setCreatedToFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  const isAdmin = user?.authorities?.some(r => r.authority === 'ADMIN');

  const fetchOrders = async (pageNum = currentPage) => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const pageRes = await orderService.getPage(pageNum, pageSize);
        setOrders(pageRes.content);
        setTotalElements(pageRes.totalElements);
        setTotalPages(pageRes.totalPages);

        // Handle out-of-bounds page fallback
        if (pageRes.number >= pageRes.totalPages && pageRes.totalPages > 0) {
          setCurrentPage(pageRes.totalPages - 1);
          fetchOrders(pageRes.totalPages - 1);
          return;
        }
      } else if (user?.username) {
        const data = await userService.getOrders(user.username);
        setOrders(data);
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [user, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const customerName = `${o.customer?.firstname || ''} ${o.customer?.lastname || ''}`.toLowerCase();
    const matchSearch = (
      String(o.id).includes(term) ||
      customerName.includes(term) ||
      (o.status || '').toLowerCase().includes(term)
    );

    const matchStatus = !statusFilter || (o.status || '').toUpperCase() === statusFilter;

    const orderDate = o.createdDate ? new Date(o.createdDate) : null;

    const fromDate = createdFromFilter ? new Date(`${createdFromFilter}T00:00:00`) : null;
    const toDate = createdToFilter ? new Date(`${createdToFilter}T23:59:59`) : null;
    const matchFrom = !fromDate || (orderDate ? orderDate >= fromDate : true);
    const matchTo = !toDate || (orderDate ? orderDate <= toDate : true);

    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const hasAdvancedFilters = Boolean(statusFilter || createdFromFilter || createdToFilter);
  const isServerSide = isAdmin && !searchTerm.trim() && !hasAdvancedFilters;
  const displayOrders = isServerSide 
    ? filteredOrders 
    : filteredOrders.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const displayTotalElements = isServerSide ? totalElements : filteredOrders.length;
  const displayTotalPages = isServerSide ? totalPages : Math.ceil(filteredOrders.length / pageSize);

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
    // Handle array date representation [yyyy, mm, dd, hh, mm] from Spring Boot
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day, hour = 0, minute = 0] = dateArray;
      const formattedDate = new Date(year, month - 1, day, hour, minute);
      return formattedDate.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const columns: Column<Order>[] = [
    {
      header: 'Order Code',
      className: 'font-mono text-xs font-semibold text-brand-600 dark:text-brand-400',
      headerClassName: 'w-24',
      render: (order) => (
        <Link to={`/orders/detail/${order.id}`} className="hover:underline">
          #{order.id}
        </Link>
      ),
    },
    {
      header: 'Customer Name',
      className: 'font-medium text-neutral-900 dark:text-neutral-55',
      render: (order) => order.customer
        ? `${order.customer.firstname} ${order.customer.lastname}`
        : 'Walk-in Customer',
    },
    {
      header: 'Created Date',
      className: 'text-neutral-500',
      render: (order) => formatDate(order.createdDate),
    },
    {
      header: 'Status',
      render: (order) => (
        <Badge variant={getStatusVariant(order.status)}>
          {order.status}
        </Badge>
      ),
    },
    {
      header: 'Total Amount',
      className: 'font-bold text-neutral-900 dark:text-neutral-50 text-right',
      headerClassName: 'text-right',
      render: (order) => formatCurrency(order.total),
    },
    {
      header: '',
      className: 'w-12',
      render: (order) => (
        <Link
          to={`/orders/detail/${order.id}`}
          className="p-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors block"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            POS Sales & Orders
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {isAdmin
              ? 'View all customer transactions, order status, and checkout history across staff accounts.'
              : 'Track your personal sales checkouts, create transactions, and manage payments.'}
          </p>
        </div>

        <Button
          onClick={() => navigate('/orders/create-new')}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" /> New Checkout
        </Button>
      </div>

      <DataTableSection
        data={displayOrders}
        columns={columns}
        keyExtractor={(o) => o.id}
        selectable
        isLoading={isLoading}
        emptyTitle="No orders found"
        emptyDescription="Create a new sale transaction to begin tracking."
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(0);
        }}
        searchPlaceholder="Search order ID, customer name, status..."
        showFilterButton
        filterContent={(
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-55 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">All</option>
                <option value="PAID">PAID</option>
                <option value="UNPAID">UNPAID</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Created From</label>
              <input
                type="date"
                value={createdFromFilter}
                onChange={(e) => {
                  setCreatedFromFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-55 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Created To</label>
              <input
                type="date"
                value={createdToFilter}
                onChange={(e) => {
                  setCreatedToFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-55 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStatusFilter('');
                  setCreatedFromFilter('');
                  setCreatedToFilter('');
                  setCurrentPage(0);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
        pagination={{
          currentPage,
          totalPages: displayTotalPages,
          totalElements: displayTotalElements,
          pageSize,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default Orders;

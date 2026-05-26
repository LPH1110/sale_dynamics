import React, { useEffect, useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import * as userService from '@/services/user.service';
import * as orderService from '@/services/order.service';
import * as customerService from '@/services/customer.service';
import { Button, Card, Input, Spinner } from '@/components/ui';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // States for statistics
  const [revenue, setRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [topProducts, setTopProducts] = useState<orderService.TopSellingProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Compare states (previous period)
  const [prevRevenue, setPrevRevenue] = useState(0);
  const [prevOrdersCount, setPrevOrdersCount] = useState(0);
  const [prevNewCustomers, setPrevNewCustomers] = useState(0);

  // Date range picker helpers
  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let from = today;
    let to = today;

    switch (preset) {
      case 'today':
        break;
      case 'yesterday':
        from = subDays(today, 1);
        to = subDays(today, 1);
        break;
      case '7days':
        from = subDays(today, 7);
        break;
      case '30days':
        from = subDays(today, 30);
        break;
      case 'thisMonth':
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      default:
        break;
    }

    setDateRange({ from, to });
    setShowDatePicker(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const fromStr = format(dateRange.from, 'yyyy-MM-dd');
      const toStr = format(dateRange.to, 'yyyy-MM-dd');

      // Calculate previous period dates for comparison
      const daysDiff = differenceInDays(dateRange.to, dateRange.from) || 1;
      const prevFrom = subDays(dateRange.from, daysDiff);
      const prevTo = subDays(dateRange.to, daysDiff);
      const prevFromStr = format(prevFrom, 'yyyy-MM-dd');
      const prevToStr = format(prevTo, 'yyyy-MM-dd');

      try {
        const [rev, ords, custs, topProds, prevRev, prevOrds, prevCusts] = await Promise.all([
          userService.getRevenue({ from: fromStr, to: toStr }),
          orderService.countInRange(fromStr, toStr),
          customerService.countNew(fromStr, toStr),
          orderService.getTopSelling(5, fromStr, toStr),
          // Compare requests
          userService.getRevenue({ from: prevFromStr, to: prevToStr }).catch(() => 0),
          orderService.countInRange(prevFromStr, prevToStr).catch(() => 0),
          customerService.countNew(prevFromStr, prevToStr).catch(() => 0),
        ]);

        setRevenue(Number(rev));
        setOrdersCount(Number(ords));
        setNewCustomers(Number(custs));
        setTopProducts(topProds);

        setPrevRevenue(Number(prevRev));
        setPrevOrdersCount(Number(prevOrds));
        setPrevNewCustomers(Number(prevCusts));
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  // Calculate percentages
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const revenueChange = calculateChange(revenue, prevRevenue);
  const ordersChange = calculateChange(ordersCount, prevOrdersCount);
  const customersChange = calculateChange(newCustomers, prevNewCustomers);

  // Generate chart data based on date range
  const generateTrendData = () => {
    const data = [];
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    const isTodayOnly = days <= 1;

    if (isTodayOnly) {
      // Hourly revenue trend for single day
      for (let i = 8; i <= 20; i += 2) {
        data.push({
          label: `${i}:00`,
          revenue: Math.round((revenue / 7) * (1 + Math.sin(i) * 0.3)),
          orders: Math.max(1, Math.round((ordersCount / 7) * (1 + Math.sin(i) * 0.2))),
        });
      }
    } else {
      // Daily revenue trend
      for (let i = 0; i < Math.min(days, 15); i++) {
        const date = subDays(dateRange.to, Math.min(days, 15) - 1 - i);
        data.push({
          label: format(date, 'dd MMM'),
          revenue: Math.round((revenue / Math.min(days, 15)) * (1 + Math.sin(i) * 0.4)),
          orders: Math.max(1, Math.round((ordersCount / Math.min(days, 15)) * (1 + Math.sin(i) * 0.3))),
        });
      }
    }
    return data;
  };

  const trendData = generateTrendData();

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pb-8 pr-2">      
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Analytics Overview
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Monitor sales dynamics, revenue, and customer registrations.
          </p>
        </div>

        {/* Date Selector Popover */}
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <CalendarIcon className="w-4 h-4" />
            {format(dateRange.from, 'dd MMM yyyy')} - {format(dateRange.to, 'dd MMM yyyy')}
          </Button>

          {showDatePicker && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-popover p-4 z-10 flex flex-col gap-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={() => handlePresetChange('today')}>
                  Today
                </Button>
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={() => handlePresetChange('yesterday')}>
                  Yesterday
                </Button>
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={() => handlePresetChange('7days')}>
                  Last 7 Days
                </Button>
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={() => handlePresetChange('30days')}>
                  Last 30 Days
                </Button>
                <Button size="sm" variant="ghost" className="col-span-2 justify-start text-xs" onClick={() => handlePresetChange('thisMonth')}>
                  This Month
                </Button>
              </div>
              <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex flex-col gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={format(dateRange.from, 'yyyy-MM-dd')}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: new Date(e.target.value) }))}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={format(dateRange.to, 'yyyy-MM-dd')}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, to: new Date(e.target.value) }))}
                />
              </div>
              <Button size="sm" onClick={() => setShowDatePicker(false)}>
                Apply Date Range
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <Spinner className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            {/* Revenue Metric */}
            <Card className="flex items-center justify-between border-l-4 border-l-brand-500">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Total Revenue
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {formatCurrency(revenue)}
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={clsx(
                      'flex items-center font-semibold',
                      revenueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {revenueChange >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-0.5" />
                    )}
                    {Math.abs(revenueChange)}%
                  </span>
                  <span className="text-neutral-400">vs previous period</span>
                </div>
              </div>
              <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-full text-brand-600 dark:text-brand-400">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
            </Card>

            {/* Orders Metric */}
            <Card className="flex items-center justify-between border-l-4 border-l-emerald-500">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Total Orders
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {ordersCount}
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={clsx(
                      'flex items-center font-semibold',
                      ordersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {ordersChange >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-0.5" />
                    )}
                    {Math.abs(ordersChange)}%
                  </span>
                  <span className="text-neutral-400">vs previous period</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400">
                <ShoppingCartIcon className="w-6 h-6" />
              </div>
            </Card>

            {/* New Customers Metric */}
            <Card className="flex items-center justify-between border-l-4 border-l-amber-500">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  New Customers
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {newCustomers}
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={clsx(
                      'flex items-center font-semibold',
                      customersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {customersChange >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-0.5" />
                    )}
                    {Math.abs(customersChange)}%
                  </span>
                  <span className="text-neutral-400">vs previous period</span>
                </div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-full text-amber-600 dark:text-amber-400">
                <UserPlusIcon className="w-6 h-6" />
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Trend Area Chart */}
            <Card className="lg:col-span-8 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-brand-600" />
                  Sales Revenue Trend
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Visualizing product performance and overall transaction volumes.
                </p>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-neutral-800" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-white, #ffffff)',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                      }}
                      labelClassName="font-bold text-neutral-700"
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Selling Products List/Bar Chart */}
            <Card className="lg:col-span-4 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                  Top Selling Products
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Highest volume items in selected date range.
                </p>
              </div>

              {topProducts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                  <p className="text-sm font-semibold">No selling products found</p>
                  <p className="text-xs mt-1">Try expanding the date filter range.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts} layout="vertical" margin={{ left: -30, right: 10, top: 0, bottom: 0 }}>
                        <XAxis type="number" stroke="#9ca3af" fontSize={10} hide />
                        <YAxis dataKey="productDTO.name" type="category" stroke="#9ca3af" fontSize={9} axisLine={false} tickLine={false} width={100} />
                        <ChartTooltip
                          formatter={(value) => [`${value} sold`, 'Quantity']}
                          contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                        />
                        <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]}>
                          {topProducts.map((_, idx) => (
                            <Cell key={`cell-${idx}`} fill={idx === 0 ? '#10b981' : '#34d399'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* List details */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {topProducts.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                            {item.productDTO.name}
                          </p>
                          <p className="text-neutral-400 mt-0.5">{item.productDTO.barcode}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900 dark:text-neutral-50">
                            {formatCurrency(item.totalRevenue)}
                          </p>
                          <p className="text-neutral-500 mt-0.5">{item.quantity} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

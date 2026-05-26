import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import * as productService from '@/services/product.service';
import * as customerService from '@/services/customer.service';
import * as orderService from '@/services/order.service';
import { ProductDTO } from '@/types/product.types';
import { Customer } from '@/types/customer.types';
import { OrderItemDTO } from '@/types/order.types';
import { Card, Button, Input, Spinner, Dialog } from '@/components/ui';

export const CreateOrder: React.FC = () => {
  const navigate = useNavigate();

  // Cart & checkout states
  const [cartItems, setCartItems] = useState<OrderItemDTO[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderNote, setOrderNote] = useState('');

  // Product Search states
  const [productQuery, setProductQuery] = useState('');
  const [searchedProducts, setSearchedProducts] = useState<ProductDTO[]>([]);
  const [isProductSearching, setIsProductSearching] = useState(false);

  // Customer Search states
  const [customerQuery, setCustomerQuery] = useState('');
  const [searchedCustomers, setSearchedCustomers] = useState<Customer[]>([]);
  const [isCustomerSearching, setIsCustomerSearching] = useState(false);

  // New Customer creation modal states
  const [isNewCustOpen, setIsNewCustOpen] = useState(false);
  const [newCustFirst, setNewCustFirst] = useState('');
  const [newCustLast, setNewCustLast] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustLoading, setNewCustLoading] = useState(false);

  // Submission / Double-Click Lock states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'PAID' | 'UNPAID'>('PAID');

  // Debounce product searches
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (productQuery.trim().length >= 2) {
        setIsProductSearching(true);
        try {
          const res = await productService.search(productQuery);
          // Only show active (non-disabled) products
          setSearchedProducts(res.filter(p => !p.deletedAt));
        } catch (err) {
          console.error(err);
        } finally {
          setIsProductSearching(false);
        }
      } else {
        setSearchedProducts([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [productQuery]);

  // Debounce customer searches
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (customerQuery.trim().length >= 2) {
        setIsCustomerSearching(true);
        try {
          const res = await customerService.search(customerQuery);
          setSearchedCustomers(res);
        } catch (err) {
          console.error(err);
        } finally {
          setIsCustomerSearching(false);
        }
      } else {
        setSearchedCustomers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [customerQuery]);

  // Add Product to Cart
  const handleAddToCart = (product: ProductDTO) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productDTO.barcode === product.barcode);
      if (existing) {
        return prev.map((item) =>
          item.productDTO.barcode === product.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productDTO: product, quantity: 1 }];
    });
    setProductQuery('');
    setSearchedProducts([]);
  };

  const handleUpdateQty = (barcode: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productDTO.barcode === barcode) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (barcode: string) => {
    setCartItems((prev) => prev.filter((item) => item.productDTO.barcode !== barcode));
  };

  // Math totals
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.productDTO.salePrice, 0);
  const discount = 0; // standard checkout discount
  const finalAmount = subtotal - discount;

  // Checkout submission with Double-Click Lock
  const handleCheckout = async (mode: 'PAID' | 'UNPAID') => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please search and add products.');
      return;
    }
    if (!selectedCustomer) {
      alert('Please assign a customer for checkout invoicing.');
      return;
    }

    setIsSubmitting(true);
    setPaymentMode(mode);

    try {
      // 1. Create order draft
      const orderRes = await orderService.create({
        customer: selectedCustomer,
        orderItems: cartItems.map(item => ({
          productDTO: { barcode: item.productDTO.barcode } as any,
          quantity: item.quantity
        })),
        description: orderNote,
        total: finalAmount,
      });

      // 2. Process payment state immediately if mode is PAID
      if (mode === 'PAID') {
        await orderService.pay({
          orderId: orderRes.id,
          received: finalAmount,
          excess: 0,
          customerOwed: 0,
        });
      }

      navigate(`/orders/detail/${orderRes.id}`);
    } catch (error) {
      console.error('Checkout transaction failed:', error);
      alert('Failed to complete sale transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Customer Inline
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustFirst || !newCustPhone) return;
    setNewCustLoading(true);
    try {
      const newCust = await customerService.create({
        firstname: newCustFirst,
        lastname: newCustLast,
        phone: newCustPhone,
      });
      setSelectedCustomer(newCust);
      setCustomerQuery('');
      setSearchedCustomers([]);
      setIsNewCustOpen(false);
      // reset forms
      setNewCustFirst('');
      setNewCustLast('');
      setNewCustPhone('');
    } catch (err) {
      console.error(err);
      alert('Failed to register customer. Phone number might already exist.');
    } finally {
      setNewCustLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* POS Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Checkout Terminal (POS)
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Fast checkout terminal. Search products, link customer cards, and complete transaction logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart & Items List (Left) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Product Search Card */}
          <Card className="space-y-4 relative">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Select Products
            </h3>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products by title, barcode, sku..."
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-955 dark:text-neutral-55 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              {isProductSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner className="w-4 h-4 text-brand-600 animate-spin" />
                </div>
              )}
            </div>

            {/* Results Overlay */}
            {searchedProducts.length > 0 && (
              <div className="absolute left-4 right-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-popover z-10 max-h-60 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 animate-slide-up">
                {searchedProducts.map((p) => (
                  <button
                    key={p.barcode}
                    type="button"
                    onClick={() => handleAddToCart(p)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-50">
                        {p.name}
                      </p>
                      <p className="text-xs text-neutral-400">Barcode: {p.barcode}</p>
                    </div>
                    <span className="font-bold text-sm text-brand-600 dark:text-brand-400">
                      {formatCurrency(p.salePrice)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Cart Table */}
            {cartItems.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md">
                <ShoppingCartIcon className="w-12 h-12 mb-2" />
                <span className="text-xs font-semibold">Your cart is empty</span>
                <span className="text-[10px] mt-0.5">Use search bar above to add items</span>
              </div>
            ) : (
              <div className="overflow-x-auto pt-2">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-semibold">
                    <tr>
                      <th className="pb-2">Product Name</th>
                      <th className="pb-2 w-28 text-center">Quantity</th>
                      <th className="pb-2 text-right w-24">Price</th>
                      <th className="pb-2 text-right w-24">Amount</th>
                      <th className="pb-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {cartItems.map((item) => (
                      <tr key={item.productDTO.barcode} className="hover:bg-neutral-50/30">
                        <td className="py-3 font-semibold text-neutral-900 dark:text-neutral-150">
                          {item.productDTO.name}
                          <span className="block text-[10px] font-mono font-normal text-neutral-400 mt-0.5">
                            {item.productDTO.barcode}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.productDTO.barcode, -1)}
                              className="p-1 rounded-sm border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.productDTO.barcode, 1)}
                              className="p-1 rounded-sm border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-right font-medium">
                          {formatCurrency(item.productDTO.salePrice)}
                        </td>
                        <td className="py-3 text-right font-bold text-neutral-900 dark:text-neutral-50">
                          {formatCurrency(item.quantity * item.productDTO.salePrice)}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.productDTO.barcode)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Payment & Invoice totals */}
          <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Order Notes
              </h4>
              <textarea
                placeholder="Take order details or shipping guidelines here..."
                rows={4}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-955 dark:text-neutral-55 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Items Quantity:</span>
                  <span className="font-semibold">{totalQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal Amount:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Discount applied:</span>
                  <span className="font-semibold text-green-600">-{formatCurrency(discount)}</span>
                </div>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-1" />
                <div className="flex justify-between text-base font-bold">
                  <span>Grand Total:</span>
                  <span className="text-brand-600 dark:text-brand-400">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Submission Panel with double submission lock */}
              <div className="flex gap-2 justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleCheckout('UNPAID')}
                  isLoading={isSubmitting && paymentMode === 'UNPAID'}
                  disabled={isSubmitting}
                >
                  Pay Later
                </Button>
                <Button
                  onClick={() => handleCheckout('PAID')}
                  isLoading={isSubmitting && paymentMode === 'PAID'}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                >
                  Complete & Pay
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer Assignment Panel (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer card status */}
          <Card className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Customer Card
              </h3>
              {selectedCustomer && (
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-red-500 hover:underline flex items-center gap-0.5"
                >
                  <XMarkIcon className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            {selectedCustomer ? (
              <div className="space-y-3 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-md border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400 rounded-full">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-50">
                      {selectedCustomer.firstname} {selectedCustomer.lastname}
                    </p>
                    <p className="text-xs text-neutral-400">Phone: {selectedCustomer.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by phone number or name..."
                    value={customerQuery}
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-955 dark:text-neutral-55 focus:outline-hidden focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  />
                  {isCustomerSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Spinner className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Customer Results */}
                {searchedCustomers.length > 0 && (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-popover max-h-48 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                    {searchedCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setCustomerQuery('');
                          setSearchedCustomers([]);
                        }}
                        className="w-full flex items-center justify-between p-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-xs transition-colors"
                      >
                        <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {c.firstname} {c.lastname}
                        </p>
                        <span className="text-neutral-400 font-mono">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-2" />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs flex items-center justify-center gap-1.5"
                  onClick={() => setIsNewCustOpen(true)}
                >
                  <UserPlusIcon className="w-4 h-4" /> Create New Customer
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Register New Customer Modal */}
      <Dialog
        isOpen={isNewCustOpen}
        onClose={() => setIsNewCustOpen(false)}
        title="Register Customer Card"
        size="sm"
      >
        <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4">
          <Input
            label="First Name"
            placeholder="John"
            required
            value={newCustFirst}
            onChange={(e) => setNewCustFirst(e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={newCustLast}
            onChange={(e) => setNewCustLast(e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="09XXXXXXXX"
            required
            value={newCustPhone}
            onChange={(e) => setNewCustPhone(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewCustOpen(false)}
              disabled={newCustLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={newCustLoading}>
              Register Customer
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateOrder;

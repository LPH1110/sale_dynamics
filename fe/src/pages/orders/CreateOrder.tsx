import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  UserIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import * as productService from '@/services/product.service';
import * as customerService from '@/services/customer.service';
import * as orderService from '@/services/order.service';
import { ProductDTO } from '@/types/product.types';
import { Customer } from '@/types/customer.types';
import { OrderItemDTO } from '@/types/order.types';
import { Card, Button, Input, Spinner, Dialog } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
        issuer: user?.username,
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
              <span className="text-brand-500 font-medium">New POS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Checkout Terminal
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
            onClick={() => {
              setCartItems([]);
              setSelectedCustomer(null);
              setOrderNote('');
            }}
            disabled={cartItems.length === 0 && !selectedCustomer && !orderNote}
          >
            <TrashIcon className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Clear Cart</span>
          </Button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT (Centered & Constrained) */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 -mr-2 scrollbar-thin">
        <div className="max-w-6xl mx-auto w-full space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: Cart & Checkout (8 cols) */}
            <div className="lg:col-span-8 space-y-6">

              {/* Product Search */}
              <div className="relative z-20">
                <div className="relative shadow-sm group">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search products by title, barcode, sku..."
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow shadow-sm"
                  />
                  {isProductSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Spinner className="w-5 h-5 text-brand-600" />
                    </div>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchedProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-popover max-h-[300px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 animate-slide-up">
                    {searchedProducts.map((p) => (
                      <button
                        key={p.barcode}
                        type="button"
                        onClick={() => handleAddToCart(p)}
                        className="w-full flex items-center gap-4 p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                          {p.thumbnails && p.thumbnails.length > 0 ? (
                            <img src={p.thumbnails[0].url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <CubeIcon className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-neutral-400 font-mono truncate">{p.barcode}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-sm text-brand-600 dark:text-brand-400">
                            {formatCurrency(p.salePrice)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Table */}
              <Card className="p-0 overflow-hidden shadow-sm">
                <div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Current Cart ({totalQuantity})</h3>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-neutral-400">
                    <ShoppingCartIcon className="w-16 h-16 mb-4 text-neutral-300 dark:text-neutral-700" />
                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Your cart is currently empty</span>
                    <span className="text-xs mt-1">Use the search bar above to scan or find items.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm text-neutral-600 dark:text-neutral-300">
                      <thead className="bg-neutral-50/30 dark:bg-neutral-800/20 text-neutral-500 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Product Name</th>
                          <th className="px-6 py-3 text-center w-32">Quantity</th>
                          <th className="px-6 py-3 text-right w-28">Price</th>
                          <th className="px-6 py-3 text-right w-32">Amount</th>
                          <th className="px-4 py-3 w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {cartItems.map((item) => (
                          <tr key={item.productDTO.barcode} className="hover:bg-neutral-50/40 dark:hover:bg-neutral-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-neutral-900 dark:text-neutral-50">
                                {item.productDTO.name}
                              </div>
                              <div className="text-xs font-mono text-neutral-400 mt-1">
                                {item.productDTO.barcode}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-md border border-neutral-200 dark:border-neutral-700 w-fit mx-auto">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.productDTO.barcode, -1)}
                                  className="p-1 rounded bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors shadow-sm text-neutral-600 dark:text-neutral-300"
                                >
                                  <MinusIcon className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center font-bold text-neutral-900 dark:text-neutral-50">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.productDTO.barcode, 1)}
                                  className="p-1 rounded bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors shadow-sm text-neutral-600 dark:text-neutral-300"
                                >
                                  <PlusIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {formatCurrency(item.productDTO.salePrice)}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-neutral-900 dark:text-neutral-50">
                              {formatCurrency(item.quantity * item.productDTO.salePrice)}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(item.productDTO.barcode)}
                                className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Order Notes */}
              <Card className="p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <DocumentTextIcon className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Order Notes</h3>
                </div>
                <textarea
                  placeholder="Take order details or shipping guidelines here..."
                  rows={3}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-inner"
                />
              </Card>
            </div>

            {/* RIGHT COLUMN: Customer & Payment Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Customer Assignment Panel */}
              <Card className="p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Customer Card</h3>
                  </div>
                  {selectedCustomer && (
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {selectedCustomer ? (
                  <div className="flex items-center gap-4 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-100 dark:border-brand-800">
                    <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-300 font-bold shadow-sm">
                      {selectedCustomer.firstname?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-brand-900 dark:text-brand-100">
                        {selectedCustomer.firstname} {selectedCustomer.lastname}
                      </p>
                      <p className="text-sm text-brand-600 dark:text-brand-400 font-mono mt-0.5">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 relative z-10">
                    <div className="relative group">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 group-focus-within:text-brand-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search phone or name..."
                        value={customerQuery}
                        onChange={(e) => setCustomerQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:bg-white text-neutral-900 dark:text-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
                      />
                      {isCustomerSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Spinner className="w-4 h-4 text-brand-600" />
                        </div>
                      )}
                    </div>

                    {/* Customer Results Overlay */}
                    {searchedCustomers.length > 0 && (
                      <div className="absolute top-[46px] left-0 right-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-popover max-h-48 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 z-10">
                        {searchedCustomers.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerQuery('');
                              setSearchedCustomers([]);
                            }}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors group"
                          >
                            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 group-hover:text-brand-700 dark:group-hover:text-brand-400">
                              {c.firstname} {c.lastname}
                            </p>
                            <span className="text-xs text-neutral-400 font-mono">{c.phone}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
                      <span className="text-xs font-medium text-neutral-400 uppercase">Or</span>
                      <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() => setIsNewCustOpen(true)}
                    >
                      <UserPlusIcon className="w-4 h-4 mr-2" /> Add New Customer
                    </Button>
                  </div>
                )}
              </Card>

              {/* Payment Summary */}
              <Card className="p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <BanknotesIcon className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Checkout Summary</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-neutral-500 dark:text-neutral-400">Discount applied</span>
                    <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                  </div>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />

                  <div className="flex justify-between items-center text-lg font-black">
                    <span className="text-neutral-900 dark:text-neutral-50">Grand Total</span>
                    <span className="text-brand-600 dark:text-brand-400">{formatCurrency(finalAmount)}</span>
                  </div>

                  <div className="mt-6 pt-4 space-y-3 flex flex-col">
                    <Button
                      variant="outline"
                      onClick={() => handleCheckout('UNPAID')}
                      isLoading={isSubmitting && paymentMode === 'UNPAID'}
                      disabled={isSubmitting || cartItems.length === 0}
                      className="w-full border-neutral-300 dark:border-neutral-700"
                    >
                      Save as Unpaid Draft
                    </Button>
                    <Button
                      onClick={() => handleCheckout('PAID')}
                      isLoading={isSubmitting && paymentMode === 'PAID'}
                      disabled={isSubmitting || cartItems.length === 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    >
                      Complete & Pay Now
                    </Button>
                  </div>
                </div>
              </Card>

            </div>
          </div>
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
          <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="ghost"
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
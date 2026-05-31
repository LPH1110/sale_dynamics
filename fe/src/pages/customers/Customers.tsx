import { Button, DataTableSection, Dialog, Input } from '@/components/ui';
import { Column } from '@/components/ui/Table';
import * as customerService from '@/services/customer.service';
import { CustomerDTO } from '@/types/customer.types';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Customers: React.FC = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [phonePrefixFilter, setPhonePrefixFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // New customer modal
  const [createOpen, setCreateOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchCustomers = async (pageNum = currentPage) => {
    setIsLoading(true);
    try {
      if (searchTerm.trim()) {
        const data = await customerService.getAll();
        setCustomers(Array.isArray(data) ? data : []);
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        const pageRes = await customerService.getPage(pageNum, pageSize);
        setCustomers(pageRes.content);
        setTotalElements(pageRes.totalElements);
        setTotalPages(pageRes.totalPages);

        // Handle out-of-bounds page fallback
        if (pageRes.number >= pageRes.totalPages && pageRes.totalPages > 0) {
          setCurrentPage(pageRes.totalPages - 1);
          fetchCustomers(pageRes.totalPages - 1);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone) return;
    setIsCreating(true);
    try {
      const res = await customerService.create({
        firstname: firstName,
        lastname: lastName,
        phone,
      });
      setCreateOpen(false);
      setFirstName('');
      setLastName('');
      setPhone('');
      fetchCustomers();
      navigate(`/customers/detail/${res.phone}`);
    } catch (err) {
      console.error(err);
      alert('Failed to register customer. Phone number might already exist.');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.firstname || ''} ${c.lastname || ''}`.toLowerCase();
    const matchSearch = fullName.includes(term) || (c.phone && c.phone.includes(term)) || false;
    const matchPhonePrefix = !phonePrefixFilter.trim() || (c.phone || '').startsWith(phonePrefixFilter.trim());
    return matchSearch && matchPhonePrefix;
  });

  const isServerSide = !searchTerm.trim();
  const displayCustomers = isServerSide
    ? filteredCustomers
    : filteredCustomers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const displayTotalElements = isServerSide ? totalElements : filteredCustomers.length;
  const displayTotalPages = isServerSide ? totalPages : Math.ceil(filteredCustomers.length / pageSize);

  const columns: Column<CustomerDTO>[] = [
    {
      header: '',
      className: 'w-12 text-center',
      headerClassName: 'w-12 text-center',
      render: (cust) => (
        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center font-bold text-xs">
          {cust.firstname?.[0] || 'U'}
        </div>
      ),
    },
    {
      header: 'Customer Name',
      className: 'font-semibold text-neutral-900 dark:text-neutral-50',
      render: (cust) => (
        <Link to={`/customers/detail/${cust.phone}`} className="hover:underline">
          {cust.firstname} {cust.lastname}
        </Link>
      ),
    },
    {
      header: 'Phone Number',
      className: 'font-mono text-xs text-neutral-650 dark:text-neutral-400',
      render: (cust) => cust.phone,
    },
    {
      header: '',
      className: 'w-12',
      headerClassName: 'w-12',
      render: (cust) => (
        <Link
          to={`/customers/detail/${cust.phone}`}
          className="p-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors block"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-200">
            Customer Directory
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View registered user profiles, contact coordinates, and check purchase logs.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Customer
        </Button>
      </div>

      <DataTableSection
        data={displayCustomers}
        columns={columns}
        keyExtractor={(c) => c.phone}
        selectable
        isLoading={isLoading}
        emptyTitle="No customers registered yet"
        emptyDescription="Register a customer to begin invoice logging."
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder="Search by customer name or phone number..."
        showFilterButton
        filterContent={(
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Phone Starts With</label>
              <input
                type="text"
                value={phonePrefixFilter}
                onChange={(e) => {
                  setPhonePrefixFilter(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="e.g. 09"
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPhonePrefixFilter('');
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

      {/* Add Customer Modal */}
      <Dialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Register Customer"
        size="sm"
      >
        <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4">
          <Input
            label="First Name"
            placeholder="John"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="09XXXXXXXX"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Register Customer
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Customers;

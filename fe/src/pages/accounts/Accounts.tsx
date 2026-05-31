import { Avatar, Badge, Button, DataTableSection, Dialog, Input } from '@/components/ui';
import { Column } from '@/components/ui/Table';
import * as adminService from '@/services/admin.service';
import { actions, useStore } from '@/store';
import { UserDTO } from '@/types/user.types';
import {
  CheckCircleIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  NoSymbolIcon,
  PlusIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Accounts: React.FC = () => {

  const [storeState, dispatch] = useStore();
  const { checkedRows } = storeState; // Row checks map to checked user objects or usernames

  const [accounts, setAccounts] = useState<UserDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Modals status
  const [createOpen, setCreateOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  // New Account inputs
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Bulk actions status
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [verifiedTokenUrl, setVerifiedTokenUrl] = useState('');

  const fetchUsers = async (pageNum = currentPage) => {
    setIsLoading(true);
    try {
      if (searchTerm.trim()) {
        const data = await adminService.getUsers();
        setAccounts(data);
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        const pageRes = await adminService.getUsersPage(pageNum, pageSize);
        setAccounts(pageRes.content);
        setTotalElements(pageRes.totalElements);
        setTotalPages(pageRes.totalPages);

        // Handle out-of-bounds page fallback
        if (pageRes.number >= pageRes.totalPages && pageRes.totalPages > 0) {
          setCurrentPage(pageRes.totalPages - 1);
          fetchUsers(pageRes.totalPages - 1);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load accounts list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    return () => {
      dispatch(actions.clearCheckedRows());
    };
  }, [currentPage, searchTerm, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(actions.clearCheckedRows());
    setCurrentPage(page);
  };

  const handleCheckRow = (user: UserDTO, isChecked: boolean) => {
    // Save username in checked rows
    if (isChecked) {
      dispatch(actions.addCheckedRow(user.username));
    } else {
      dispatch(actions.deleteCheckedRow(user.username));
    }
  };

  const handleCheckAll = (isChecked: boolean) => {
    dispatch(actions.clearCheckedRows());
    if (isChecked) {
      accounts.forEach((acc) => {
        // cannot block or delete admin self or other admins easily
        if (!acc.authorities?.some(r => r.authority === 'ADMIN')) {
          dispatch(actions.addCheckedRow(acc.username));
        }
      });
    }
  };

  // Block selected accounts
  const handleBulkBlock = async () => {
    setIsActionLoading(true);
    try {
      await Promise.all(
        checkedRows.map((username) => adminService.blockUser(username))
      );
      dispatch(actions.clearCheckedRows());
      setBlockOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to block accounts.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Resend email verification
  const handleResendMail = async () => {
    if (checkedRows.length === 0) return;
    setIsActionLoading(true);
    try {
      const targetUser = checkedRows[0]; // resend email for first checked user
      const token = await adminService.generateVerifyToken(targetUser);
      const url = `${window.location.origin}/verify-account/${token}`;
      setVerifiedTokenUrl(url);
      setEmailOpen(true);
      dispatch(actions.clearCheckedRows());
    } catch (err) {
      console.error(err);
      alert('Failed to generate verification token.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Create Staff Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newFullName || !newEmail) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      await adminService.createUser({
        username: newUsername,
        fullName: newFullName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
      });
      setCreateOpen(false);
      setNewUsername('');
      setNewFullName('');
      setNewEmail('');
      setNewPhone('');
      setNewRole('STAFF');
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to create account. Username or email might already exist.';
      setCreateError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsCreating(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (
      (acc.username || '').toLowerCase().includes(term) ||
      (acc.fullName || '').toLowerCase().includes(term) ||
      (acc.email || '').toLowerCase().includes(term) ||
      (acc.phone || '').includes(term)
    );

    const role = acc.authorities?.[0]?.authority || 'USER';
    const matchRole = !roleFilter || role === roleFilter;

    const derivedStatus = acc.blocked ? 'BLOCKED' : acc.enabled ? 'ACTIVE' : 'PENDING';
    const matchStatus = !statusFilter || derivedStatus === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const hasAdvancedFilters = Boolean(roleFilter || statusFilter);
  const isServerSide = !searchTerm.trim() && !hasAdvancedFilters;
  const displayAccounts = isServerSide
    ? filteredAccounts
    : filteredAccounts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const displayTotalElements = isServerSide ? totalElements : filteredAccounts.length;
  const displayTotalPages = isServerSide ? totalPages : Math.ceil(filteredAccounts.length / pageSize);

  const columns: Column<UserDTO>[] = [
    {
      header: 'Username',
      className: 'font-semibold text-brand-600 dark:text-brand-400',
      render: (acc) => (
        <Link to={`/accounts/detail/${acc.username}`} className="hover:underline">
          {acc.username}
        </Link>
      ),
    },
    {
      header: 'Full Name',
      className: 'font-medium text-neutral-900 dark:text-neutral-200',
      render: (acc) => (
        <div className="flex items-center gap-3">
          <Avatar src={acc.avatarURL} name={acc.fullName || acc.username} size="sm" />
          <span>{acc.fullName}</span>
        </div>
      ),
    },
    {
      header: 'Email Address',
      render: (acc) => acc.email || '—',
    },
    {
      header: 'Status',
      render: (acc) => {
        const isBlocked = acc.blocked;
        return isBlocked ? (
          <Badge variant="error" className="flex items-center w-fit gap-1">
            <XCircleIcon className="w-3.5 h-3.5" /> Blocked
          </Badge>
        ) : acc.enabled ? (
          <Badge variant="success" className="flex items-center w-fit gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5" /> Active
          </Badge>
        ) : (
          <Badge variant="warning" className="flex items-center w-fit gap-1">
            Pending Verify
          </Badge>
        );
      },
    },
    {
      header: 'Authority Role',
      render: (acc) => (
        <Badge variant={acc.authorities?.some(r => r.authority === 'ADMIN') ? 'info' : 'neutral'}>
          {acc.authorities?.[0]?.authority || 'USER'}
        </Badge>
      ),
    },
    {
      header: 'Phone Number',
      className: 'font-mono text-xs',
      render: (acc) => acc.phone || '—',
    },
    {
      header: '',
      className: 'w-12',
      render: (acc) => (
        <Link
          to={`/accounts/detail/${acc.username}`}
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
            Staff Account Directory
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Oversee staff credentials, permissions, authentication status, and active system locks.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Staff Member
        </Button>
      </div>

      <DataTableSection
        data={displayAccounts}
        columns={columns}
        keyExtractor={(acc) => acc.username}
        selectable
        checkedRows={checkedRows}
        onCheckRow={(acc, isChecked) => handleCheckRow(acc, isChecked)}
        onCheckAll={handleCheckAll}
        isRowSelectionDisabled={(acc) => acc.authorities?.some((r) => r.authority === 'ADMIN')}
        rowClassName={(acc) => clsx(acc.blocked && 'opacity-60 bg-red-50/5 dark:bg-red-950/5')}
        isLoading={isLoading}
        emptyTitle="No accounts found"
        emptyDescription="Try resetting the filters or create a new user profile."
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder="Search username, full name, email..."
        showFilterButton
        filterContent={(
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">All</option>
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="USER">USER</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">All</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRoleFilter('');
                  setStatusFilter('');
                  setCurrentPage(0);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
        toolbarActions={checkedRows.length > 0 ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-brand-600 border-brand-200"
              onClick={handleResendMail}
              isLoading={isActionLoading}
            >
              <EnvelopeIcon className="w-4 h-4" /> Get Token
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setBlockOpen(true)}
              isLoading={isActionLoading}
            >
              <NoSymbolIcon className="w-4 h-4" /> Block Selected
            </Button>
          </>
        ) : null}
        pagination={{
          currentPage,
          totalPages: displayTotalPages,
          totalElements: displayTotalElements,
          pageSize,
          onPageChange: handlePageChange,
        }}
      />

      {/* Create Account Modal */}
      <Dialog
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); setCreateError(null); }}
        title="Add Staff Member"
        size="md"
      >
        <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
          {createError && (
             <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-900/50">
               {createError}
             </div>
          )}
          <Input
            label="Username"
            required
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="e.g. johndoe"
          />
          <Input
            label="Full Name"
            required
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            placeholder="e.g. John Doe"
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="e.g. john@company.com"
          />
          <Input
            label="Phone Number"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="09XXXXXXXX"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Authority Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'STAFF' | 'ADMIN')}
              className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="STAFF">Staff Account</option>
              <option value="ADMIN">Account Manager (Admin)</option>
            </select>
          </div>
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
              Create Account
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Block Accounts Dialog */}
      <Dialog
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        title="Suspend Staff Accounts"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Are you sure you want to block the {checkedRows.length} selected staff account(s)? Blocked accounts will be immediately locked out of the sales POS interface.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBlockOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkBlock}
              isLoading={isActionLoading}
            >
              Suspend Accounts
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Verify Token Display Dialog */}
      <Dialog
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="Verification URL Generated"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            For development ease, copy the account verification activation link directly to trigger active session activation manually:
          </p>
          <div className="p-3 bg-neutral-100 dark:bg-neutral-850 rounded-md font-mono text-xs break-all select-all border dark:border-neutral-800">
            {verifiedTokenUrl}
          </div>
          <div className="flex justify-end mt-2">
            <Button onClick={() => setEmailOpen(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Accounts;

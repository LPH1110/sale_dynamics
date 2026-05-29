import { Badge, Button, Card, Input, Spinner, Dialog } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import * as adminService from '@/services/admin.service';
import * as userService from '@/services/user.service';
import { UserDTO } from '@/types/user.types';
import { ArrowUpTrayIcon, CheckIcon, ChevronRightIcon, EnvelopeIcon, IdentificationIcon, KeyIcon, LockOpenIcon, NoSymbolIcon, ShoppingBagIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const AccountDetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, updateUser } = useAuth();

  const [account, setAccount] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Forms values
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Modals & Action States
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isAdmin = currentUser?.authorities?.some(r => r.authority === 'ADMIN');
  const isSelf = currentUser?.username === username;
  const canEdit = isAdmin;

  const loadAccount = async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const data = await userService.getDetail(username);
      setAccount(data);
      setFullName(data.fullName || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
    } catch (err) {
      console.error('Failed to load user details:', err);
      setAccount(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, [username]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setSaveLoading(true);
    setUpdateMessage(null);
    try {
      const res = await userService.updateInfo(account.username, {
        fullName,
        phone,
        email,
      });
      setAccount(res);
      setUpdateMessage({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to update details.';
      setUpdateMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && account) {
      setAvatarLoading(true);
      setUpdateMessage(null);
      try {
        const file = e.target.files[0];
        const res = await userService.changeAvatar(file, account.username);
        setAccount(prev => prev ? { ...prev, avatarURL: res.url } : null);
        if (isSelf && currentUser) {
          updateUser({ ...currentUser, avatarURL: res.url });
        }
        setUpdateMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
      } catch (err: any) {
        console.error(err);
        const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to upload avatar image.';
        setUpdateMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) });
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const handleUnblock = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      await adminService.unblockUser(account.username);
      await loadAccount();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleBlockConfirm = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      await adminService.blockUser(account.username);
      setSuspendOpen(false);
      await loadAccount();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !newPassword) return;
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await userService.changePassword(account.username, newPassword);
      setPasswordOpen(false);
      setNewPassword('');
      setUpdateMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to change password.';
      setPasswordError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!account || resendCooldown > 0) return;
    setUpdateMessage(null);
    try {
      await adminService.generateVerifyToken(account.username);
      setUpdateMessage({ type: 'success', text: 'Login email sent successfully.' });
      setResendCooldown(60);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to resend email.';
      setUpdateMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) });
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
      return new Date(dateArray).toLocaleDateString('vi-VN');
    }
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return `${day}/${month}/${year}`;
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

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          User Account Not Found
        </h2>
        <Button variant="ghost" className="mt-4" onClick={() => window.history.back()}>
          Return to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">

      {/* 1. FIXED HEADER */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link to="/accounts" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ChevronRightIcon className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <div className="flex items-center text-xs text-neutral-400 gap-1.5">
              <Link to="/accounts" className="hover:text-brand-500 transition-colors">Accounts</Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-brand-500 font-medium">{account.username}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {account.fullName || account.username}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {canEdit && (
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton as={Button} variant="outline" className="flex items-center gap-1.5">
                Actions <ChevronDownIcon className="w-4 h-4" />
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
                <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {isAdmin && account.username !== currentUser?.username && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={handleResendEmail}
                          disabled={resendCooldown > 0}
                          className={clsx(
                            focus ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50' : 'text-neutral-700 dark:text-neutral-300',
                            'w-full flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50'
                          )}
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                          {resendCooldown > 0 ? `Resend Email (${resendCooldown}s)` : 'Resend Email'}
                        </button>
                      )}
                    </MenuItem>
                  )}
                  {isAdmin && account.blocked && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={handleUnblock}
                          className={clsx(
                            focus ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'text-green-600 dark:text-green-500',
                            'w-full flex items-center gap-2 px-4 py-2 text-sm'
                          )}
                        >
                          <LockOpenIcon className="w-4 h-4" /> Lift Suspend
                        </button>
                      )}
                    </MenuItem>
                  )}
                  {isAdmin && !account.blocked && account.username !== currentUser?.username && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={() => setSuspendOpen(true)}
                          className={clsx(
                            focus ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'text-red-600 dark:text-red-500',
                            'w-full flex items-center gap-2 px-4 py-2 text-sm'
                          )}
                        >
                          <NoSymbolIcon className="w-4 h-4" /> Suspend Account
                        </button>
                      )}
                    </MenuItem>
                  )}
                  {isAdmin && account.username !== currentUser?.username && (
                    <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />
                  )}
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => setPasswordOpen(true)}
                        className={clsx(
                          focus ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50' : 'text-neutral-700 dark:text-neutral-300',
                          'w-full flex items-center gap-2 px-4 py-2 text-sm'
                        )}
                      >
                        <KeyIcon className="w-4 h-4" /> Change Password
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          )}
          {canEdit && (
            <Button type="submit" form="profile-update-form" isLoading={saveLoading}>
              <CheckIcon className="w-4 h-4 mr-1.5" /> Save Profile
            </Button>
          )}
        </div>
      </div>

      {/* 2. FLEXIBLE CONTENT (Limits internal height to fill screen) */}
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden flex flex-col pb-4 pr-2 -mr-2 scrollbar-thin">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col min-h-0 space-y-6 animate-slide-up">

          {/* Avatar Hero Card (Fixed Height) */}
          <Card className="flex-none p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="relative group rounded-full overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 w-24 h-24 flex-shrink-0 cursor-pointer bg-neutral-100 dark:bg-neutral-950">
              {avatarLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Spinner className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : account.avatarURL ? (
                <img src={account.avatarURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-full h-full p-4 text-neutral-400" />
              )}

              {isSelf && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <ArrowUpTrayIcon className="w-6 h-6" />
                </label>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  {account.username}
                </h2>
                <Badge variant={account.authorities?.some(r => r.authority === 'ADMIN') ? 'info' : 'neutral'}>
                  {account.authorities?.[0]?.authority || 'USER'}
                </Badge>
                {account.blocked && <Badge variant="error">Suspended</Badge>}
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                System registered verification: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{account.enabled ? 'Verified' : 'Pending'}</span>
              </p>
            </div>
          </Card>

          {/* Dual Columns (Fills remaining height on desktop) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Left: Meta Form (Internal Scroll if needed) */}
            <div className="md:col-span-5 flex flex-col min-h-0">
              <Card className="flex-1 overflow-y-auto p-6 space-y-6 shadow-sm scrollbar-thin">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <IdentificationIcon className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Profile Metadata</h3>
                </div>

                <form id="profile-update-form" onSubmit={handleSaveChanges} className="space-y-4">
                  {updateMessage && (
                    <div className={`p-3 text-sm rounded-md border ${updateMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50'}`}>
                      {updateMessage.text}
                    </div>
                  )}
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!canEdit}
                  />
                </form>
              </Card>
            </div>

            {/* Right: Sales Logs (Stretches & Scrolls internally) */}
            <div className="md:col-span-7 flex flex-col min-h-0">
              <Card className="flex-1 flex flex-col min-h-0 p-6 shadow-sm">
                <div className="flex-none flex items-center justify-between gap-2 pb-3 mb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Personal Sales Logs</h3>
                  </div>
                  <Badge variant="neutral">{account.orders?.length || 0} Total</Badge>
                </div>

                {(!account.orders || account.orders.length === 0) ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50/50 dark:bg-neutral-900/30">
                    <ShoppingBagIcon className="w-10 h-10 mb-2 text-neutral-300 dark:text-neutral-600" />
                    <span className="text-sm font-medium text-neutral-500">No sales transactions logged.</span>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {account.orders.map((order: any) => (
                      <div key={order.id} className="py-3 flex items-center justify-between gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 px-2 rounded-md transition-colors -mx-2">
                        <div>
                          <Link
                            to={`/orders/detail/${order.id}`}
                            className="font-bold text-sm text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            #{order.id}
                          </Link>
                          <p className="text-xs text-neutral-400 mt-0.5">{formatDate(order.createdDate)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-bold text-sm text-neutral-900 dark:text-neutral-50">
                            {formatCurrency(order.total)}
                          </span>
                          <Badge variant={getStatusVariant(order.status)} className="px-2 py-0.5 text-[10px]">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        isOpen={passwordOpen}
        onClose={() => { setPasswordOpen(false); setPasswordError(null); setNewPassword(''); }}
        title="Change Password"
        size="sm"
      >
        <form onSubmit={handleChangePasswordSubmit} className="flex flex-col gap-4">
          {passwordError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-900/50">
              {passwordError}
            </div>
          )}
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Please enter the new password for <span className="font-semibold text-neutral-900 dark:text-neutral-100">{account.username}</span>.
          </p>
          <Input
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasswordOpen(false)}
              disabled={passwordLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={passwordLoading}>
              Change Password
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog
        isOpen={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title="Suspend Account"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Are you sure you want to suspend <span className="font-semibold text-neutral-900 dark:text-neutral-100">{account.username}</span>? They will be immediately locked out of the sales POS interface.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSuspendOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockConfirm}
              isLoading={isLoading}
            >
              Suspend Account
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
};

export default AccountDetail;
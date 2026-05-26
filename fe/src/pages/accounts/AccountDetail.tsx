import { Badge, Button, Card, Input, Spinner } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import * as adminService from '@/services/admin.service';
import * as userService from '@/services/user.service';
import { UserDTO } from '@/types/user.types';
import {
  ArrowUpTrayIcon,
  CheckIcon,
  ChevronRightIcon,
  LockOpenIcon,
  ShoppingBagIcon,
  UserIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const AccountDetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, updateUser } = useAuth();

  const [account, setAccount] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Forms values
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

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

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setSaveLoading(true);
    try {
      const res = await userService.updateInfo(account.username, {
        fullName,
        phone,
        email,
      });
      setAccount(res);
      alert('Profile details updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update details.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && account) {
      setAvatarLoading(true);
      try {
        const file = e.target.files[0];
        const res = await userService.changeAvatar(file, account.username);
        setAccount(prev => prev ? { ...prev, avatarURL: res.url } : null);
        if (isSelf && currentUser) {
          updateUser({ ...currentUser, avatarURL: res.url });
        }
        alert('Avatar uploaded successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to upload avatar image.');
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
    } finally {
      setIsLoading(false);
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

        <div className="flex items-center gap-3">
          {isAdmin && account.blocked && (
            <Button onClick={handleUnblock} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900/50 dark:hover:bg-green-950/30">
              <LockOpenIcon className="w-4 h-4 mr-1.5" /> Lift Suspend
            </Button>
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
    </div>
  );
};

export default AccountDetail;
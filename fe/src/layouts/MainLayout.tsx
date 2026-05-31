import { Avatar, Button, Dialog, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  ArrowRightIcon,
  Bars3Icon,
  CubeIcon,
  HomeIcon,
  MoonIcon,
  ShoppingCartIcon,
  SunIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const { user, signout, signin, showSessionExpired, closeSessionExpired } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthLoading, setReauthLoading] = useState(false);
  const [reauthError, setReauthError] = useState('');

  const isAdmin = user?.authorities?.some(r => r.authority === 'ADMIN');

  const navigations = [
    { path: '/', title: 'Dashboard', icon: HomeIcon },
    { path: '/products', title: 'Products', icon: CubeIcon },
    { path: '/orders', title: 'Orders', icon: ShoppingCartIcon },
    { path: '/customers', title: 'Customers', icon: UsersIcon },
    ...(isAdmin ? [{ path: '/accounts', title: 'Accounts', icon: UserGroupIcon }] : []),
  ];

  const handleReauthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setReauthLoading(true);
    setReauthError('');
    try {
      await signin(user.username, reauthPassword);
      setReauthPassword('');
    } catch (err) {
      setReauthError('Invalid password. Please try again.');
    } finally {
      setReauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen overflow-y-auto md:overflow-hidden flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 md:px-6 flex justify-between items-center transition-colors duration-200">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Hidden on Mobile as per refactor */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-brand-600 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-subtle shrink-0">
              S
            </span>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
              SaleDynamics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* User Dropdown */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 outline-hidden group">
              <Avatar src={user?.avatarURL} name={user?.fullName || user?.username} size="sm" />
              <div className="hidden md:flex flex-col items-start leading-none text-left">
                <span className="text-sm font-semibold group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                  {user?.fullName || user?.username}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">
                  {user?.authorities?.[0]?.authority || 'USER'}
                </span>
              </div>
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
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-1 shadow-popover ring-1 ring-black/5 outline-hidden">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => navigate(`/accounts/detail/${user?.username}`)}
                      className={clsx(
                        'w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-neutral-700 dark:text-neutral-300',
                        focus && 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                      )}
                    >
                      <UserCircleIcon className="w-4 h-4" /> Profile Settings
                    </button>
                  )}
                </MenuItem>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-1" />
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={signout}
                      className={clsx(
                        'w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-red-600 dark:text-red-400',
                        focus && 'bg-neutral-100 dark:bg-neutral-800'
                      )}
                    >
                      <ArrowRightIcon className="w-4 h-4" /> Sign Out
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 md:min-h-0 flex relative">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigations.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    )
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content Shell */}
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-24 md:pb-6 md:overflow-hidden flex flex-col">
          <div className="container mx-auto w-full flex-1 md:min-h-0 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                className="flex-1 md:min-h-0 flex flex-col"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around pb-2">
        {navigations.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 py-3 px-2 flex-1 text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                )
              }
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className="truncate">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Session Expired / Re-authentication In-place Modal */}
      <Dialog
        isOpen={showSessionExpired}
        onClose={closeSessionExpired}
        title="Session Expired"
        size="sm"
      >
        <form onSubmit={handleReauthSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            For security, please re-authenticate to save your work. Your current workspace status will be preserved.
          </p>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={reauthPassword}
            onChange={(e) => setReauthPassword(e.target.value)}
            error={reauthError}
            disabled={reauthLoading}
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeSessionExpired}
              disabled={reauthLoading}
            >
              Sign Out
            </Button>
            <Button type="submit" isLoading={reauthLoading}>
              Re-authenticate
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default MainLayout;

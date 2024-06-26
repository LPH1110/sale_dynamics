import { UsersIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, UserMenu } from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { CubeIcon, HomeIcon, ShoppingCartIcon, UserIcon } from '~/icons';
import { authorizeAdmin } from '~/utils';

const navigations = [
    {
        path: '/',
        title: 'Dashboard',
        icon: (
            <span className="w-4 h-4 flex items-center">
                <HomeIcon />
            </span>
        ),
    },
    {
        path: '/accounts',
        title: 'Accounts',
        icon: (
            <span className="w-4 h-4 flex items-center">
                <UserIcon />
            </span>
        ),
        isAdmin: true,
    },
    {
        path: '/products',
        title: 'Products',
        icon: (
            <span className="w-4 h-4 flex items-center">
                <CubeIcon />
            </span>
        ),
    },
    {
        path: '/orders',
        title: 'Orders',
        icon: (
            <span className="w-4 h-4 flex items-center">
                <ShoppingCartIcon />
            </span>
        ),
    },
    {
        path: '/customers',
        title: 'Customers',
        icon: (
            <span className="w-4 h-4 flex items-center">
                <UsersIcon />
            </span>
        ),
    },
];

const Main = ({ children }) => {
    const { user } = UserAuth();

    let isAdmin = authorizeAdmin(user);

    const filteredNavs = isAdmin ? navigations : navigations.filter((nav) => !nav.isAdmin);

    return (
        <section>
            <header className="h-12 bg-blue-950 flex justify-between items-center px-6 text-gray-300">
                <h2>Sales Dynamics</h2>
                <div className="flex gap-4">
                    <UserMenu>
                        {/* Avatar */}
                        <Tooltip message={isAdmin ? 'Account Manager' : 'Account Staff'}>
                            {user?.avatarURL ? (
                                <div className="ring-4 ring-transparent hover:ring-blue-700 transition h-7 w-7 rounded-full">
                                    <img className="rounded-full" src={user?.avatarURL} alt="avatar" />
                                </div>
                            ) : (
                                <div className="ring-4 ring-transparent p-1 bg-slate-200 text-slate-500 hover:ring-blue-700 transition h-7 w-7 rounded-full">
                                    <UserIcon />
                                </div>
                            )}
                        </Tooltip>
                    </UserMenu>
                </div>
            </header>

            <section className="flex h-full">
                <aside className="w-[16rem] bg-blue-100 flex flex-col overflow-auto border-r">
                    {filteredNavs.map((nav) => {
                        return (
                            <Fragment key={nav.path}>
                                <NavLink
                                    to={nav.path}
                                    className={({ isActive }) => {
                                        const activeClasses = isActive ? 'bg-white' : '';

                                        return (
                                            'text-sm flex items-center justify-start pl-6 gap-2 w-full py-2.5 hover:bg-white ' +
                                            activeClasses
                                        );
                                    }}
                                >
                                    {nav.icon}
                                    {nav.title}
                                </NavLink>
                            </Fragment>
                        );
                    })}
                </aside>
                <section className="mb-20 w-full">{children}</section>
            </section>
        </section>
    );
};

export default Main;

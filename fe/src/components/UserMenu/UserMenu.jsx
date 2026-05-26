import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UserMenu.module.scss';
import { ArrowLeftRectangleIcon, Cog8ToothIcon, KeyIcon, UserIcon } from '~/icons';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
const cx = classNames.bind(styles);

const UserMenu = ({ children }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const { user, signout } = UserAuth();
    const menuRef = useRef();

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setOpenMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <Menu as="div" className="relative text-left inline-block">
            <Menu.Button onClick={() => setOpenMenu((prev) => !prev)}>{children}</Menu.Button>
            <Transition
                show={openMenu}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    ref={menuRef}
                    className="min-w-[12rem] shadow-md z-50 absolute right-0 bg-white border rounded-md p-2 flex flex-col"
                >
                    <Menu.Item>
                        <Link className={cx('menu-item')} to={`/accounts/detail/${user.username}`}>
                            <span className="w-4 h-4">
                                <UserIcon />
                            </span>
                            Profile
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link className={cx('menu-item')} to="#">
                            <span className="w-4 h-4">
                                <Cog8ToothIcon />
                            </span>
                            Settings
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link className={cx('menu-item')} to={`/change-password/${user?.username}`}>
                            <span className="w-4 h-4">
                                <KeyIcon />
                            </span>
                            Change password
                        </Link>
                    </Menu.Item>
                    <div className="my-2 w-full h-[1px] bg-gray-300"></div>
                    <Menu.Item>
                        <Link onClick={signout} className={cx('menu-item')} to="#">
                            <span className="w-4 h-4">
                                <ArrowLeftRectangleIcon />
                            </span>
                            Sign out
                        </Link>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default UserMenu;

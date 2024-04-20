import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';

const SearchPopper = ({ children, items, value, setValue }) => {
    const [openMenu, setOpenMenu] = useState(false);
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
        <div className="relative">
            <div onClick={() => setOpenMenu((prev) => !prev)}>{children}</div>
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
                <div ref={menuRef} className="bg-white absolute top-[120%] rounded-sm inset-x-0 border shadow-md">
                    <ul>
                        {items.map((item) => (
                            <Fragment key={item.title}>
                                <li
                                    onClick={() => {
                                        setOpenMenu(false);
                                        setValue(item.title);
                                    }}
                                    className={
                                        item.title.localeCompare(value) !== 0
                                            ? 'p-2 hover:bg-blue-100 cursor-pointer text-sm'
                                            : 'bg-blue-100 p-2 hover:bg-gray-100 cursor-pointer text-sm'
                                    }
                                >
                                    {item?.title}
                                </li>
                            </Fragment>
                        ))}
                    </ul>
                </div>
            </Transition>
        </div>
    );
};

export default SearchPopper;

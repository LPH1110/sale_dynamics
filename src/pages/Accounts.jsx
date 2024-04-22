import axios from 'axios';
import { Fragment, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '~/components';
import { EnvelopeIcon, PlusIcon, TrashIcon } from '~/icons';
import { actions, useStore } from '~/store';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { authorizeAdmin, request } from '~/utils';
import { userService } from '~/services';
import { toast } from 'react-toastify';

const tableHeadings = [
    {
        id: uuidv4(),
        title: '',
    },
    {
        id: uuidv4(),

        title: 'User name',
    },
    {
        id: uuidv4(),

        title: 'Full name',
    },
    {
        title: 'Email',
        id: uuidv4(),
    },
    {
        title: 'Enabled',
        id: uuidv4(),
    },
    {
        title: 'Authority',
        id: uuidv4(),
    },
    {
        title: 'Phone number',
        id: uuidv4(),
    },
];

const DataRow = ({ data }) => {
    const checkRef = useRef();
    const [checked, setChecked] = useState(false);
    const [, dispatch] = useStore();

    const handleChecked = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) {
            dispatch(actions.addCheckedRow(data));
        } else {
            dispatch(actions.deleteCheckedRow(data));
        }
    };

    useEffect(() => {
        return () => {
            dispatch(actions.clearCheckedRows());
        };
    }, []);

    return (
        <tr className={checked ? 'bg-blue-100' : 'hover:bg-blue-100 bg-white'}>
            <td className="text-center p-3 hover:bg-gray-100">
                <input onChange={handleChecked} ref={checkRef} className="w-4 h-4" type="checkbox" />
            </td>
            <td className="text-sm p-3 hover:bg-gray-100">{data.username}</td>
            <td className="text-sm p-3 hover:bg-gray-100 hover:underline">
                <NavLink className="text-blue-500" to={`/accounts/detail/${data.username}`}>
                    {data.fullName}
                </NavLink>
            </td>
            <td className="text-sm p-3 hover:bg-gray-100">{data.email}</td>
            <td className="text-sm p-3 hover:bg-gray-100">{data.enabled && 'yes'}</td>
            <td className="text-sm p-3 hover:bg-gray-100">{authorizeAdmin(data) ? 'admin' : ''}</td>
            <td className="text-sm p-3 hover:bg-gray-100">{data.phone}</td>
        </tr>
    );
};

const Accounts = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [checkAll, setCheckAll] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const tableRef = useRef();

    const [state, dispatch] = useStore();
    const { checkedRows } = state;

    useEffect(() => {
        const getUsers = async () => {
            const users = await userService.fetchAll();
            setAccounts(users);
        };

        getUsers();
    }, []);

    return (
        <section className="p-4 space-y-4">
            {/* Head bar */}
            <section className="bg-white rounded-sm border p-1.5 shadow-md">
                <div className="whitespace-nowrap flex items-center justify-start flex-row">
                    <button
                        type="button"
                        onClick={() => {
                            setModalAction('create-account');
                            setOpenModal(true);
                        }}
                        className="flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                    >
                        <span className="w-5 h-5 text-emerald-400">
                            <PlusIcon />
                        </span>{' '}
                        New
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setModalAction('confirm-delete');
                            setOpenModal(true);
                        }}
                        className="flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                    >
                        <span className="w-5 h-5 text-gray-500">
                            <TrashIcon />
                        </span>{' '}
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (checkedRows.length > 0) {
                                setModalAction('resend-verification');
                                setOpenModal(true);
                            } else {
                                toast.info('Select at least a row to resend verification');
                            }
                        }}
                        className=" flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                    >
                        <span className="w-5 h-5 text-blue-500">
                            <EnvelopeIcon />
                        </span>{' '}
                        Resend email
                    </button>
                    <div className="w-full ml-2 flex gap-2 items-center border py-1 px-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition">
                        <button type="button" className="w-4 h-4">
                            <MagnifyingGlassIcon />
                        </button>
                        <input
                            className="w-full"
                            type="text"
                            placeholder="Searching an account"
                            name="provider"
                            id="provider"
                        />
                    </div>
                </div>
            </section>
            {/* Table */}
            <section className="bg-white h-screen-9 overflow-auto rounded-sm border px-4 pb-4 shadow-md space-y-6">
                <h1 className="text-xl font-semibold pt-4">List all accounts</h1>
                <table ref={tableRef} className="relative w-full border-collapse">
                    <thead className="border-b top-0 inset-x-0 sticky w-full bg-white">
                        <tr>
                            {tableHeadings.map((heading) => (
                                <Fragment key={heading.id}>
                                    {heading.title ? (
                                        <th className="hover:bg-gray-100 text-left p-3 font-semibold text-sm capitalize">
                                            {heading.title}
                                        </th>
                                    ) : (
                                        <td className="hover:bg-gray-100 text-center p-3">
                                            <input
                                                id="check_all"
                                                name="check_all"
                                                onChange={(e) => setCheckAll(e.target.checked)}
                                                type="checkbox"
                                                className="w-4 h-4"
                                            />
                                        </td>
                                    )}
                                </Fragment>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {accounts.map((account) => (
                            <Fragment key={account.id}>
                                <DataRow data={account} />
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </section>
            <Modal
                setAccounts={setAccounts}
                tableName="accounts"
                open={openModal}
                setOpen={setOpenModal}
                action={modalAction}
            />
        </section>
    );
};

export default Accounts;

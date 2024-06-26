import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Fragment, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ImageWithFallback, Modal } from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { PlusIcon, TrashIcon } from '~/icons';
import { actions, useStore } from '~/store';
import { authorizeAdmin, hasChangedPassword, request } from '~/utils';
import NotAllowAccess from './NotAllowAccess';

const tableHeadings = [
    {
        id: uuidv4(),
        title: '',
    },
    {
        id: uuidv4(),

        title: 'Product name',
    },
    {
        title: 'Inventory',
        id: uuidv4(),
    },
    {
        title: 'Category',
        id: uuidv4(),
    },
    {
        title: 'Provider',
        id: uuidv4(),
    },
];

const DataRow = ({ data }) => {
    const checkRef = useRef();
    const [checked, setChecked] = useState(false);
    const [, dispatch] = useStore();

    console.log(data);

    const handleChecked = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) {
            dispatch(actions.addCheckedRow(data.barcode));
        } else {
            dispatch(actions.deleteCheckedRow(data.barcode));
        }
    };

    useEffect(() => {
        return () => {
            dispatch(actions.clearCheckedRows());
        };
    }, [dispatch]);

    return (
        <tr className={checked ? 'bg-blue-100' : 'hover:bg-blue-100 bg-white'}>
            <td className="text-center p-3 hover:bg-gray-100">
                <input onChange={handleChecked} ref={checkRef} className="w-4 h-4" type="checkbox" />
            </td>
            <td className="flex items-center justify-start gap-4 text-sm p-3 hover:bg-gray-100 hover:underline">
                <div className="rounded-sm">
                    <img
                        src={data?.thumbnails?.length > 0 ? data.thumbnails[0].url : ''}
                        className="w-12 h-12 rounded-sm"
                        alt="product-thumb"
                    />
                </div>
                <NavLink className="text-blue-500" to={`/products/detail/${data?.barcode}`}>
                    {data?.name}
                </NavLink>
            </td>
            <td className="text-sm p-3 hover:bg-gray-100">0 stock in 0 variant</td>
            <td className="text-sm p-3 hover:bg-gray-100">{data?.category}</td>
            <td className="text-sm p-3 hover:bg-gray-100">{data?.provider}</td>
        </tr>
    );
};

const Products = () => {
    const { user } = UserAuth();
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [checkAll, setCheckAll] = useState(false);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const tableRef = useRef();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await request.get(`products`);
                if (products) {
                    setProducts(products);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    return !hasChangedPassword(user) ? (
        <NotAllowAccess />
    ) : (
        <section className="h-screen-content overflow-auto flex p-4 item-start justify-center">
            <section className="container space-y-4">
                <section className="bg-white rounded-sm border p-1.5 shadow-md">
                    <div className="flex items-center justify-start">
                        {authorizeAdmin(user) ? (
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/products/create-product');
                                }}
                                className="flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                            >
                                <span className="w-5 h-5 text-emerald-400">
                                    <PlusIcon />
                                </span>{' '}
                                New
                            </button>
                        ) : (
                            ''
                        )}
                        <button
                            type="button"
                            className="flex gap-2 items-center justify-center px-3 py-2 text-sm rounded-sm hover:bg-gray-100"
                        >
                            <span className="w-5 h-5 text-gray-500">
                                <AdjustmentsHorizontalIcon />
                            </span>{' '}
                            Filter
                        </button>
                        <div className="ml-2 flex gap-2 items-center border py-1 px-2 rounded-sm w-full ring-2 ring-transparent focus-within:ring-blue-400 transition">
                            <button type="button" className="w-4 h-4">
                                <MagnifyingGlassIcon />
                            </button>
                            <input
                                className="w-full"
                                type="text"
                                placeholder="Enter your product name"
                                name="provider"
                                id="provider"
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-white h-screen-9 overflow-auto rounded-sm border px-4 pb-4 shadow-md space-y-6">
                    <h1 className="text-xl font-semibold pt-4">List all products</h1>
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
                            {products.map((product) => (
                                <Fragment key={product.barcode}>
                                    <DataRow data={product} />
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </section>
                <Modal
                    tableName="products"
                    setData={setProducts}
                    open={openModal}
                    setOpen={setOpenModal}
                    action={modalAction}
                />
            </section>
        </section>
    );
};

export default Products;

import { MagnifyingGlassIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Fragment, useContext, useEffect, useState } from 'react';
import { CreateOrderContext } from '~/contexts/pool';
import { customerService } from '~/services';
import { useDebounce } from '~/store';

const SearchCustomerCard = ({ setModal }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const { setCustomer } = useContext(CreateOrderContext);

    const debounce = useDebounce(searchValue, 1000);

    useEffect(() => {
        const getCustomers = async () => {
            let customers = await customerService.findByKeyword(searchValue);
            setSearchResult(customers);
        };

        if (searchValue.trim().length > 0) {
            getCustomers();
        }
    }, [debounce]);

    return (
        <div className="bg-white rounded-sm shadow-md border space-y-4 text-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h4 className="font-semibold">Customer</h4>
                <button
                    onClick={() => setModal({ action: 'create-customer', open: true })}
                    type="button"
                    className="text-blue-500 hover:text-blue-600 transition flex items-center gap-1"
                >
                    <span>
                        <PlusIcon className="w-3 h-3" />
                    </span>
                    Create new
                </button>
            </div>
            {/* Search bar */}
            <div className="px-4 pb-4">
                <div className="relative flex items-center border rounded-md flex-1 ring-1 ring-transparent focus-within:ring-blue-400 transition">
                    <span className="px-2">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                    </span>
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        type="text"
                        placeholder="Search by phone or name"
                        className="w-full text-sm py-2 rounded-r-md"
                    />
                    {searchResult.length > 0 && (
                        <div className="bg-white inset-x-0 absolute top-[2.5rem] rounded-md border shadow-sm py-2">
                            <ul>
                                {searchResult.map((customer) => {
                                    return (
                                        <Fragment key={customer}>
                                            <li
                                                onClick={() => setCustomer(customer)}
                                                className="p-2 hover:bg-blue-50 bg-white transition cursor-pointer flex items-center gap-2"
                                            >
                                                <div className="flex items-center justify-center text-slate-500">
                                                    <UserCircleIcon className="w-8 h-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4>
                                                        {customer.firstname} {customer.lastname}
                                                    </h4>
                                                    <p className="text-xs text-slate-500">{customer.phone}</p>
                                                </div>
                                            </li>
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchCustomerCard;

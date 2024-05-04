import { MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CreateOrderContext } from '~/contexts/pool';
import { Tooltip } from '~/components';
import { useDebounce } from '~/store';
import { productService } from '~/services';
import { NavLink } from 'react-router-dom';

const ProductList = ({ setCheckedRows, products }) => {
    const [checked, setChecked] = useState(false);
    const checkBoxRef = useRef();

    const handleChecked = (product) => {
        if (!checked) {
            setCheckedRows((prev) => [
                ...prev,
                {
                    ...product,
                    quantity: 1,
                },
            ]);
        } else {
            setCheckedRows((prev) => {
                let next = prev.filter((item) => item.barcode.localeCompare(product.barcode) !== 0);
                return next;
            });
        }
        setChecked(!checked);
    };

    useEffect(() => {
        let checkBoxElement = checkBoxRef.current;
        if (checkBoxElement) {
            checkBoxElement.checked = checked;
        }
    }, [checked]);

    return (
        <ul>
            {products.map((product) => (
                <li
                    onClick={() => handleChecked(product)}
                    className="cursor-pointer flex items-center justify-start gap-2 text-sm px-4 py-1 hover:bg-gray-100"
                >
                    <input ref={checkBoxRef} type="checkbox" name={product?.name} id={product?.barcode} />
                    <div className="rounded-sm">
                        <img
                            src={
                                'https://product.hstatic.net/200000871597/product/fd_3706bc6e7ab24adfa2ff6683c33972d4.jpg'
                            }
                            className="w-12 h-12 rounded-sm"
                            alt="product-thumb"
                        />
                    </div>
                    <h4>{product?.name}</h4>
                </li>
            ))}
        </ul>
    );
};

const ProductSearch = ({ setOpen }) => {
    const { searchValue, setSearchValue, setOrderItems } = useContext(CreateOrderContext);
    const [checkedRows, setCheckedRows] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const debounce = useDebounce(searchValue, 1000);

    useEffect(() => {
        const searchProducts = async () => {
            const products = await productService.findByKeyword(searchValue);
            setSearchResult(products);
        };

        if (searchValue.trim().length > 0) {
            searchProducts();
        }
    }, [debounce]);

    const handleConfirm = () => {
        setOrderItems((prev) => {
            let next = prev;

            checkedRows.forEach((row) => {
                let pos = next.map((item) => item.barcode).indexOf(row.barcode);
                if (pos >= 0) {
                    next[pos].quantity += 1;
                } else {
                    next.push(row);
                }
            });

            return prev;
        });
        setOpen(false);
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4 px-4">
                <h2 className="font-semibold text-lg">Search Products</h2>
                <Tooltip
                    placement="top"
                    message="Only search products which are available to sell (in stock or allowed to order until out of stock"
                >
                    <span>
                        <QuestionMarkCircleIcon className="w-4 h-4" />
                    </span>
                </Tooltip>
            </div>

            {/* Search bar */}
            <div className="py-4 border-y px-4">
                <div className="relative flex items-center border rounded-md flex-1 ring-1 ring-transparent focus-within:ring-blue-400 transition">
                    <span className="px-2">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                    </span>
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        type="text"
                        placeholder="Search a product"
                        className="w-full text-sm py-2 rounded-r-md"
                    />
                </div>
            </div>
            {/* Product list */}
            <div className="text-sm">
                {searchResult.length <= 0 ? (
                    <p className="p-4 text-slate-500">Unable to find products with keyword: {debounce}</p>
                ) : (
                    <ProductList setCheckedRows={setCheckedRows} products={searchResult} />
                )}
            </div>

            {/* Footer */}
            <footer className="border-t text-sm">
                <div className="pt-4 px-4 flex items-center justify-between">
                    <p>{checkedRows.length} chosen products</p>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setOpen(false)}
                            type="button"
                            className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductSearch;

import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const OrderItemRow = ({ setOrderItems, data, index }) => {
    const handleChangeQuantity = (e) => {
        if (Number(e.target.value)) {
            setOrderItems((prev) => {
                let next = [...prev];
                next[index].quantity = Number(e.target.value);
                return next;
            });
        }
    };

    const handleIncreaseQty = () => {
        setOrderItems((prev) => {
            let next = [...prev];
            next[index].quantity = next[index].quantity + 1;
            return next;
        });
    };

    const handleDecreaseQty = () => {
        setOrderItems((prev) => {
            if (prev[index].quantity > 1) {
                let next = [...prev];
                next[index].quantity = next[index].quantity - 1;
                return next;
            } else {
                return prev;
            }
        });
    };

    const handleRemoveItem = () => {
        setOrderItems((prev) => {
            let next = prev.filter((item) => item.productDTO.barcode.localeCompare(data.productDTO.barcode) !== 0);
            return next;
        });
    };

    return (
        <tr>
            {/* Product info */}
            <td className="flex px-2 py-4 text-sm gap-2 items-center">
                <div className="rounded-sm">
                    <img
                        src={data?.productDTO.thumbnails[0].url}
                        className="w-12 h-12 rounded-sm"
                        alt="product-thumb"
                    />
                </div>
                <div>
                    <Link
                        to={`/products/detail/${data?.productDTO.barcode}`}
                        className="text-blue-500 hover:text-blue-600 transition"
                    >
                        {data?.productDTO.name}
                    </Link>
                </div>
            </td>
            {/* Quantity */}
            <td className="py-4 px-2">
                <div className="ring-1 ring-slate-300 focus-within:ring-blue-500 transition rounded-md flex items-center justify-between">
                    <input
                        type="text"
                        value={data?.quantity}
                        onChange={handleChangeQuantity}
                        className="w-full p-2 rounded-l-md"
                    />
                    <div className="flex flex-col mr-1">
                        <button
                            onClick={handleIncreaseQty}
                            className="p-1 hover:bg-blue-100 transition rounded-sm"
                            type="button"
                        >
                            <ChevronUpIcon className="w-2 h-2" />
                        </button>
                        <button
                            onClick={handleDecreaseQty}
                            className="p-1 hover:bg-blue-100 transition rounded-sm"
                            type="button"
                        >
                            <ChevronDownIcon className="w-2 h-2" />
                        </button>
                    </div>
                </div>
            </td>
            {/* Price */}
            <td className="px-2 py-4 text-right">{data?.productDTO.salePrice}</td>
            {/* Amount */}
            <td className="px-2 py-4 text-right">{data?.productDTO.salePrice * Number(data?.quantity)}</td>
            <td className="px-2 py-4 text-right">
                <button
                    onClick={handleRemoveItem}
                    type="button"
                    className="pt-2 text-slate-400 hover:text-slate-700 transition"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
};

export default OrderItemRow;

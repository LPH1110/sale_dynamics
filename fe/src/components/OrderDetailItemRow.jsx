import { Link } from 'react-router-dom';

const OrderDetailItemRow = ({ data, index }) => {
    return (
        <tr>
            {/* Product info */}
            <td className="flex p-4 text-sm gap-4 items-center">
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
                        className="text-blue-500 hover:text-blue-600 transition font-semibold"
                    >
                        {data?.productDTO.name}
                    </Link>
                </div>
            </td>
            {/* Quantity */}
            <td className="p-4 text-center">{data?.quantity}</td>
            {/* Price */}
            <td className=" p-4 text-right">{data?.productDTO.salePrice}</td>
            {/* Amount */}
            <td className=" p-4 text-right">{data?.productDTO.salePrice * Number(data?.quantity)}</td>
        </tr>
    );
};

export default OrderDetailItemRow;

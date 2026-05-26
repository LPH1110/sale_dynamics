import React from 'react';
import { useParams } from 'react-router-dom';

const OrderRefund = () => {
    const { orderId } = useParams();
    return <section className="h-screen-content overflow-auto">OrderRefund: {orderId}</section>;
};

export default OrderRefund;

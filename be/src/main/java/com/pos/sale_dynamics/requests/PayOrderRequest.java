package com.pos.sale_dynamics.requests;

public record PayOrderRequest(
        String orderId,
        int received,
        int excess,
        int customerOwed
) {
    @Override
    public String orderId() {
        return orderId;
    }

    @Override
    public int received() {
        return received;
    }

    @Override
    public int excess() {
        return excess;
    }

    @Override
    public int customerOwed() {
        return customerOwed;
    }
}

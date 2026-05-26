package com.pos.sale_dynamics.responses;

public record DisableProductResponse(
        boolean error,
        String message
) {
    @Override
    public boolean error() {
        return error;
    }

    @Override
    public String message() {
        return message;
    }
}

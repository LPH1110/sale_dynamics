package com.pos.sale_dynamics.dto;

public record TokenVerifyResponse(
        boolean enabled,
        boolean expired,
        String message

) {
    @Override
    public boolean enabled() {
        return enabled;
    }

    @Override
    public boolean expired() {
        return expired;
    }

    @Override
    public String message() {
        return message;
    }
}

package com.pos.sale_dynamics.responses;

import com.pos.sale_dynamics.domain.VerificationToken;

public record CreateUserResponse(boolean error, String message, VerificationToken data) {
    @Override
    public boolean error() {
        return error;
    }

    @Override
    public String message() {
        return message;
    }

    @Override
    public VerificationToken data() {
        return data;
    }
}

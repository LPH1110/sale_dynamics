package com.pos.sale_dynamics.responses;

import com.pos.sale_dynamics.dto.LoginResponseDTO;

public record LoginResponse(boolean error, String message, LoginResponseDTO data) {
    @Override
    public boolean error() {
        return error;
    }

    @Override
    public String message() {
        return message;
    }

    @Override
    public LoginResponseDTO data() {
        return data;
    }
}

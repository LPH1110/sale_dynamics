package com.pos.sale_dynamics.dto;

import java.util.List;

public record CustomerDTO(
        String lastname,
        String firstname,
        String email,
        String phone,
        String gender,
        String address
) {
    @Override
    public String lastname() {
        return lastname;
    }

    @Override
    public String firstname() {
        return firstname;
    }

    @Override
    public String email() {
        return email;
    }

    @Override
    public String phone() {
        return phone;
    }

    @Override
    public String gender() {
        return gender;
    }

    @Override
    public String address() {
        return address;
    }

}

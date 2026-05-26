package com.pos.sale_dynamics.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public record OrderDTO(
        String id,
        int total,
        int received,
        int excess,

        int customerOwed,

        LocalDateTime createdDate,

        String status,

        CustomerDTO customer,

        List<OrderItemDTO> orderItems,

        boolean confirmed,

        String description,

        String issuer
) {

    @Override
    public CustomerDTO customer() {
        return customer;
    }

    @Override
    public List<OrderItemDTO> orderItems() {
        return orderItems;
    }

    @Override
    public String status() {
        return status;
    }

    @Override
    public String id() {
        return id;
    }

    @Override
    public int total() {
        return total;
    }

    @Override
    public int received() {
        return received;
    }

    @Override
    public LocalDateTime createdDate() {
        return createdDate;
    }

    @Override
    public int excess() {
        return excess;
    }

    @Override
    public int customerOwed() {
        return customerOwed;
    }

    @Override
    public boolean confirmed() {
        return confirmed;
    }

    @Override
    public String description() {
        return description;
    }

    @Override
    public String issuer() {
        return issuer;
    }
}

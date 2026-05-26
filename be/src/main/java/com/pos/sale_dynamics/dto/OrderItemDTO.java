package com.pos.sale_dynamics.dto;

public record OrderItemDTO(
        ProductDTO productDTO,
        int quantity
) {
    @Override
    public ProductDTO productDTO() {
        return productDTO;
    }

    @Override
    public int quantity() {
        return quantity;
    }
}

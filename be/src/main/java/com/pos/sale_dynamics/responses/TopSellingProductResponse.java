package com.pos.sale_dynamics.responses;

import com.pos.sale_dynamics.dto.ProductDTO;

public record TopSellingProductResponse(
        ProductDTO productDTO,
        Long quantity,
        Long totalRevenue
) {
    @Override
    public ProductDTO productDTO() {
        return productDTO;
    }

    @Override
    public Long quantity() {
        return quantity;
    }

    @Override
    public Long totalRevenue() {
        return totalRevenue;
    }
}

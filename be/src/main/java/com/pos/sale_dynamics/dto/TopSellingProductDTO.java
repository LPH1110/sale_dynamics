package com.pos.sale_dynamics.dto;

import com.pos.sale_dynamics.domain.Product;

public class TopSellingProductDTO {
    public final Product product;
    public final Long quantity;


    public TopSellingProductDTO(Product product, Long quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

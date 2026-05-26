package com.pos.sale_dynamics.requests;


import com.pos.sale_dynamics.dto.PropertyDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record CreateProductRequest(
         String name,
         String description,
         String provider,
         String category,
         String baseUnit,
         String sku,
         String barcode,
         List<PropertyDTO> properties,
         int salePrice,
         int comparedPrice
) {

    public String description() {
        return description;
    }

    public String name() {
        return name;
    }

    public String provider() {
        return provider;
    }


    public List<PropertyDTO> properties() {return properties ;}

    public String category() {
        return category;
    }
    public String baseUnit() {
        return baseUnit;
    }
    public String sku() {
        return sku;
    }
    public String barcode() {
        return barcode;
    }
    public int salePrice() {
        return salePrice;
    }
    public int comparedPrice() {
        return comparedPrice;
    }
}

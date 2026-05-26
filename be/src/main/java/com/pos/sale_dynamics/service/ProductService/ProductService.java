package com.pos.sale_dynamics.service.ProductService;

import com.pos.sale_dynamics.domain.Thumbnail;
import com.pos.sale_dynamics.requests.CreateProductRequest;
import com.pos.sale_dynamics.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

    public interface ProductService {

        ResponseEntity<ProductDTO> updateProduct(ProductDTO productDTO);
        List<ProductDTO> findAll();
        Page<ProductDTO> findAll(Pageable pageable);

        ProductDTO addProduct(CreateProductRequest createProductRequest);

        List<ProductDTO> findByNameContaining(String infix);

        ResponseEntity<ProductDTO> findByBarcode(String barcode);

        Thumbnail saveThumbnail(String barcode, MultipartFile thumbnailFile);

        HttpStatus removeThumbnail(String barcode, long thumbnailId) throws IOException;
}

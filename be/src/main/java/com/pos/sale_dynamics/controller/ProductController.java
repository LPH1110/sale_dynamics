package com.pos.sale_dynamics.controller;

import com.pos.sale_dynamics.domain.Thumbnail;
import com.pos.sale_dynamics.requests.CreateProductRequest;
import com.pos.sale_dynamics.requests.DeleteThumbnailRequest;
import com.pos.sale_dynamics.responses.DisableProductResponse;
import com.pos.sale_dynamics.service.ProductService.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pos.sale_dynamics.dto.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {
    @Autowired
    private ProductServiceImpl productService;


    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/keyword")
    public List<ProductDTO> findByKeyword(@RequestParam String infix) {
        return productService.findByNameContaining(infix);
    }

    @PostMapping("/save")
    public ProductDTO addProduct(@RequestBody CreateProductRequest createProductRequest) {
        return productService.addProduct(createProductRequest);
    }

    @PostMapping("/save-thumbnail")
    public Thumbnail saveThumbnail(@RequestParam("barcode") String barcode, @RequestParam("thumbnail") MultipartFile thumbnail) {
        System.out.println("Saving thumbnail of: " + barcode);
        return productService.saveThumbnail(barcode, thumbnail);
    }

    @PostMapping(value = "/delete-thumbnail", consumes = MediaType.APPLICATION_JSON_VALUE)
    public HttpStatus deleteThumbnail(@RequestBody DeleteThumbnailRequest deleteThumbnailRequest) throws IOException {
        return productService.removeThumbnail(deleteThumbnailRequest.barcode(), deleteThumbnailRequest.thumbnailId());
    }

    @GetMapping("/detail")
    public ResponseEntity<ProductDTO> getDetail(@RequestParam String barcode) {
        return productService.findByBarcode(barcode);
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductDTO> update(@RequestBody ProductDTO productDTO) {
        return productService.updateProduct(productDTO);
    }

    @GetMapping("/disable")
    public ResponseEntity<DisableProductResponse> deleteProduct(@RequestParam String barcode) {
        return productService.deleteByBarcode(barcode);
    }
}

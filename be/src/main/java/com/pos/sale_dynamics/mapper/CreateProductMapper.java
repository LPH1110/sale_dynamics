package com.pos.sale_dynamics.mapper;

import com.pos.sale_dynamics.domain.*;
import com.pos.sale_dynamics.requests.CreateProductRequest;
import com.pos.sale_dynamics.repository.ProductRepository;
import com.pos.sale_dynamics.repository.PropertyRepository;
import com.pos.sale_dynamics.repository.TagRepository;
import com.pos.sale_dynamics.repository.ThumbnailRepository;
import com.pos.sale_dynamics.service.CategoryService.CategoryServiceImpl;
import com.pos.sale_dynamics.service.CloudinaryService.CloudinaryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class CreateProductMapper implements Function<Product, CreateProductRequest> {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ThumbnailRepository thumbnailRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private CategoryServiceImpl categoryService;

    @Autowired
    private CloudinaryServiceImpl cloudinaryService;
    @Override
    public CreateProductRequest apply(Product product) {
        return null;
    }

    public Product mapToProduct(CreateProductRequest createProductRequest) {
        Category category = categoryService.findByName(createProductRequest.category()).get();

        Product product = productRepository.save(new Product(
                createProductRequest.name(),
                createProductRequest.description(),
                createProductRequest.provider(),
                category,
                createProductRequest.baseUnit(),
                createProductRequest.salePrice(),
                createProductRequest.comparedPrice(),
                createProductRequest.sku(),
                createProductRequest.barcode()
        ));

        createProductRequest
                .properties()
                .forEach(propertyDTO -> {
                    Property property = propertyRepository.save(new Property(propertyDTO.name(), product));
                    propertyDTO.tags().forEach(tagName -> {
                        Tag newTag = tagRepository.save(new Tag(tagName, property));
                        property.getTags().add(newTag);
                    });
                    propertyRepository.save(property);
                    product.getProperties().add(property);
                });

        return product;
    }
}

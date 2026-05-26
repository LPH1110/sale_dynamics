package com.pos.sale_dynamics.service.ProductService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.pos.sale_dynamics.domain.*;
import com.pos.sale_dynamics.requests.CreateProductRequest;
import com.pos.sale_dynamics.dto.ProductDTO;
import com.pos.sale_dynamics.mapper.CreateProductMapper;
import com.pos.sale_dynamics.mapper.ProductDTOMapper;
import com.pos.sale_dynamics.repository.*;
import com.pos.sale_dynamics.responses.CldUploadResponse;
import com.pos.sale_dynamics.responses.DisableProductResponse;
import com.pos.sale_dynamics.service.CloudinaryService.CloudinaryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ThumbnailRepository thumbnailRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ProductDTOMapper productMapper;

    @Autowired
    private CreateProductMapper createProductMapper;

    @Autowired
    private CloudinaryServiceImpl cloudinaryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<ProductDTO> findByNameContaining(String infix) {
        return productRepository.findByNameContaining(infix).stream().map(product -> productMapper.apply(product)).toList();
    }

    @Override
    @Transactional
    public ResponseEntity<ProductDTO> updateProduct(ProductDTO productDTO) {
        Optional<Product> productRecord = productRepository.findByBarcode(productDTO.barcode());
        if (productRecord.isEmpty()) {
            System.out.println("In product service, product is not found with barcode: " + productDTO.barcode());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Optional<Category> categoryRecord = categoryRepository.findByName(productDTO.category());
        if (categoryRecord.isEmpty()) {
            System.out.println("In product service, category is not found with name: " + productDTO.category());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Product product = productRecord.get();
        product.setName(productDTO.name());
        product.setDescription(productDTO.description());
        product.setSku(productDTO.sku());
        product.setBarcode(productDTO.barcode());
        product.setBaseUnit(productDTO.baseUnit());
        product.setSalePrice(productDTO.salePrice());
        product.setComparedPrice(productDTO.comparedPrice());
        product.setCategory(categoryRecord.get());


        // barcode + property name -> get property, tag name + property id -> tag
        productDTO.properties().forEach(propertyDTO -> {
            Optional<Property> propertyRecord = propertyRepository.findByProductIdAndName(product.getId(), propertyDTO.name());
            Property property;

            // if property is not present, create a new one
            if (propertyRecord.isPresent()) {
                property = propertyRecord.get();
                property.setName(propertyDTO.name());
            } else {
                System.out.println("In product service, property not found then create new one!");
                property = propertyRepository.save(new Property(propertyDTO.name(), product));
            }


            propertyDTO.tags().forEach(tagName -> {
                Optional<Tag> tagRecord = tagRepository.findByPropertyIdAndName(property.getId(), tagName);
                Tag tag;

                // if tag is not present then create a new one
                if (tagRecord.isPresent()) {
                    tag = tagRecord.get();
                    tag.setName(tagName);
                    tagRepository.save(tag);
                } else {
                    System.out.println("In product service, tag not found then create new one!");
                    tag = tagRepository.save(new Tag(tagName, property));
                }

                property.getTags().add(tag);
            });
            propertyRepository.save(property);
            product.getProperties().add(property);
        });

        return new ResponseEntity<>(productMapper.apply(productRepository.save(product)), HttpStatus.OK);
    }

    @Override
    public List<ProductDTO> findAll() {
        return productRepository.findExistingProducts().stream().map(product -> productMapper.apply(product)).toList();
    }


    @Override
    public ProductDTO addProduct(CreateProductRequest createProductRequest) {
        Product product = createProductMapper.mapToProduct(createProductRequest);
        return productMapper.apply(productRepository.save(product));
    }

    @Override
    @Transactional
    public ResponseEntity<ProductDTO> findByBarcode(String barcode)  {
        Optional<Product> productRecord = productRepository.findByBarcode(barcode);
        return productRecord.map(product -> new ResponseEntity<>(productMapper.apply(product), HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND));

    }

    @Override
    @Transactional
    public Thumbnail saveThumbnail(String barcode, MultipartFile thumbnailFile)  {
        Optional<Product> record = productRepository.findByBarcode(barcode);

        if (record.isPresent()) {
            Product product = record.get();
                try {
                    CldUploadResponse asset = cloudinaryService.upload(thumbnailFile);
                    Thumbnail thumbnail = thumbnailRepository.save(new Thumbnail(asset.url(), asset.public_id()));
                    product.getThumbnails().add(thumbnail);
                    productRepository.save(product);
                    return thumbnail;
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
        }
        return null;
    }

    @Override
    @Transactional
    public HttpStatus removeThumbnail(String barcode, long thumbnailId) throws IOException {
        Optional<Product> productRecord = productRepository.findByBarcode(barcode);
        Optional<Thumbnail> thumbnailRecord = thumbnailRepository.findById(thumbnailId);

        if(productRecord.isEmpty()) {
            System.out.println("In Product service - remove thumbnail, Product is not found with barcode: " + barcode);
            return HttpStatus.NOT_FOUND;
        } else if(thumbnailRecord.isEmpty()) {
            System.out.println("In Product service - remove thumbnail, Thumbnail is not found with id: " + thumbnailId);
            return HttpStatus.NOT_FOUND;
        }

        Product product = productRecord.get();
        Thumbnail thumbnail = thumbnailRecord.get();
        product.getThumbnails().remove(thumbnail);
        cloudinaryService.delete(thumbnail.getPublicId());
        thumbnailRepository.delete(thumbnail);
        productRepository.save(product);

        return HttpStatus.OK;
    }

    public ResponseEntity<DisableProductResponse> deleteByBarcode(String barcode) {
            List<Order> orders = orderRepository.findByProductBarcode(barcode);
            if (orders.isEmpty()) {
                Product product = productRepository.findByBarcode(barcode).get();
                product.setDeletedAt(LocalDateTime.now());
                productRepository.save(product);
                return new ResponseEntity<>(new DisableProductResponse(false, "Product disabled successfully"), HttpStatus.ACCEPTED);
            } else {
                return new ResponseEntity<>(new DisableProductResponse(true, "Product cannot be disabled because of being in an order"), HttpStatus.METHOD_NOT_ALLOWED);
            }

    }
}

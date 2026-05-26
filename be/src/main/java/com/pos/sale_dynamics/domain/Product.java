package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@Data
@Setter
@Table(name = "products")
    public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "product_id")
    private String id;

    private String name;
    private String description;
    private String provider;

    private LocalDateTime deletedAt;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;

    private String baseUnit;
    private int salePrice;
    private int comparedPrice;

    @Column(unique = true)
    private String sku;
    @Column(unique = true, nullable = false)
    private String barcode;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Property> properties= new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "Product_Thumbnail",
            joinColumns = {@JoinColumn(name="product_id")},
            inverseJoinColumns = {@JoinColumn(name = "thumbnail_id")}
    )
    private List<Thumbnail> thumbnails = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "Product_Variant",
            joinColumns = {@JoinColumn(name="product_id")},
            inverseJoinColumns = {@JoinColumn(name = "variant_id")}
    )
    private List<Variant> variant;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product")
    private List<OrderItem> orderItems;

    public Product(
            String name,
            String description,
            String provider,
            Category category,
            String baseUnit,
            int salePrice,
            int comparedPrice,
            String sku,
            String barcode
    ) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.description = description;
        this.provider = provider;
        this.category = category;
        this.baseUnit = baseUnit;
        this.salePrice = salePrice;
        this.comparedPrice = comparedPrice;
        this.sku = sku;
        this.barcode = barcode;
        this.deletedAt = null;
    }

    public Product() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.provider = null;
        this.category = null;
        this.baseUnit = null;
        this.salePrice = 0;
        this.comparedPrice = 0;
        this.sku = null;
        this.barcode = null;
        this.deletedAt = null;
    }
}


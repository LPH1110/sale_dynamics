package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "variants")
@NoArgsConstructor
public class Variant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true)
    private String sku;
    @Column(unique = true)
    private String barcode;
    private String baseUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}

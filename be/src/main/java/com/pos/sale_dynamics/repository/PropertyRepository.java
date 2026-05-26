package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.Product;
import com.pos.sale_dynamics.domain.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property,Long> {
    List<Property> findAll();

    @Query("SELECT p FROM Property p WHERE p.product.id = ?1 AND p.name = ?2")
    Optional<Property> findByProductIdAndName(String productId, String name);


}

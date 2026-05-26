package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.Product;
import com.pos.sale_dynamics.domain.Property;
import com.pos.sale_dynamics.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag,Long> {
    List<Tag> findAll();

    @Query("SELECT t FROM Tag t WHERE t.property.id = ?1 AND t.name = ?2")
    Optional<Tag> findByPropertyIdAndName(Long propertyId, String name);
}

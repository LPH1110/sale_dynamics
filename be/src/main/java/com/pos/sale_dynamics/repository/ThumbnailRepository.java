package com.pos.sale_dynamics.repository;

import com.pos.sale_dynamics.domain.Product;
import com.pos.sale_dynamics.domain.Property;
import com.pos.sale_dynamics.domain.Thumbnail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface ThumbnailRepository extends JpaRepository<Thumbnail,Long> {
    List<Thumbnail> findAll();
    Optional<Thumbnail> findById(long id);

}

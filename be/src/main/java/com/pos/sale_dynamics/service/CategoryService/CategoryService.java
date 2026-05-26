package com.pos.sale_dynamics.service.CategoryService;

import com.pos.sale_dynamics.domain.Category;

import java.util.Optional;

public interface CategoryService {
    Optional<Category> findByName(String name);
}

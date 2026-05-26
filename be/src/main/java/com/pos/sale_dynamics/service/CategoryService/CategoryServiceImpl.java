package com.pos.sale_dynamics.service.CategoryService;

import com.pos.sale_dynamics.domain.Category;
import com.pos.sale_dynamics.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService{

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

}

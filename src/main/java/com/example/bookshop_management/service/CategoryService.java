package com.example.bookshop_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.entity.Category;
import com.example.bookshop_management.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
       return categoryRepository.findById(id).orElse(null);
    }

    public void deleteCategory(Long id) {
       categoryRepository.deleteById(id);
    }

    public Category updateCategory(Long id, Category category) {
    Category existingCategory = categoryRepository.findById(id).orElse(null);

    if (existingCategory != null) {
        existingCategory.setCategoryName(category.getCategoryName());
        existingCategory.setDescription(category.getDescription());

        return categoryRepository.save(existingCategory);
    }

    return null;
    }
}
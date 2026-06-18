package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
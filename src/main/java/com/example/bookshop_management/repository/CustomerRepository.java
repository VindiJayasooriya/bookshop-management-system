package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
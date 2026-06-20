package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.Order;

import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
        @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
        Double getTotalSales();

        @Query("SELECT COALESCE(SUM(o.discountAmount), 0) FROM Order o")
        Double getTotalDiscountGiven();
}
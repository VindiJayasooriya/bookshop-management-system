package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
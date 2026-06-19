package com.example.bookshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookshop_management.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

}
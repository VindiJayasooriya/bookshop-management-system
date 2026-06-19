package com.example.bookshop_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.dto.DashboardDTO;
import com.example.bookshop_management.repository.CustomerRepository;
import com.example.bookshop_management.repository.FeedbackRepository;
import com.example.bookshop_management.repository.OrderRepository;
import com.example.bookshop_management.repository.PaymentRepository;
import com.example.bookshop_management.repository.ProductRepository;

@Service
public class DashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    public DashboardDTO getDashboardData() {

        return new DashboardDTO(
                customerRepository.count(),
                productRepository.count(),
                orderRepository.count(),
                paymentRepository.count(),
                feedbackRepository.count(),
                orderRepository.getTotalSales()
        );
    }
}
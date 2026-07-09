package com.example.bookshop_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookshop_management.dto.CheckoutRequest;
import com.example.bookshop_management.entity.Order;
import com.example.bookshop_management.service.CheckoutService;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping
    public Order placeOrder(@RequestBody CheckoutRequest request) {
        return checkoutService.placeOrder(request);
    }
}

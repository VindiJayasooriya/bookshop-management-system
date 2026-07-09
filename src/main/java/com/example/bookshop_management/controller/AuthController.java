package com.example.bookshop_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookshop_management.dto.LoginRequest;
import com.example.bookshop_management.dto.RegisterRequest;
import com.example.bookshop_management.entity.Customer;
import com.example.bookshop_management.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public Customer register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public Customer login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

package com.example.bookshop_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.dto.LoginRequest;
import com.example.bookshop_management.dto.RegisterRequest;
import com.example.bookshop_management.entity.Customer;
import com.example.bookshop_management.exception.ResourceNotFoundException;
import com.example.bookshop_management.repository.CustomerRepository;

@Service
public class AuthService {

    private static final double MEMBER_DISCOUNT = 5.0;

    @Autowired
    private CustomerRepository customerRepository;

    public Customer register(RegisterRequest request) {

        if (customerRepository.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered");
        }

        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPassword(request.getPassword());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setIsMember(true);
        customer.setDiscountPercentage(MEMBER_DISCOUNT);

        return customerRepository.save(customer);
    }

    public Customer login(LoginRequest request) {

        Customer customer = customerRepository.findByEmail(request.getEmail());

        if (customer == null) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        if (customer.getPassword() == null
                || !customer.getPassword().equals(request.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        return customer;
    }
}

package com.example.bookshop_management.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookshop_management.dto.CheckoutItemDTO;
import com.example.bookshop_management.dto.CheckoutRequest;
import com.example.bookshop_management.entity.Customer;
import com.example.bookshop_management.entity.Order;
import com.example.bookshop_management.entity.OrderItem;
import com.example.bookshop_management.entity.Product;
import com.example.bookshop_management.exception.ResourceNotFoundException;
import com.example.bookshop_management.repository.CustomerRepository;
import com.example.bookshop_management.repository.OrderItemRepository;
import com.example.bookshop_management.repository.OrderRepository;
import com.example.bookshop_management.repository.ProductRepository;

@Service
public class CheckoutService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Transactional
    public Order placeOrder(CheckoutRequest request) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Customer customer = resolveCustomer(request);

        double subtotal = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CheckoutItemDTO item : request.getItems()) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with ID: " + item.getProductId()));

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for " + product.getProductName());
            }

            double lineTotal = product.getPrice() * item.getQuantity();
            subtotal += lineTotal;

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItems.add(orderItem);

            product.setStockQuantity(
                    product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        Order order = new Order();
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus("PENDING");
        order.setCustomer(customer);
        order.setTotalAmount(subtotal);
        order.setDiscountAmount(0.0);

        if (Boolean.TRUE.equals(customer.getIsMember())) {

            double discountPercentage = customer.getDiscountPercentage() != null
                    ? customer.getDiscountPercentage() : 0.0;

            double discountAmount = subtotal * discountPercentage / 100;
            order.setDiscountAmount(discountAmount);
            order.setTotalAmount(subtotal - discountAmount);
        }

        Order savedOrder = orderRepository.save(order);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(savedOrder);
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    private Customer resolveCustomer(CheckoutRequest request) {

        if (request.getCustomerId() != null) {

            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Customer not found with ID: " + request.getCustomerId()));

            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setAddress(request.getAddress());

            return customerRepository.save(customer);
        }

        Customer existing = customerRepository.findByEmail(request.getEmail());

        if (existing != null) {

            existing.setFirstName(request.getFirstName());
            existing.setLastName(request.getLastName());
            existing.setPhoneNumber(request.getPhoneNumber());
            existing.setAddress(request.getAddress());

            return customerRepository.save(existing);
        }

        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setIsMember(false);
        customer.setDiscountPercentage(0.0);

        return customerRepository.save(customer);
    }
}

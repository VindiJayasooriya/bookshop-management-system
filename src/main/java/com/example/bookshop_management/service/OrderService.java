package com.example.bookshop_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.entity.Customer;
import com.example.bookshop_management.repository.CustomerRepository;

import com.example.bookshop_management.entity.Order;
import com.example.bookshop_management.exception.ResourceNotFoundException;
import com.example.bookshop_management.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Order saveOrder(Order order) {

      if (order.getCustomer() != null) {

        Long customerId = order.getCustomer().getCustomerId();

        Customer customer =
                customerRepository.findById(customerId).orElse(null);

        if (customer != null &&
            Boolean.TRUE.equals(customer.getIsMember())) {

            Double totalAmount = order.getTotalAmount();

            Double discountPercentage =
                    customer.getDiscountPercentage();

            Double discountAmount =
                    totalAmount * discountPercentage / 100;

            order.setDiscountAmount(discountAmount);

            order.setTotalAmount(totalAmount - discountAmount);
        } else {
            order.setDiscountAmount(0.0);
      }

        order.setCustomer(customer);
    }

      return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
           .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Order not found with ID: " + id));
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order updateOrder(Long id, Order order) {

        Order existingOrder = orderRepository.findById(id).orElse(null);

        if (existingOrder != null) {

            existingOrder.setOrderDate(order.getOrderDate());
            existingOrder.setTotalAmount(order.getTotalAmount());
            existingOrder.setDiscountAmount(order.getDiscountAmount());
            existingOrder.setOrderStatus(order.getOrderStatus());
            existingOrder.setCustomer(order.getCustomer());

            return orderRepository.save(existingOrder);
        }

        return null;
    }

    public List<Order> getRecentOrders() {
        return orderRepository.findTop5ByOrderByOrderDateDesc();
    }

    public List<Order> getOrdersByStatus(String status) {
       return orderRepository.findByOrderStatus(status);
    }
}
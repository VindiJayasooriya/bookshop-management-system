package com.example.bookshop_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.entity.OrderItem;
import com.example.bookshop_management.repository.OrderItemRepository;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id).orElse(null);
    }

    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }

    public OrderItem updateOrderItem(Long id, OrderItem orderItem) {

        OrderItem existingOrderItem =
                orderItemRepository.findById(id).orElse(null);

        if (existingOrderItem != null) {

            existingOrderItem.setQuantity(orderItem.getQuantity());
            existingOrderItem.setUnitPrice(orderItem.getUnitPrice());
            existingOrderItem.setOrder(orderItem.getOrder());
            existingOrderItem.setProduct(orderItem.getProduct());

            return orderItemRepository.save(existingOrderItem);
        }

        return null;
    }
}
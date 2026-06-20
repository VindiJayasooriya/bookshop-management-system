package com.example.bookshop_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.entity.Payment;
import com.example.bookshop_management.exception.ResourceNotFoundException;
import com.example.bookshop_management.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
           .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Payment not found with ID: " + id));
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    public Payment updatePayment(Long id, Payment payment) {

        Payment existingPayment =
                paymentRepository.findById(id).orElse(null);

        if (existingPayment != null) {

            existingPayment.setPaymentDate(payment.getPaymentDate());
            existingPayment.setAmount(payment.getAmount());
            existingPayment.setPaymentMethod(payment.getPaymentMethod());
            existingPayment.setPaymentStatus(payment.getPaymentStatus());
            existingPayment.setOrder(payment.getOrder());

            return paymentRepository.save(existingPayment);
        }

        return null;
    }
}
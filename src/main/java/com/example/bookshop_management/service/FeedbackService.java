package com.example.bookshop_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookshop_management.entity.Feedback;
import com.example.bookshop_management.exception.ResourceNotFoundException;
import com.example.bookshop_management.repository.FeedbackRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
           .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Feedback not found with ID: " + id));
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    public Feedback updateFeedback(Long id, Feedback feedback) {

        Feedback existingFeedback =
                feedbackRepository.findById(id).orElse(null);

        if (existingFeedback != null) {

            existingFeedback.setRating(feedback.getRating());
            existingFeedback.setComment(feedback.getComment());
            existingFeedback.setFeedbackDate(feedback.getFeedbackDate());
            existingFeedback.setCustomer(feedback.getCustomer());
            existingFeedback.setProduct(feedback.getProduct());

            return feedbackRepository.save(existingFeedback);
        }

        return null;
    }
}
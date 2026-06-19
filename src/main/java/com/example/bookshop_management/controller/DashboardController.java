package com.example.bookshop_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookshop_management.dto.DashboardDTO;
import com.example.bookshop_management.service.DashboardService;

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/api/dashboard")
    public DashboardDTO getDashboardData() {
        return dashboardService.getDashboardData();
    }
}
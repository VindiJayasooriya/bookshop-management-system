package com.example.bookshop_management.dto;

public class DashboardDTO {

    private long totalCustomers;
    private long totalProducts;
    private long totalOrders;
    private long totalPayments;
    private long totalFeedbacks;
    private Double totalSales;

    public DashboardDTO() {
    }

    public DashboardDTO(long totalCustomers,
                        long totalProducts,
                        long totalOrders,
                        long totalPayments,
                        long totalFeedbacks,
                        Double totalSales) {

        this.totalCustomers = totalCustomers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalPayments = totalPayments;
        this.totalFeedbacks = totalFeedbacks;
        this.totalSales = totalSales;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public long getTotalFeedbacks() {
        return totalFeedbacks;
    }

    public void setTotalFeedbacks(long totalFeedbacks) {
        this.totalFeedbacks = totalFeedbacks;
    }

    public Double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Double totalSales) {
        this.totalSales = totalSales;
    }
}
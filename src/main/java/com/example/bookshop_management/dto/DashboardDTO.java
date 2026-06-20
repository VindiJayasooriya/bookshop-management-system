package com.example.bookshop_management.dto;

public class DashboardDTO {

    private long totalCustomers;
    private long totalProducts;
    private long totalOrders;
    private long totalPayments;
    private long totalFeedbacks;
    private Double totalSales;
    private Double totalDiscountGiven;
    private long pendingOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long memberCustomers;
    private long nonMemberCustomers;

    public DashboardDTO() {
    }

    public DashboardDTO(long totalCustomers,
                        long totalProducts,
                        long totalOrders,
                        long totalPayments,
                        long totalFeedbacks,
                        Double totalSales,
                        Double totalDiscountGiven,
                        long pendingOrders,
                        long completeOrders,
                        long cancelledOrders,
                        long memberCustomers,
                        long nonMemberCustomers) {

        this.totalCustomers = totalCustomers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalPayments = totalPayments;
        this.totalFeedbacks = totalFeedbacks;
        this.totalSales = totalSales;
        this.totalDiscountGiven = totalDiscountGiven;
        this.pendingOrders = pendingOrders;
        this.completedOrders = completeOrders;
        this.cancelledOrders = cancelledOrders;
        this.memberCustomers = memberCustomers;
        this.nonMemberCustomers = nonMemberCustomers;
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

    public Double getTotalDiscountGiven() {
        return totalDiscountGiven;
    }

    public void setTotalDiscountGiven(Double totalDiscountGiven) {
        this.totalDiscountGiven = totalDiscountGiven;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public long getMemberCustomers() {
        return memberCustomers;
    }

    public void setMemberCustomers(long memberCustomers) {
        this.memberCustomers = memberCustomers;
    }
    
    public long getNonMemberCustomers() {
        return nonMemberCustomers;
    }

    public void setNonMemberCustomers(long nonMemberCustomers) {
        this.nonMemberCustomers = nonMemberCustomers;
    }

    
}
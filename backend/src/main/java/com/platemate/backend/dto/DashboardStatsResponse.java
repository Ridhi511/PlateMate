package com.platemate.backend.dto;

public class DashboardStatsResponse {

    private Long totalOrganizations;
    private Long totalFoodListings;
    private Long availableFoodListings;
    private Long totalRequests;
    private Long pendingRequests;
    private Long completedRequests;

    public DashboardStatsResponse(
            Long totalOrganizations,
            Long totalFoodListings,
            Long availableFoodListings,
            Long totalRequests,
            Long pendingRequests,
            Long completedRequests) {

        this.totalOrganizations = totalOrganizations;
        this.totalFoodListings = totalFoodListings;
        this.availableFoodListings = availableFoodListings;
        this.totalRequests = totalRequests;
        this.pendingRequests = pendingRequests;
        this.completedRequests = completedRequests;
    }

    public Long getTotalOrganizations() {
        return totalOrganizations;
    }

    public Long getTotalFoodListings() {
        return totalFoodListings;
    }

    public Long getAvailableFoodListings() {
        return availableFoodListings;
    }

    public Long getTotalRequests() {
        return totalRequests;
    }

    public Long getPendingRequests() {
        return pendingRequests;
    }

    public Long getCompletedRequests() {
        return completedRequests;
    }
}
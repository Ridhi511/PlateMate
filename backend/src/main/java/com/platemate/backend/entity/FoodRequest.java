package com.platemate.backend.entity;

import com.platemate.backend.enums.RequestStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "food_requests")
public class FoodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "food_listing_id")
    private FoodListing foodListing;

    @ManyToOne
    @JoinColumn(name = "receiver_organization_id")
    private Organization receiverOrganization;

    private Integer requestedQuantity;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime createdAt;

    public FoodRequest() {
    }

    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();

        if (status == null) {
            status = RequestStatus.PENDING;
        }
    }

    public Long getId() {
        return id;
    }

    public FoodListing getFoodListing() {
        return foodListing;
    }

    public void setFoodListing(FoodListing foodListing) {
        this.foodListing = foodListing;
    }

    public Organization getReceiverOrganization() {
        return receiverOrganization;
    }

    public void setReceiverOrganization(
            Organization receiverOrganization) {

        this.receiverOrganization =
                receiverOrganization;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(
            Integer requestedQuantity) {

        this.requestedQuantity =
                requestedQuantity;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(
            RequestStatus status) {

        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
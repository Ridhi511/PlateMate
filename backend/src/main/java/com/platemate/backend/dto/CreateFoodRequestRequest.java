package com.platemate.backend.dto;

public class CreateFoodRequestRequest {

    private Long foodListingId;

    private Long receiverOrganizationId;

    private Integer requestedQuantity;

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public Long getReceiverOrganizationId() {
        return receiverOrganizationId;
    }

    public void setReceiverOrganizationId(
            Long receiverOrganizationId) {

        this.receiverOrganizationId =
                receiverOrganizationId;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(
            Integer requestedQuantity) {

        this.requestedQuantity =
                requestedQuantity;
    }
}
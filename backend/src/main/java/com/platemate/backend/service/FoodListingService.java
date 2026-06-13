package com.platemate.backend.service;

import com.platemate.backend.dto.CreateFoodListingRequest;
import com.platemate.backend.entity.FoodListing;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.enums.FoodStatus;
import com.platemate.backend.enums.OrganizationType;
import com.platemate.backend.enums.VerificationStatus;
import com.platemate.backend.exception.InvalidFoodRequestException;
import com.platemate.backend.repository.FoodListingRepository;
import com.platemate.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodListingService {

    private final FoodListingRepository foodListingRepository;
    private final OrganizationRepository organizationRepository;

    public FoodListingService(
            FoodListingRepository foodListingRepository,
            OrganizationRepository organizationRepository) {

        this.foodListingRepository = foodListingRepository;
        this.organizationRepository = organizationRepository;
    }

    public FoodListing createFoodListing(
            CreateFoodListingRequest request) {

        Organization organization =
                organizationRepository.findById(
                        request.getOrganizationId())
                        .orElseThrow(() ->
                                new InvalidFoodRequestException(
                                        "Organization not found"));

        if (organization.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new InvalidFoodRequestException(
                    "Organization must be verified");
        }

        if (!isProviderOrganization(
                organization.getType())) {

            throw new InvalidFoodRequestException(
                    "Only provider organizations can create food listings");
        }

        if (request.getQuantity() == null
                || request.getQuantity() <= 0) {

            throw new InvalidFoodRequestException(
                    "Quantity must be greater than zero");
        }

        if (request.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new InvalidFoodRequestException(
                    "Expiry time must be in the future");
        }

        FoodListing foodListing = new FoodListing();

        foodListing.setFoodName(request.getFoodName());
        foodListing.setDescription(request.getDescription());
        foodListing.setQuantity(request.getQuantity());
        foodListing.setUnit(request.getUnit());
        foodListing.setExpiryTime(
                request.getExpiryTime());
        foodListing.setPickupAddress(
                request.getPickupAddress());

        foodListing.setStatus(
                FoodStatus.AVAILABLE);

        foodListing.setOrganization(
                organization);

        return foodListingRepository.save(
                foodListing);
    }

    public List<FoodListing> getAllFoodListings() {
        return foodListingRepository.findAll();
    }

    private boolean isProviderOrganization(
            OrganizationType type) {

        return type == OrganizationType.RESTAURANT
                || type == OrganizationType.BAKERY
                || type == OrganizationType.HOTEL
                || type == OrganizationType.SUPERMARKET
                || type == OrganizationType.WEDDING_VENUE
                || type == OrganizationType.CORPORATE_CAFETERIA
                || type == OrganizationType.COLLEGE_MESS;
    }
    public List<FoodListing> getAvailableFoodListings() {

    return foodListingRepository
            .findByStatus(FoodStatus.AVAILABLE);
}
}
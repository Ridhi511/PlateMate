package com.platemate.backend.service;
import java.util.List;
import com.platemate.backend.dto.CreateFoodRequestRequest;
import com.platemate.backend.entity.FoodListing;
import com.platemate.backend.entity.FoodRequest;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.enums.FoodStatus;
import com.platemate.backend.enums.OrganizationType;
import com.platemate.backend.enums.VerificationStatus;
import com.platemate.backend.exception.FoodListingNotFoundException;
import com.platemate.backend.exception.InvalidFoodRequestException;
import com.platemate.backend.exception.OrganizationNotVerifiedException;
import com.platemate.backend.repository.FoodListingRepository;
import com.platemate.backend.repository.FoodRequestRepository;
import com.platemate.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import com.platemate.backend.enums.RequestStatus;
@Service
public class FoodRequestService {

    private final FoodRequestRepository foodRequestRepository;
    private final FoodListingRepository foodListingRepository;
    private final OrganizationRepository organizationRepository;
    

    public FoodRequestService(
            FoodRequestRepository foodRequestRepository,
            FoodListingRepository foodListingRepository,
            OrganizationRepository organizationRepository) {

        this.foodRequestRepository = foodRequestRepository;
        this.foodListingRepository = foodListingRepository;
        this.organizationRepository = organizationRepository;
    }

    public FoodRequest createFoodRequest(
            CreateFoodRequestRequest request) {

        FoodListing foodListing =
                foodListingRepository.findById(
                        request.getFoodListingId())
                        .orElseThrow(() ->
                                new FoodListingNotFoundException(
                                        request.getFoodListingId()));

        Organization receiver =
                organizationRepository.findById(
                        request.getReceiverOrganizationId())
                        .orElseThrow(() ->
                                new InvalidFoodRequestException(
                                        "Receiver organization not found"));

        if (receiver.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new OrganizationNotVerifiedException(
                    receiver.getName());
        }

        if (!isReceiverOrganization(receiver.getType())) {

            throw new InvalidFoodRequestException(
                    "Only receiver organizations can request food");
        }

        if (foodListing.getOrganization().getId()
                .equals(receiver.getId())) {

            throw new InvalidFoodRequestException(
                    "Cannot request your own food listing");
        }

        if (foodListing.getExpiryTime()
                .isBefore(java.time.LocalDateTime.now())) {

            throw new InvalidFoodRequestException(
                    "Food listing has expired");
        }

        if (foodListing.getStatus()
                != FoodStatus.AVAILABLE) {

            throw new InvalidFoodRequestException(
                    "Food listing is not available");
        }

        if (request.getRequestedQuantity() <= 0) {

    throw new InvalidFoodRequestException(
            "Requested quantity must be greater than zero");
}

if (request.getRequestedQuantity()
        > foodListing.getQuantity()) {

    throw new InvalidFoodRequestException(
            "Requested quantity exceeds available quantity");
}

        FoodRequest foodRequest = new FoodRequest();

        foodRequest.setFoodListing(foodListing);
        foodRequest.setReceiverOrganization(receiver);
        foodRequest.setRequestedQuantity(
                request.getRequestedQuantity());

        return foodRequestRepository.save(foodRequest);
    }

    public FoodRequest approveRequest(Long requestId) {

    FoodRequest request = foodRequestRepository
            .findById(requestId)
            .orElseThrow(() ->
                    new InvalidFoodRequestException(
                            "Request not found"));

    FoodListing listing = request.getFoodListing();

    if (request.getRequestedQuantity()
            > listing.getQuantity()) {

        throw new InvalidFoodRequestException(
                "Not enough food available");
    }

    listing.setQuantity(
            listing.getQuantity()
            - request.getRequestedQuantity());

    request.setStatus(
            RequestStatus.APPROVED);

    if (listing.getQuantity() == 0) {

        listing.setStatus(
                FoodStatus.RESERVED);
    }

    foodListingRepository.save(listing);

    return foodRequestRepository.save(request);
}

public FoodRequest completeRequest(Long requestId) {

    FoodRequest request = foodRequestRepository
            .findById(requestId)
            .orElseThrow(() ->
                    new InvalidFoodRequestException(
                            "Request not found"));

    if (request.getStatus()
            != RequestStatus.APPROVED) {

        throw new InvalidFoodRequestException(
                "Only approved requests can be completed");
    }

    Organization provider =
            request.getFoodListing()
                    .getOrganization();

    Organization receiver =
            request.getReceiverOrganization();

    provider.setTrustScore(
            (provider.getTrustScore() == null
                    ? 0
                    : provider.getTrustScore()) + 5);

    receiver.setTrustScore(
            (receiver.getTrustScore() == null
                    ? 0
                    : receiver.getTrustScore()) + 5);

    organizationRepository.save(provider);
    organizationRepository.save(receiver);

    request.setStatus(
            RequestStatus.COMPLETED);

    return foodRequestRepository.save(request);
}

public FoodRequest rejectRequest(Long requestId) {

    FoodRequest request = foodRequestRepository
            .findById(requestId)
            .orElseThrow(() ->
                    new InvalidFoodRequestException(
                            "Request not found"));

    request.setStatus(
            RequestStatus.REJECTED);

    return foodRequestRepository.save(request);
}
 public List<FoodRequest> getAllRequests() {

    return foodRequestRepository.findAll();
}

public List<FoodRequest> getPendingRequests() {

    return foodRequestRepository
            .findByStatus(
                    RequestStatus.PENDING);
}

    private boolean isReceiverOrganization(
            OrganizationType type) {

        return type == OrganizationType.NGO
                || type == OrganizationType.FOOD_BANK
                || type == OrganizationType.ORPHANAGE
                || type == OrganizationType.SHELTER_HOME
                || type == OrganizationType.COMMUNITY_KITCHEN;
    }
  
}
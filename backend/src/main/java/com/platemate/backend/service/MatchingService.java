package com.platemate.backend.service;

import com.platemate.backend.dto.MatchedOrganizationResponse;
import com.platemate.backend.entity.FoodListing;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.enums.OrganizationType;
import com.platemate.backend.enums.VerificationStatus;
import com.platemate.backend.repository.FoodListingRepository;
import com.platemate.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final OrganizationRepository organizationRepository;
    private final FoodListingRepository foodListingRepository;

    public MatchingService(
            OrganizationRepository organizationRepository,
            FoodListingRepository foodListingRepository) {

        this.organizationRepository =
                organizationRepository;

        this.foodListingRepository =
                foodListingRepository;
    }

    public List<MatchedOrganizationResponse>
    getBestMatches() {

        return organizationRepository
                .findByVerificationStatus(
                        VerificationStatus.VERIFIED)
                .stream()

                .filter(org ->
                        org.getType() == OrganizationType.NGO
                                || org.getType() == OrganizationType.FOOD_BANK
                                || org.getType() == OrganizationType.ORPHANAGE
                                || org.getType() == OrganizationType.SHELTER_HOME
                                || org.getType() == OrganizationType.COMMUNITY_KITCHEN)

                .map(org -> new MatchedOrganizationResponse(
                        org.getId(),
                        org.getName(),
                        calculateScore(org)))

                .sorted(
                        Comparator.comparing(
                                MatchedOrganizationResponse::getScore)
                                .reversed())

                .collect(Collectors.toList());
    }

    public List<MatchedOrganizationResponse>
    getMatchesForFoodListing(
            Long foodListingId) {

        FoodListing listing =
                foodListingRepository.findById(
                        foodListingId)
                        .orElseThrow();

        Double providerLat =
                listing.getOrganization()
                        .getLatitude();

        Double providerLon =
                listing.getOrganization()
                        .getLongitude();

        return organizationRepository
                .findByVerificationStatus(
                        VerificationStatus.VERIFIED)
                .stream()

                .filter(org ->
                        org.getType() == OrganizationType.NGO
                                || org.getType() == OrganizationType.FOOD_BANK
                                || org.getType() == OrganizationType.ORPHANAGE
                                || org.getType() == OrganizationType.SHELTER_HOME
                                || org.getType() == OrganizationType.COMMUNITY_KITCHEN)

                .map(org -> new MatchedOrganizationResponse(
                        org.getId(),
                        org.getName(),
                        calculateScore(
                                org,
                                providerLat,
                                providerLon)))

                .sorted(
                        Comparator.comparing(
                                MatchedOrganizationResponse::getScore)
                                .reversed())

                .collect(Collectors.toList());
    }

    private Double calculateScore(
            Organization organization) {

        double trustScore =
                organization.getTrustScore() == null
                        ? 0
                        : organization.getTrustScore();

        int capacity =
                organization.getDailyCapacity() == null
                        ? 0
                        : organization.getDailyCapacity();

        int load =
                organization.getCurrentLoad() == null
                        ? 0
                        : organization.getCurrentLoad();

        return trustScore + (capacity - load);
    }

    private Double calculateScore(
            Organization organization,
            Double providerLat,
            Double providerLon) {

        double trustScore =
                organization.getTrustScore() == null
                        ? 0
                        : organization.getTrustScore();

        int capacity =
                organization.getDailyCapacity() == null
                        ? 0
                        : organization.getDailyCapacity();

        int load =
                organization.getCurrentLoad() == null
                        ? 0
                        : organization.getCurrentLoad();

        double distance =
                calculateDistance(
                        providerLat,
                        providerLon,
                        organization.getLatitude(),
                        organization.getLongitude());

        return trustScore
                + (capacity - load)
                - distance;
    }

    private double calculateDistance(
            Double lat1,
            Double lon1,
            Double lat2,
            Double lon2) {

        if (lat1 == null || lon1 == null
                || lat2 == null || lon2 == null) {

            return 1000;
        }

        double latDiff = lat1 - lat2;
        double lonDiff = lon1 - lon2;

        return Math.sqrt(
                latDiff * latDiff
                        + lonDiff * lonDiff);
    }
}
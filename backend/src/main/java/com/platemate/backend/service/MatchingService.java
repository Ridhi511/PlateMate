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
                        calculateBasicScore(org)))

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
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Food listing not found"));

        Organization provider =
                listing.getOrganization();

        Double providerLat =
                provider.getLatitude();

        Double providerLon =
                provider.getLongitude();

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

                .filter(org ->
                        !org.getId().equals(
                                provider.getId()))

                .map(org -> new MatchedOrganizationResponse(
                        org.getId(),
                        org.getName(),
                        calculateDistanceBasedScore(
                                org,
                                providerLat,
                                providerLon)))

                .sorted(
                        Comparator.comparing(
                                MatchedOrganizationResponse::getScore)
                                .reversed())

                .collect(Collectors.toList());
    }

    private Double calculateBasicScore(
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

    private Double calculateDistanceBasedScore(
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
                - (distance * 2);
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

        final int EARTH_RADIUS = 6371;

        double latDistance =
                Math.toRadians(lat2 - lat1);

        double lonDistance =
                Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}
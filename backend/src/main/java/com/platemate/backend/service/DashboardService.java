package com.platemate.backend.service;

import com.platemate.backend.dto.DashboardStatsResponse;
import com.platemate.backend.enums.FoodStatus;
import com.platemate.backend.enums.RequestStatus;
import com.platemate.backend.repository.FoodListingRepository;
import com.platemate.backend.repository.FoodRequestRepository;
import com.platemate.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final OrganizationRepository organizationRepository;
    private final FoodListingRepository foodListingRepository;
    private final FoodRequestRepository foodRequestRepository;

    public DashboardService(
            OrganizationRepository organizationRepository,
            FoodListingRepository foodListingRepository,
            FoodRequestRepository foodRequestRepository) {

        this.organizationRepository = organizationRepository;
        this.foodListingRepository = foodListingRepository;
        this.foodRequestRepository = foodRequestRepository;
    }

    public DashboardStatsResponse getStats() {

        return new DashboardStatsResponse(

                organizationRepository.count(),

                foodListingRepository.count(),

                foodListingRepository.countByStatus(
                        FoodStatus.AVAILABLE),

                foodRequestRepository.count(),

                foodRequestRepository.countByStatus(
                        RequestStatus.PENDING),

                foodRequestRepository.countByStatus(
                        RequestStatus.COMPLETED)
        );
    }
}
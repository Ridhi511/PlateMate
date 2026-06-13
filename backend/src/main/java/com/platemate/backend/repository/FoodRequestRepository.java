package com.platemate.backend.repository;
import java.util.List;
import com.platemate.backend.entity.FoodRequest;
import com.platemate.backend.enums.RequestStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRequestRepository
        extends JpaRepository<FoodRequest, Long> {
                List<FoodRequest> findByStatus(
        RequestStatus status);

        long countByStatus(RequestStatus status);
}
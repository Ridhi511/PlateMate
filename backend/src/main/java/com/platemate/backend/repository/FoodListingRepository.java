package com.platemate.backend.repository;
import java.util.List;
import com.platemate.backend.entity.FoodListing;
import com.platemate.backend.enums.FoodStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodListingRepository
        extends JpaRepository<FoodListing, Long> {
                List<FoodListing> findByStatus(FoodStatus status);

                long countByStatus(FoodStatus status);
}

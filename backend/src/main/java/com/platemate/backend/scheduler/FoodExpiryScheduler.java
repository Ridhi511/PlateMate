package com.platemate.backend.scheduler;

import com.platemate.backend.entity.FoodListing;
import com.platemate.backend.enums.FoodStatus;
import com.platemate.backend.repository.FoodListingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class FoodExpiryScheduler {

    private final FoodListingRepository foodListingRepository;

    public FoodExpiryScheduler(
            FoodListingRepository foodListingRepository) {

        this.foodListingRepository =
                foodListingRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void expireFoodListings() {

        List<FoodListing> listings =
                foodListingRepository.findByStatus(
                        FoodStatus.AVAILABLE);

        for (FoodListing listing : listings) {

            if (listing.getExpiryTime()
                    .isBefore(LocalDateTime.now())) {

                listing.setStatus(
                        FoodStatus.EXPIRED);

                foodListingRepository.save(
                        listing);
            }
        }
    }
}
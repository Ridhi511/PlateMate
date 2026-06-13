package com.platemate.backend.controller;

import com.platemate.backend.dto.CreateFoodListingRequest;
import com.platemate.backend.entity.FoodListing;
import com.platemate.backend.service.FoodListingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/food-listings")
public class FoodListingController {

    private final FoodListingService foodListingService;

    public FoodListingController(
            FoodListingService foodListingService) {

        this.foodListingService = foodListingService;
    }

    @PostMapping
    public FoodListing createFoodListing(
            @RequestBody CreateFoodListingRequest request) {

        return foodListingService
                .createFoodListing(request);
    }

    @GetMapping
    public List<FoodListing> getAllFoodListings() {
        return foodListingService
                .getAllFoodListings();
    }
    @GetMapping("/available")
public List<FoodListing> getAvailableFoodListings() {

    return foodListingService
            .getAvailableFoodListings();
}

}
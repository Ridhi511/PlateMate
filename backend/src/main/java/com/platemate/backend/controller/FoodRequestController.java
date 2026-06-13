package com.platemate.backend.controller;
import java.util.List;
import com.platemate.backend.dto.CreateFoodRequestRequest;
import com.platemate.backend.entity.FoodRequest;
import com.platemate.backend.service.FoodRequestService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/food-requests")
public class FoodRequestController {

    private final FoodRequestService foodRequestService;

    public FoodRequestController(
            FoodRequestService foodRequestService) {

        this.foodRequestService = foodRequestService;
    }

    @PostMapping
    public FoodRequest createFoodRequest(
            @RequestBody CreateFoodRequestRequest request) {

        return foodRequestService.createFoodRequest(
                request);
    }

    @PutMapping("/{id}/approve")
public FoodRequest approveRequest(
        @PathVariable Long id) {

    return foodRequestService.approveRequest(id);
}
@PutMapping("/{id}/reject")
public FoodRequest rejectRequest(
        @PathVariable Long id) {

    return foodRequestService.rejectRequest(id);
}
    @PutMapping("/{id}/complete")
public FoodRequest completeRequest(
        @PathVariable Long id) {

    return foodRequestService
            .completeRequest(id);
}
@GetMapping
public List<FoodRequest> getAllRequests() {

    return foodRequestService
            .getAllRequests();
}
@GetMapping("/pending")
public List<FoodRequest> getPendingRequests() {

    return foodRequestService
            .getPendingRequests();
}
}
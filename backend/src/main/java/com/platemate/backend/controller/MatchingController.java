package com.platemate.backend.controller;

import com.platemate.backend.dto.MatchedOrganizationResponse;
import com.platemate.backend.service.MatchingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(
            MatchingService matchingService) {

        this.matchingService =
                matchingService;
    }

    @GetMapping("/organizations")
    public List<MatchedOrganizationResponse>
    getMatches() {

        return matchingService.getBestMatches();
    }
    @GetMapping("/food-listings/{id}")
public List<MatchedOrganizationResponse>
getMatchesForFoodListing(
        @PathVariable Long id) {

    return matchingService
            .getMatchesForFoodListing(id);
}
}
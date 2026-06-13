package com.platemate.backend.controller;

import com.platemate.backend.dto.CreateOrganizationRequest;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.service.OrganizationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(
            OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping
    public Organization createOrganization(
            @RequestBody CreateOrganizationRequest request) {

        return organizationService.createOrganization(
                request);
    }

    @GetMapping
    public List<Organization> getAllOrganizations() {

        return organizationService.getAllOrganizations();
    }
}
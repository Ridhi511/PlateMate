package com.platemate.backend.controller;
import java.util.List;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService) {

        this.adminService = adminService;
    }

    @PutMapping("/organizations/{id}/verify")
    public Organization verifyOrganization(
            @PathVariable Long id) {

        return adminService
                .verifyOrganization(id);
    }
    @GetMapping("/organizations/pending")
public List<Organization>
getPendingOrganizations() {

    return adminService
            .getPendingOrganizations();
}
@PutMapping("/organizations/{id}/reject")
public Organization rejectOrganization(
        @PathVariable Long id) {

    return adminService
            .rejectOrganization(id);
}
}
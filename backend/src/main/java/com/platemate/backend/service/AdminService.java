package com.platemate.backend.service;
import java.util.List;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.enums.VerificationStatus;
import com.platemate.backend.exception.InvalidFoodRequestException;
import com.platemate.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final OrganizationRepository organizationRepository;

    public AdminService(
            OrganizationRepository organizationRepository) {

        this.organizationRepository =
                organizationRepository;
    }

    public Organization verifyOrganization(
            Long organizationId) {

        Organization organization =
                organizationRepository
                        .findById(organizationId)
                        .orElseThrow(() ->
                                new InvalidFoodRequestException(
                                        "Organization not found"));

        organization.setVerificationStatus(
                VerificationStatus.VERIFIED);

        return organizationRepository.save(
                organization);
    }
    public List<Organization>
getPendingOrganizations() {

    return organizationRepository
            .findByVerificationStatus(
                    VerificationStatus.PENDING);
}

public Organization rejectOrganization(
        Long organizationId) {

    Organization organization =
            organizationRepository
                    .findById(organizationId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Organization not found"));

    organization.setVerificationStatus(
            VerificationStatus.REJECTED);

    return organizationRepository.save(
            organization);
}
}
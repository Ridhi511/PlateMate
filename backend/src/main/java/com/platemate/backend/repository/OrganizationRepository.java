package com.platemate.backend.repository;

import com.platemate.backend.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import com.platemate.backend.enums.VerificationStatus;
import java.util.List;

public interface OrganizationRepository
        extends JpaRepository<Organization, Long> {

    boolean existsByNameAndOwner_Id(
        String name,
        Long ownerId
);
List<Organization>
findByVerificationStatus(
        VerificationStatus verificationStatus);
}
package com.platemate.backend.service;

import com.platemate.backend.dto.CreateOrganizationRequest;
import com.platemate.backend.entity.Organization;
import com.platemate.backend.entity.User;
import com.platemate.backend.enums.OrganizationType;
import com.platemate.backend.enums.UserRole;
import com.platemate.backend.enums.VerificationStatus;
import com.platemate.backend.exception.OrganizationAlreadyExistsException;
import com.platemate.backend.exception.RoleMismatchException;
import com.platemate.backend.exception.UserNotFoundException;
import com.platemate.backend.repository.OrganizationRepository;
import com.platemate.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrganizationService(
            OrganizationRepository organizationRepository,
            UserRepository userRepository) {

        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    public Organization createOrganization(
            CreateOrganizationRequest request) {

        User owner = userRepository.findById(
                request.getOwnerId())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                request.getOwnerId()));

        if (organizationRepository.existsByNameAndOwner_Id(
                request.getName(),
                owner.getId())) {

            throw new OrganizationAlreadyExistsException(
                    request.getName());
        }

        validateRole(owner.getRole(), request.getType());

        Organization organization = new Organization();

        organization.setName(request.getName());
        organization.setType(request.getType());
        organization.setAddress(request.getAddress());
        organization.setCity(request.getCity());
        organization.setState(request.getState());
        organization.setContactNumber(
                request.getContactNumber());

        organization.setVerificationStatus(
        VerificationStatus.PENDING
);

        organization.setOwner(owner);

        return organizationRepository.save(
                organization);
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    private void validateRole(
            UserRole role,
            OrganizationType type) {

        if (role == UserRole.PROVIDER) {

            if (type == OrganizationType.NGO
                    || type == OrganizationType.FOOD_BANK
                    || type == OrganizationType.ORPHANAGE
                    || type == OrganizationType.SHELTER_HOME
                    || type == OrganizationType.COMMUNITY_KITCHEN) {

                throw new RoleMismatchException(
                        "Provider users cannot create receiver organizations");
            }
        }

        if (role == UserRole.RECEIVER) {

            if (type == OrganizationType.RESTAURANT
                    || type == OrganizationType.BAKERY
                    || type == OrganizationType.HOTEL
                    || type == OrganizationType.SUPERMARKET
                    || type == OrganizationType.WEDDING_VENUE
                    || type == OrganizationType.CORPORATE_CAFETERIA
                    || type == OrganizationType.COLLEGE_MESS) {

                throw new RoleMismatchException(
                        "Receiver users cannot create provider organizations");
            }
        }
    }
}
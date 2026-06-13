package com.platemate.backend.entity;

import com.platemate.backend.enums.OrganizationType;
import com.platemate.backend.enums.VerificationStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "organizations")
@Getter
@Setter
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private OrganizationType type;

    private String address;

    private String city;

    private String state;

    private String contactNumber;

    @Enumerated(EnumType.STRING)
private VerificationStatus verificationStatus;

    private Double latitude;

private Double longitude;

private Integer dailyCapacity;

private Integer currentLoad;

private Double trustScore;

    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private User owner;

    @PrePersist
public void prePersist() {

    if (verificationStatus == null) {
        verificationStatus = VerificationStatus.PENDING;
    }

    if (currentLoad == null) {
        currentLoad = 0;
    }

    if (trustScore == null) {
        trustScore = 50.0;
    }
}
}
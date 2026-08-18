package com.platemate.backend.entity;

import com.platemate.backend.enums.OrganizationType;
import com.platemate.backend.enums.VerificationStatus;

import jakarta.persistence.*;


@Entity
@Table(name = "organizations")

public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public OrganizationType getType() {
        return type;
    }

    public void setType(OrganizationType type) {
        this.type = type;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getDailyCapacity() {
        return dailyCapacity;
    }

    public void setDailyCapacity(Integer dailyCapacity) {
        this.dailyCapacity = dailyCapacity;
    }

    public Integer getCurrentLoad() {
        return currentLoad;
    }

    public void setCurrentLoad(Integer currentLoad) {
        this.currentLoad = currentLoad;
    }

    public Double getTrustScore() {
        return trustScore;
    }

    public void setTrustScore(Double trustScore) {
        this.trustScore = trustScore;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

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
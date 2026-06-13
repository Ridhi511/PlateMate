package com.platemate.backend.dto;

public class MatchedOrganizationResponse {

    private Long id;
    private String name;
    private Double score;

    public MatchedOrganizationResponse(
            Long id,
            String name,
            Double score) {

        this.id = id;
        this.name = name;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getScore() {
        return score;
    }
}
package com.BackEnd.MrRoot.Dto;

import java.math.BigDecimal;
import java.util.Map;

public class DistanceResponse {

    private Map<String, Double> shortest;

    public DistanceResponse(Map<String, Double> shortest) {
        this.shortest = shortest;
    }

    public Map<String, Double> getShortest() {
        return shortest;
    }
}

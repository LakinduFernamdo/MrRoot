package com.BackEnd.MrRoot.Model;

import lombok.Getter;
import lombok.Setter;


public class DistancePair {

    private String from;
    private String to;
    private double weight;


    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

}

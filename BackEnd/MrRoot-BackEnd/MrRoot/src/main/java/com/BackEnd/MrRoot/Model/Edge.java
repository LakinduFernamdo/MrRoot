package com.BackEnd.MrRoot.Model;



public class Edge {

    public int to;
    public double weight;

    public Edge(int to, double weight) {
        this.to = to;
        this.weight = weight;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}

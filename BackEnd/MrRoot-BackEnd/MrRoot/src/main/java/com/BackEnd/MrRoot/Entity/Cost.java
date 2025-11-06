package com.BackEnd.MrRoot.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="rootcost")
public class Cost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer Id;

    @Column(name = "place")
    private Integer place;

    @Column(name = "cost")
    private Integer cost;

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public Integer getPlace() {
        return place;
    }

    public void setPlace(Integer place) {
        this.place = place;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }
}

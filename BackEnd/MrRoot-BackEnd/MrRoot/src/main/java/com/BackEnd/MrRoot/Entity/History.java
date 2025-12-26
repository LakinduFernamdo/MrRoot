package com.BackEnd.MrRoot.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="rootHistory")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long Id;

    @Column(name = "start_place")
    private String StartNode;

    @Column(name = "end_place")
    private String EndNode;

    @Column(name = "time")
    private LocalTime time;

    @Column(name = "Date")
    private LocalDate date;

    @Column(name="Email")
    private String email;

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getStartNode() {
        return StartNode;
    }

    public void setStartNode(String startNode) {
        StartNode = startNode;
    }

    public String getEndNode() {
        return EndNode;
    }

    public void setEndNode(String endNode) {
        EndNode = endNode;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

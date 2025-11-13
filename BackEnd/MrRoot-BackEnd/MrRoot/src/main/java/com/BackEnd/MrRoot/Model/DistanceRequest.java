package com.BackEnd.MrRoot.Model;

//Request model describing frontend payload

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class DistanceRequest {



    private List<String> nodes;           //this store [colombo,Panadura,Hirana]
    private List<DistancePair> distances;  //This store [{from,to,weight}] data


    public List<String> getNodes() {
        return nodes;
    }

    public void setNodes(List<String> nodes) {
        this.nodes = nodes;
    }

    public List<DistancePair> getDistances() {
        return distances;
    }

    public void setDistances(List<DistancePair> distances) {
        this.distances = distances;
    }
}

/*
The basic purpose of this class is getting front payload which looks like this
{
  "nodes": ["A","B","C","D"],
  "distances": [
    {"from":"A","to":"C","weight":20.5},
    {"from":"C","to":"D","weight":11.2}
  ]
}

*/
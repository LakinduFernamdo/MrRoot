package com.BackEnd.MrRoot.Model;

//Request model describing frontend payload

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class DistanceRequest {



    private List<String> nodes;           //this store [colombo,Panadura,Hirana]
    private List<DistancePair> distances;  //This store [from,to,weight] data

}

/*
The basic purpose of this class is getting front payload wich looks like this
{
  "nodes": ["A","B","C","D"],
  "distances": [
    {"from":"A","to":"C","weight":20.5},
    {"from":"C","to":"D","weight":11.2}
  ]
}

*/
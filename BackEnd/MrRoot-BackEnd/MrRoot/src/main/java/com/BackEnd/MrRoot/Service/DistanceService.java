package com.BackEnd.MrRoot.Service;


import com.BackEnd.MrRoot.Config.OAuth2SuccessHandler;
import com.BackEnd.MrRoot.Entity.History;
import com.BackEnd.MrRoot.Model.DistanceRequest;
import com.BackEnd.MrRoot.Model.Graph;
import com.BackEnd.MrRoot.Repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

//returns a map key=place name and value the shortest distance with inputs as nodes+distances and start node
@Service
public class DistanceService {

    @Autowired
    private HistoryRepository historyRepo;
    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    public Map<String, Double> calculate(DistanceRequest req, String startNode,String email) {

        int n = req.getNodes().size();
        Graph graph = new Graph(n);

        //req.getDistances() is list of ex:[{from:"You", to:"Dehiwala", weight:8},{from:"Dehiwala", to:"Moratuwa", weight:6}]
        //req.getNodes() =  ["You", "Dehiwala", "Moratuwa", "Panadura"]
        req.getDistances().forEach(p -> {
            int from = req.getNodes().indexOf(p.getFrom()); //req.getNodes().indexOf("You")=0
            int to = req.getNodes().indexOf(p.getTo());     //int to   = req.getNodes().indexOf("Dehiwala")=1
            if (from >= 0 && to >= 0) { //Both from and to exist in the nodes list and cant be - values
                graph.addEdge(from, to, p.getWeight());//graph.addEdge(0, 1, 8);

            }
        });


        // save history part
        String endNode = req.getNodes()
                .get(req.getNodes().size() - 1);

        History history = new History();
        history.setStartNode(startNode);
        history.setEndNode(endNode);
        history.setDate(LocalDate.now());
        history.setTime(LocalTime.now());
        history.setEmail(email);

        historyRepo.save(history);

        return graph.dijkstraReturn(req.getNodes().indexOf(startNode), req.getNodes());
    }
}
/* Graph
0 -> []
1 -> []
2 -> []
3 -> []
4 -> []

*/
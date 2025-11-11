package com.BackEnd.MrRoot.Service;


import com.BackEnd.MrRoot.Model.DistanceRequest;
import com.BackEnd.MrRoot.Model.Graph;
import org.springframework.stereotype.Service;

import java.util.Map;

//Build graph
@Service
public class DistanceService {

    public Map<String, Double> calculate(DistanceRequest req, String startNode) {
        int n = req.getNodes().size();
        Graph graph = new Graph(n);

        // Add edges (double weights)
        req.getDistances().forEach(p -> {
            int from = req.getNodes().indexOf(p.from);
            int to = req.getNodes().indexOf(p.to);
            if (from >= 0 && to >= 0) {
                graph.addEdge(from, to, p.weight); // p.weight is double
            }
        });

        return graph.dijkstraReturn(req.getNodes().indexOf(startNode), req.getNodes());
    }
}

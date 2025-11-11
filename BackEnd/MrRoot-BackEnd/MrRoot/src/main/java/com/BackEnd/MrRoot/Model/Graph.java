package com.BackEnd.MrRoot.Model;

//Graph Modified to Return Map. The function should return Map.

import java.util.*;

public class Graph {

    private final int nodes;
    private final List<List<Edge>> adj;

    public Graph(int nodes) {
        this.nodes = nodes;
        this.adj = new ArrayList<>();
        for (int i = 0; i < nodes; i++) {
            adj.add(new ArrayList<>());
        }
    }

    // undirected edge
    public void addEdge(int from, int to, double weight) {
        adj.get(from).add(new Edge(to, weight));
        adj.get(to).add(new Edge(from, weight));
    }

    // Dijkstra - returns shortest distances as doubles, keyed by label names
    public Map<String, Double> dijkstraReturn(int start, List<String> labels) {
        double[] distance = new double[nodes];
        Arrays.fill(distance, Double.POSITIVE_INFINITY);
        distance[start] = 0.0;

        // priority queue of [nodeIndex, distance]
        PriorityQueue<double[]> pq = new PriorityQueue<>(Comparator.comparingDouble(a -> a[1]));
        pq.offer(new double[]{start, 0.0});

        while (!pq.isEmpty()) {
            double[] current = pq.poll();
            int node = (int) current[0];
            double dist = current[1];

            if (dist > distance[node]) continue;

            for (Edge edge : adj.get(node)) {
                double newDist = dist + edge.weight;
                if (newDist < distance[edge.to]) {
                    distance[edge.to] = newDist;
                    pq.offer(new double[]{edge.to, newDist});
                }
            }
        }

        Map<String, Double> result = new LinkedHashMap<>();
        for (int i = 0; i < nodes; i++) {
            double d = distance[i];
            // You may want to convert POSITIVE_INFINITY to some sentinel (e.g., -1 or null)
            result.put(labels.get(i), Double.isInfinite(d) ? null : d);
        }

        return result;
    }
}

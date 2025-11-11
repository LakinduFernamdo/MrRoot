package com.BackEnd.MrRoot.Controller;

import com.BackEnd.MrRoot.Dto.DistanceResponse;
import com.BackEnd.MrRoot.Model.DistanceRequest;
import com.BackEnd.MrRoot.Service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

//This control REST endpoints and frontend Inputs
@RestController
@RequestMapping("/api/distance")
public class DistanceController {


    @Autowired
    private final DistanceService distanceService;

    public DistanceController(DistanceService distanceService) {
        this.distanceService = distanceService;
    }

    @PostMapping("/graph")
    public DistanceResponse calculateShortest(@RequestBody DistanceRequest request,
                                              @RequestParam String start) {
        return new DistanceResponse(distanceService.calculate(request, start));
    }
}


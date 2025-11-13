package com.BackEnd.MrRoot.Controller;

import com.BackEnd.MrRoot.Dto.DistanceResponse;
import com.BackEnd.MrRoot.Model.DistanceRequest;
import com.BackEnd.MrRoot.Service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;


@RestController
@RequestMapping("/api/v1/distance")
public class DistanceController {

    @Autowired
    private  DistanceService distanceService;


    @PostMapping("/graph")
    public ResponseEntity<DistanceResponse> calculateShortest(
            @RequestBody DistanceRequest request,
            @RequestParam String start) {
        try {
            DistanceResponse response = new DistanceResponse(distanceService.calculate(request, start));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new DistanceResponse(Collections.emptyMap()));

        }
    }



}



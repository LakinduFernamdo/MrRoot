package com.BackEnd.MrRoot.Controller;

import com.BackEnd.MrRoot.Dto.DistanceResponse;
import com.BackEnd.MrRoot.Model.DistanceRequest;
import com.BackEnd.MrRoot.Service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
            @RequestParam String start,
            Authentication authentication
    ) {
        System.out.println("AUTH = " + authentication);

        if (authentication == null) {
            System.out.println("AUTH NULL");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println("EMAIL = " + authentication.getName());

        return ResponseEntity.ok(
                new DistanceResponse(
                        distanceService.calculate(request, start, authentication.getName())
                )
        );
    }

}



package com.BackEnd.MrRoot.Controller;

import com.BackEnd.MrRoot.Dto.HistoryDTO;
import com.BackEnd.MrRoot.Service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserHistoryController {

    @Autowired
    private HistoryService historyService;

    @GetMapping("/history")
    public ResponseEntity<List<HistoryDTO>> getUserHistory(Authentication authentication) {

        System.out.println("AUTH = " + authentication);

        if (authentication == null) {
            System.out.println("AUTH NULL");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName(); // from JWT subject
        System.out.println("Email is:"+ email);

        List<HistoryDTO> historyList = historyService.getUserHistory(email);

        return ResponseEntity.ok(historyList);
    }
}


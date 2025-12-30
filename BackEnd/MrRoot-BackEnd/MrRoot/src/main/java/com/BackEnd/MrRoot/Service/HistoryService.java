package com.BackEnd.MrRoot.Service;

import com.BackEnd.MrRoot.Dto.HistoryDTO;
import com.BackEnd.MrRoot.Entity.History;
import com.BackEnd.MrRoot.Repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    public List<HistoryDTO> getUserHistory(String email) {
          List<History> myHistory=historyRepository.findByEmail(email);
          return myHistory.stream().map(history -> {
              HistoryDTO historyDTO=new HistoryDTO();
              historyDTO.setFrom(history.getStartNode());
              historyDTO.setTo(history.getEndNode());
              historyDTO.setDate(history.getDate());
              historyDTO.setTime(history.getTime());
              historyDTO.setEmail(history.getEmail());
              return historyDTO;
          }).toList();

    }
}

package com.BackEnd.MrRoot.Repository;

import com.BackEnd.MrRoot.Entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HistoryRepository extends JpaRepository<History,Long> {
    List<History> findByEmail(String email);
}

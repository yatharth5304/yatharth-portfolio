package com.jsp.portfolio.repository;

import com.jsp.portfolio.entity.Stat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatRepository extends JpaRepository<Stat, Integer> {
    List<Stat> findAllByOrderByDisplayOrderAsc();
}

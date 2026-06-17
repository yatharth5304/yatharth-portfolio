package com.jsp.portfolio.repository;

import com.jsp.portfolio.entity.Principle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrincipleRepository extends JpaRepository<Principle, Integer> {
    List<Principle> findAllByOrderByDisplayOrderAsc();
}

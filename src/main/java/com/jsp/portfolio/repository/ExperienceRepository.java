package com.jsp.portfolio.repository;

import com.jsp.portfolio.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Integer> {
    List<Experience> findAllByOrderByDisplayOrderAsc();
}

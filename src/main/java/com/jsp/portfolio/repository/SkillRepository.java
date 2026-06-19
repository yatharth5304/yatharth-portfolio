package com.jsp.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jsp.portfolio.entity.Skill;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
    List<Skill> findAllByOrderByDisplayOrderAscIdAsc();
}

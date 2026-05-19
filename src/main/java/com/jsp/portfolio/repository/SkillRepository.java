package com.jsp.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jsp.portfolio.entity.Skill;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
}

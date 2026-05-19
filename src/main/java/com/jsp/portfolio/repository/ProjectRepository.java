package com.jsp.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jsp.portfolio.entity.Project;


public interface ProjectRepository 
        extends JpaRepository<Project, Integer> {
}

package com.jsp.portfolio.service;

import com.jsp.portfolio.entity.Experience;
import com.jsp.portfolio.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository repo;

    public ExperienceService(ExperienceRepository repo) {
        this.repo = repo;
    }

    public List<Experience> getAllExperiences() {
        return repo.findAllByOrderByDisplayOrderAsc();
    }
}

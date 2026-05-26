package com.jsp.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jsp.portfolio.entity.Project;
import com.jsp.portfolio.exception.ResourceNotFoundException;
import com.jsp.portfolio.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository repo;

    public ProjectService(ProjectRepository repo) {
        this.repo = repo;
    }

    // fetch all projects (for UI)
    public List<Project> getAllProjects() {
        List<Project> projects = repo.findAll();
        // Sort projects: those with a valid liveLink come first
        projects.sort((a, b) -> {
            boolean aLive = a.getLiveLink() != null && !a.getLiveLink().trim().isEmpty();
            boolean bLive = b.getLiveLink() != null && !b.getLiveLink().trim().isEmpty();
            return Boolean.compare(bLive, aLive);
        });
        return projects;
    }

    // save project (for admin panel)
    public void save(Project project) {
        repo.save(project);
    }

    // delete project (future use)
    public void deleteById(int id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Project not found for id=" + id);
        }
        repo.deleteById(id);
    }
}

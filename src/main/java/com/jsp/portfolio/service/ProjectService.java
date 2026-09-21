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

    // fetch all projects ordered by display_order (DB-backed, replaces in-memory liveLink sort)
    public List<Project> getAllProjects() {
        return repo.findAllByOrderByDisplayOrderAsc();
    }


// save project (for admin panel) - supports both create and partial update
    public void save(Project project) {
        project.setGithubLink(normalizeUrl(project.getGithubLink()));
        project.setLiveLink(normalizeUrl(project.getLiveLink()));

        if (project.getId() != 0) {
            Project existing = repo.findById(project.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found for id=" + project.getId()));
            mergeProjectFields(existing, project);
            repo.save(existing);
        } else {
            repo.save(project);
        }
    }

    private void mergeProjectFields(Project existing, Project incoming) {
        if (incoming.getTitle() != null) {
            existing.setTitle(incoming.getTitle());
        }
        if (incoming.getDescription() != null) {
            existing.setDescription(incoming.getDescription());
        }
        if (incoming.getTechnologies() != null) {
            existing.setTechnologies(incoming.getTechnologies());
        }
        if (incoming.getGithubLink() != null) {
            existing.setGithubLink(incoming.getGithubLink());
        }
        if (incoming.getLiveLink() != null) {
            existing.setLiveLink(incoming.getLiveLink());
        }
        // slug, problem, highlight, challenge, featured, displayOrder are preserved from existing
    }

    // delete project (future use)
    public void deleteById(int id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Project not found for id=" + id);
        }
        repo.deleteById(id);
    }

    private String normalizeUrl(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed;
        }

        return "https://" + trimmed;
    }
}

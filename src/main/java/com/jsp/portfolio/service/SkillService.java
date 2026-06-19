package com.jsp.portfolio.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.jsp.portfolio.entity.Skill;
import com.jsp.portfolio.exception.ResourceNotFoundException;
import com.jsp.portfolio.repository.SkillRepository;

@Service
public class SkillService {

    private final SkillRepository repo;

    public SkillService(SkillRepository repo) {
        this.repo = repo;
    }

    public List<Skill> getAllSkills() {
        return repo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    public void save(Skill skill) {
        repo.save(skill);
    }

    public void deleteById(int id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found for id=" + id);
        }
        repo.deleteById(id);
    }
}

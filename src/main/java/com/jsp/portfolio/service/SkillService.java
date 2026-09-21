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

    // save skill (for admin panel) - supports both create and partial update
    public void save(Skill skill) {
        if (skill.getId() != 0) {
            Skill existing = repo.findById(skill.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found for id=" + skill.getId()));
            mergeSkillFields(existing, skill);
            repo.save(existing);
        } else {
            repo.save(skill);
        }
    }

    private void mergeSkillFields(Skill existing, Skill incoming) {
        if (incoming.getName() != null) {
            existing.setName(incoming.getName());
        }
        if (incoming.getCategory() != null) {
            existing.setCategory(incoming.getCategory());
        }
        if (incoming.getRating() >= 1 && incoming.getRating() <= 5) {
            existing.setRating(incoming.getRating());
        }
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        // is_primary is preserved from existing
    }

    public void deleteById(int id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found for id=" + id);
        }
        repo.deleteById(id);
    }
}

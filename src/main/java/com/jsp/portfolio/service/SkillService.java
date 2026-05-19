package com.jsp.portfolio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jsp.portfolio.entity.Skill;
import com.jsp.portfolio.repository.SkillRepository;

@Service
public class SkillService {

    @Autowired
    private SkillRepository repo;

    public List<Skill> getAllSkills() {
        return repo.findAll();
    }

    public void save(Skill skill) {
        repo.save(skill);
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }
}

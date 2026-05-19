package com.jsp.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jsp.portfolio.entity.Project;
import com.jsp.portfolio.entity.Skill;
import com.jsp.portfolio.service.ProjectService;
import com.jsp.portfolio.service.SkillService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private SkillService skillService;

    @PostMapping("/addProject")
    public ResponseEntity<?> addProject(@RequestBody Project project) {
        projectService.save(project);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/addSkill")
    public ResponseEntity<?> addSkill(@RequestBody Skill skill) {
        skillService.save(skill);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteProject/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable int id) {
        projectService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteSkill/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable int id) {
        skillService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

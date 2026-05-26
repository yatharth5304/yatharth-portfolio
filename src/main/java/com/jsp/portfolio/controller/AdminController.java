package com.jsp.portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.Map;

import com.jsp.portfolio.entity.Project;
import com.jsp.portfolio.entity.Skill;
import com.jsp.portfolio.service.ProjectService;
import com.jsp.portfolio.service.SkillService;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

    private final ProjectService projectService;

    private final SkillService skillService;

    public AdminController(ProjectService projectService, SkillService skillService) {
        this.projectService = projectService;
        this.skillService = skillService;
    }

    @GetMapping("/csrf")
    public ResponseEntity<?> csrf(CsrfToken csrfToken) {
        return ResponseEntity.ok(Map.of(
                "token", csrfToken.getToken(),
                "headerName", csrfToken.getHeaderName(),
                "parameterName", csrfToken.getParameterName()
        ));
    }

    @PostMapping("/addProject")
    public ResponseEntity<?> addProject(@Valid @RequestBody Project project) {
        projectService.save(project);
        return ResponseEntity.ok(Map.of("message", "Project saved successfully"));
    }

    @PostMapping("/addSkill")
    public ResponseEntity<?> addSkill(@Valid @RequestBody Skill skill) {
        skillService.save(skill);
        return ResponseEntity.ok(Map.of("message", "Skill saved successfully"));
    }

    @DeleteMapping("/deleteProject/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable @Positive int id) {
        projectService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }

    @DeleteMapping("/deleteSkill/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable @Positive int id) {
        skillService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
    }
}

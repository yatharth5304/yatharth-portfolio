package com.jsp.portfolio.controller;

import java.io.IOException;
import java.util.List;

import com.jsp.portfolio.entity.Project;
import com.jsp.portfolio.entity.Skill;
import com.jsp.portfolio.service.ProjectService;
import com.jsp.portfolio.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class PageController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private SkillService skillService;

    @GetMapping("/api/projects")
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/api/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/resume")
    public void downloadResume(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=Yatharth_Maharwade_Resume.pdf"
        );

        ClassPathResource pdf = new ClassPathResource(
                "static/resume/Yatharth_Maharwade_Resume.pdf"
        );

        StreamUtils.copy(pdf.getInputStream(), response.getOutputStream());
    }
}

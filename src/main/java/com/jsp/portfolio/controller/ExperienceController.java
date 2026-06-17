package com.jsp.portfolio.controller;

import com.jsp.portfolio.entity.Experience;
import com.jsp.portfolio.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService service;

    public ExperienceController(ExperienceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Experience>> getAll() {
        return ResponseEntity.ok(service.getAllExperiences());
    }
}

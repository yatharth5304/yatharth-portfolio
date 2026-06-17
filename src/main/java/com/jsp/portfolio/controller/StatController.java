package com.jsp.portfolio.controller;

import com.jsp.portfolio.entity.Stat;
import com.jsp.portfolio.service.StatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatController {

    private final StatService service;

    public StatController(StatService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Stat>> getAll() {
        return ResponseEntity.ok(service.getAllStats());
    }
}

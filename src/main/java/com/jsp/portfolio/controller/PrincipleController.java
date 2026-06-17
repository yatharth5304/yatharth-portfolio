package com.jsp.portfolio.controller;

import com.jsp.portfolio.entity.Principle;
import com.jsp.portfolio.service.PrincipleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/principles")
public class PrincipleController {

    private final PrincipleService service;

    public PrincipleController(PrincipleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Principle>> getAll() {
        return ResponseEntity.ok(service.getAllPrinciples());
    }
}

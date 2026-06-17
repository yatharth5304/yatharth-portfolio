package com.jsp.portfolio.controller;

import com.jsp.portfolio.service.SiteConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class SiteConfigController {

    private final SiteConfigService service;

    public SiteConfigController(SiteConfigService service) {
        this.service = service;
    }

    // Returns all governed site_config entries as a flat key→value map.
    // Frontend uses this for hero text, about paragraphs, contact details, etc.
    @GetMapping
    public ResponseEntity<Map<String, String>> getAll() {
        return ResponseEntity.ok(service.getAllConfig());
    }
}

package com.jsp.portfolio.service;

import com.jsp.portfolio.repository.SiteConfigRepository;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class SiteConfigService {

    private final SiteConfigRepository repo;

    public SiteConfigService(SiteConfigRepository repo) {
        this.repo = repo;
    }

    // Returns all governed site_config keys as a flat map for API and template use.
    public Map<String, String> getAllConfig() {
        return repo.findAllAsMap();
    }

    public String get(String key) {
        return repo.findById(key)
                .map(c -> c.getValue())
                .orElse("");
    }
}

package com.jsp.portfolio.repository;

import com.jsp.portfolio.entity.SiteConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Map;
import java.util.stream.Collectors;

public interface SiteConfigRepository extends JpaRepository<SiteConfig, String> {

    // Convenience default: return all config as a flat key→value map
    default Map<String, String> findAllAsMap() {
        return findAll().stream()
                .collect(Collectors.toMap(SiteConfig::getKey, SiteConfig::getValue));
    }
}

package com.jsp.portfolio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
@Entity
@Table(name = "site_config")
public class SiteConfig {

    // Key is the primary key (governed allowlist of 16 keys, see V7 migration)
    @Id
    private String key;

    @Column(columnDefinition = "TEXT")
    private String value;

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}

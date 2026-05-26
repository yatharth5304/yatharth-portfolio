package com.jsp.portfolio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    @Size(max = 120)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @Size(max = 500)
    private String technologies;

    @Size(max = 512)
    @Pattern(regexp = "^(https?://.*)?$", message = "githubLink must be a valid HTTP/HTTPS URL")
    private String githubLink;

    @Size(max = 512)
    @Pattern(regexp = "^(https?://.*)?$", message = "liveLink must be a valid HTTP/HTTPS URL")
    private String liveLink;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTechnologies() {
		return technologies;
	}
	public void setTechnologies(String technologies) {
		this.technologies = technologies;
	}
	public String getGithubLink() {
		return githubLink;
	}
	public void setGithubLink(String githubLink) {
		this.githubLink = githubLink;
	}
	public String getLiveLink() {
		return liveLink;
	}
	public void setLiveLink(String liveLink) {
		this.liveLink = liveLink;
	}

    // getters & setters
}

package com.jsp.portfolio.entity;

import jakarta.persistence.Column;
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
	@Column(unique = true)
    private String slug;

    private String problem;

    private String highlight;

    private String challenge;

    private boolean featured;

    @Column(name = "display_order")
    private int displayOrder;

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
	public String getSlug() { return slug; }
	public void setSlug(String slug) { this.slug = slug; }
	public String getProblem() { return problem; }
	public void setProblem(String problem) { this.problem = problem; }
	public String getHighlight() { return highlight; }
	public void setHighlight(String highlight) { this.highlight = highlight; }
	public String getChallenge() { return challenge; }
	public void setChallenge(String challenge) { this.challenge = challenge; }
	public boolean isFeatured() { return featured; }
	public void setFeatured(boolean featured) { this.featured = featured; }
	public int getDisplayOrder() { return displayOrder; }
	public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}


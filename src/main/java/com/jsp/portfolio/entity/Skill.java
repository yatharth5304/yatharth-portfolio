package com.jsp.portfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    @Size(max = 80)
    private String name;

    @Min(1)
    @Max(5)
    private int rating;

    @NotBlank
    @Size(max = 80)
    private String category;

    @Column(name = "is_primary")
    private boolean primarySkill;

    @Column(name = "display_order")
    private Integer displayOrder;

    public boolean isPrimarySkill() { return primarySkill; }
    public void setPrimarySkill(boolean primarySkill) { this.primarySkill = primarySkill; }

    public int getDisplayOrder() { return displayOrder != null ? displayOrder : 0; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
}

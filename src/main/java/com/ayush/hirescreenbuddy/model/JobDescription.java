package com.ayush.hirescreenbuddy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * JobDescription Entity - Represents a job posting to screen resumes against.
 * Contains job details and required skills for screening.
 */
@Data
@Entity
@Table(name = "job_descriptions")
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Job title (e.g., "Senior Java Developer") */
    private String title;

    /** Company name */
    private String company;

    /** Full job description and requirements */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Comma-separated required skills for the position */
    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    /** Job status: OPEN, CLOSED, or DRAFT */
    private String status = "OPEN";

    /** Job creation timestamp */
    private LocalDateTime createdAt = LocalDateTime.now();
}
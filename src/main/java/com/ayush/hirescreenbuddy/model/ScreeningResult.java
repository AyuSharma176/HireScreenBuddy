package com.ayush.hirescreenbuddy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * ScreeningResult Entity - Stores AI screening results for a resume against a job.
 * Contains matching scores and skill analysis.
 */
@Data
@Entity
@Table(name = "screening_results")
public class ScreeningResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Reference to the resume being screened */
    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;

    /** Reference to the job being screened against */
    @ManyToOne
    @JoinColumn(name = "job_id")
    private JobDescription job;

    /** AI-generated match score (0-100) - higher is better fit */
    private Integer score;

    /** Comma-separated list of skills found in resume that match job requirements */
    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    /** Comma-separated list of required skills missing from resume */
    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    /** AI-generated explanation of the match (2-3 sentences) */
    @Column(columnDefinition = "TEXT")
    private String aiExplanation;

    /** Timestamp when screening was completed */
    private LocalDateTime screenedAt = LocalDateTime.now();
}

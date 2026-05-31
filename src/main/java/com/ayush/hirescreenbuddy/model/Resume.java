package com.ayush.hirescreenbuddy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Resume Entity - Represents an uploaded resume document.
 * Stores resume file information and extracted text content.
 */
@Data
@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Name of the candidate who submitted the resume */
    private String candidateName;

    /** Candidate's email address */
    private String email;

    /** Original filename of the uploaded file */
    private String fileName;

    /** File path where the resume is stored on disk */
    private String filePath;

    /** Extracted text content from the resume for AI analysis */
    @Column(columnDefinition = "TEXT")
    private String extractedText;

    /** Timestamp when resume was uploaded */
    private LocalDateTime uploadedAt = LocalDateTime.now();
}

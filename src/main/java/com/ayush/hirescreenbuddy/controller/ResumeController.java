package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.Resume;
import com.ayush.hirescreenbuddy.service.ResumeService;
import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Resume Controller - Handles resume upload and retrieval.
 * Supports single and batch resume uploads with text extraction.
 */
@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Upload a single resume file (PDF or DOCX).
     * Automatically extracts text from the resume for AI screening.
     *
     * @param file Resume file to upload
     * @param candidateName Name of the candidate
     * @param email Email of the candidate
     * @return ResponseEntity with uploaded resume details
     * @throws IOException If file operations fail
     * @throws TikaException If text extraction fails
     */
    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("candidateName") String candidateName,
            @RequestParam("email") String email) throws IOException, TikaException {

        Resume resume = resumeService.uploadResume(file, candidateName, email);
        return ResponseEntity.ok(resume);
    }

    /**
     * Upload multiple resume files at once.
     * Batch processing for bulk resume uploads.
     *
     * @param files List of resume files
     * @param candidateNames List of candidate names
     * @param emails List of candidate emails
     * @return ResponseEntity with list of uploaded resumes
     * @throws IOException If file operations fail
     * @throws TikaException If text extraction fails
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<Resume>> uploadMultipleResumes(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("candidateNames") List<String> candidateNames,
            @RequestParam("emails") List<String> emails) throws IOException, TikaException {

        List<Resume> resumes = resumeService.uploadMultipleResumes(files, candidateNames, emails);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Retrieve all uploaded resumes.
     *
     * @return ResponseEntity with list of all resumes in the system
     */
    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    /**
     * Retrieve a specific resume by ID.
     *
     * @param id Resume ID
     * @return ResponseEntity with resume details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }
}
package com.ayush.hirescreenbuddy.service;

import com.ayush.hirescreenbuddy.model.Resume;
import com.ayush.hirescreenbuddy.nlp.TextExtractor;
import com.ayush.hirescreenbuddy.repository.ResumeRepository;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Resume Service - Business logic for resume management.
 * Handles file upload, text extraction, and resume CRUD operations.
 */
@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final TextExtractor textExtractor;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ResumeService(ResumeRepository resumeRepository, TextExtractor textExtractor) {
        this.resumeRepository = resumeRepository;
        this.textExtractor = textExtractor;
    }

    /**
     * Upload a single resume file with text extraction.
     * Creates directory if it doesn't exist and saves file with unique UUID.
     *
     * @param file Resume file (PDF or DOCX)
     * @param candidateName Name of candidate
     * @param email Candidate's email
     * @return Saved resume with extracted text
     * @throws IOException If file operations fail
     * @throws TikaException If text extraction fails
     */
    public Resume uploadResume(MultipartFile file, String candidateName, String email) throws IOException, TikaException {

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file with unique UUID to prevent naming conflicts
        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // Extract text from resume for AI screening
        String extractedText = textExtractor.extractText(file);

        // Save resume metadata and extracted text to database
        Resume resume = new Resume();
        resume.setCandidateName(candidateName);
        resume.setEmail(email);
        resume.setFileName(uniqueFileName);
        resume.setFilePath(filePath.toString());
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }

    /**
     * Upload multiple resume files at once.
     * Batch processing for bulk uploads.
     *
     * @param files List of resume files
     * @param names List of candidate names
     * @param emails List of candidate emails
     * @return List of saved resumes
     * @throws IOException If file operations fail
     * @throws TikaException If text extraction fails
     */
    public List<Resume> uploadMultipleResumes(List<MultipartFile> files, List<String> names, List<String> emails) throws IOException, TikaException {
        List<Resume> savedResumes = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String candidateName = i < names.size() ? names.get(i) : "Unknown";
            String email = i < emails.size() ? emails.get(i) : "";

            Resume resume = uploadResume(file, candidateName, email);
            savedResumes.add(resume);
        }

        return savedResumes;
    }

    /**
     * Retrieve all uploaded resumes.
     *
     * @return List of all resumes in system
     */
    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    /**
     * Retrieve a specific resume by ID.
     *
     * @param id Resume ID
     * @return Resume details
     * @throws RuntimeException If resume not found
     */
    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found with id: " + id));
    }
}
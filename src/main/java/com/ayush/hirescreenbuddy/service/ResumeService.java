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
import java.util.List;
import java.util.UUID;

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

    public Resume uploadResume(MultipartFile file, String candidateName, String email) throws IOException, TikaException {

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file with unique name
        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // Extract text from resume
        String extractedText = textExtractor.extractText(file);

        // Save to database
        Resume resume = new Resume();
        resume.setCandidateName(candidateName);
        resume.setEmail(email);
        resume.setFileName(uniqueFileName);
        resume.setFilePath(filePath.toString());
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found with id: " + id));
    }
}
package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.Resume;
import com.ayush.hirescreenbuddy.service.ResumeService;
import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    // Upload a resume
    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("candidateName") String candidateName,
            @RequestParam("email") String email) throws IOException, TikaException {

        Resume resume = resumeService.uploadResume(file, candidateName, email);
        return ResponseEntity.ok(resume);
    }
    // Upload multiple resumes at once
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<Resume>> uploadMultipleResumes(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("candidateNames") List<String> candidateNames,
            @RequestParam("emails") List<String> emails) throws IOException, TikaException {

        List<Resume> resumes = resumeService.uploadMultipleResumes(files, candidateNames, emails);
        return ResponseEntity.ok(resumes);
    }
    // Get all resumes
    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    // Get resume by id
    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }
}
package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.ScreeningResult;
import com.ayush.hirescreenbuddy.service.ScreeningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Screening Controller - Manages AI-powered resume screening.
 * Runs screening for all resumes against a specific job and retrieves results.
 */
@RestController
@RequestMapping("/api/screen")
@CrossOrigin(origins = "*")
public class ScreeningController {

    private final ScreeningService screeningService;

    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    /**
     * Run AI screening on all resumes against a specific job.
     * Uses Groq AI to analyze each resume and generate a score.
     *
     * @param jobId Job ID to screen resumes against
     * @return ResponseEntity with list of screening results
     * @throws IOException If AI API call fails
     */
    @PostMapping("/{jobId}")
    public ResponseEntity<List<ScreeningResult>> screenResumes(
            @PathVariable Long jobId) throws IOException {
        return ResponseEntity.ok(screeningService.screenAllResumes(jobId));
    }

    /**
     * Retrieve screening results for a specific job.
     * Results are sorted by score in descending order.
     *
     * @param jobId Job ID to get results for
     * @return ResponseEntity with ranked screening results
     */
    @GetMapping("/{jobId}/results")
    public ResponseEntity<List<ScreeningResult>> getResults(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(screeningService.getResultsByJob(jobId));
    }
}
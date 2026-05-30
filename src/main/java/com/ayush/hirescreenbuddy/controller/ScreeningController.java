package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.ScreeningResult;
import com.ayush.hirescreenbuddy.service.ScreeningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/screen")
@CrossOrigin(origins = "*")
public class ScreeningController {

    private final ScreeningService screeningService;

    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    // Screen all resumes against a job
    @PostMapping("/{jobId}")
    public ResponseEntity<List<ScreeningResult>> screenResumes(
            @PathVariable Long jobId) throws IOException {
        return ResponseEntity.ok(screeningService.screenAllResumes(jobId));
    }

    // Get ranked results for a job
    @GetMapping("/{jobId}/results")
    public ResponseEntity<List<ScreeningResult>> getResults(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(screeningService.getResultsByJob(jobId));
    }
}
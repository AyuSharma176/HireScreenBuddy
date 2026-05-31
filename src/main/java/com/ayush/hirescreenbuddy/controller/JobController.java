package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.JobDescription;
import com.ayush.hirescreenbuddy.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Job Controller - Manages job descriptions for screening.
 * Provides endpoints to create, retrieve, and update job postings.
 */
@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * Create a new job description.
     *
     * @param job Job description details
     * @return ResponseEntity with created job
     */
    @PostMapping
    public ResponseEntity<JobDescription> createJob(@RequestBody JobDescription job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    /**
     * Retrieve all job descriptions.
     *
     * @return ResponseEntity with list of all jobs
     */
    @GetMapping
    public ResponseEntity<List<JobDescription>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    /**
     * Retrieve a specific job by ID.
     *
     * @param id Job ID
     * @return ResponseEntity with the job details
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobDescription> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    /**
     * Update job status (OPEN, CLOSED, or DRAFT).
     *
     * @param id Job ID
     * @param body Request body containing status field
     * @return ResponseEntity with updated job
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobDescription> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, body.get("status")));
    }
}
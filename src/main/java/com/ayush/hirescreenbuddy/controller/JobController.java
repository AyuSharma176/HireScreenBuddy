package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.JobDescription;
import com.ayush.hirescreenbuddy.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create a job description
    @PostMapping
    public ResponseEntity<JobDescription> createJob(@RequestBody JobDescription job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    // Get all jobs
    @GetMapping
    public ResponseEntity<List<JobDescription>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // Get job by id
    @GetMapping("/{id}")
    public ResponseEntity<JobDescription> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }
}
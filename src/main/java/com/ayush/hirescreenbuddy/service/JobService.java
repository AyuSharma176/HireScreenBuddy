package com.ayush.hirescreenbuddy.service;

import com.ayush.hirescreenbuddy.model.JobDescription;
import com.ayush.hirescreenbuddy.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Job Service - Business logic for job management.
 * Handles CRUD operations and status management for job descriptions.
 */
@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    /**
     * Create a new job with OPEN status.
     *
     * @param job Job description to create
     * @return Saved job with generated ID
     */
    public JobDescription createJob(JobDescription job) {
        job.setStatus("OPEN");
        return jobRepository.save(job);
    }

    /**
     * Retrieve all jobs in the system.
     *
     * @return List of all job descriptions
     */
    public List<JobDescription> getAllJobs() {
        return jobRepository.findAll();
    }

    /**
     * Retrieve a specific job by ID.
     *
     * @param id Job ID
     * @return Job description
     * @throws RuntimeException If job not found
     */
    public JobDescription getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    /**
     * Update job status with validation.
     * Valid statuses: OPEN, CLOSED, DRAFT
     *
     * @param id Job ID
     * @param status New status
     * @return Updated job
     * @throws RuntimeException If invalid status provided
     */
    public JobDescription updateJobStatus(Long id, String status) {
        JobDescription job = getJobById(id);

        // Validate status is one of the allowed values
        List<String> validStatuses = List.of("OPEN", "CLOSED", "DRAFT");
        if (!validStatuses.contains(status.toUpperCase())) {
            throw new RuntimeException("Invalid status. Must be OPEN, CLOSED or DRAFT");
        }

        job.setStatus(status.toUpperCase());
        return jobRepository.save(job);
    }
}
package com.ayush.hirescreenbuddy.service;

import com.ayush.hirescreenbuddy.model.JobDescription;
import com.ayush.hirescreenbuddy.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public JobDescription createJob(JobDescription job) {
        job.setStatus("OPEN");
        return jobRepository.save(job);
    }

    public List<JobDescription> getAllJobs() {
        return jobRepository.findAll();
    }

    public JobDescription getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    // ADD THIS
    public JobDescription updateJobStatus(Long id, String status) {
        JobDescription job = getJobById(id);

        List<String> validStatuses = List.of("OPEN", "CLOSED", "DRAFT");
        if (!validStatuses.contains(status.toUpperCase())) {
            throw new RuntimeException("Invalid status. Must be OPEN, CLOSED or DRAFT");
        }

        job.setStatus(status.toUpperCase());
        return jobRepository.save(job);
    }
}
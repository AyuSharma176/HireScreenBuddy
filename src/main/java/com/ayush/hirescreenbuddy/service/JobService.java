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
        return jobRepository.save(job);
    }

    public List<JobDescription> getAllJobs() {
        return jobRepository.findAll();
    }

    public JobDescription getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }
}
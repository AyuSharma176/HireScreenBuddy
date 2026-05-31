package com.ayush.hirescreenbuddy.service;

import com.ayush.hirescreenbuddy.model.JobDescription;
import com.ayush.hirescreenbuddy.model.Resume;
import com.ayush.hirescreenbuddy.model.ScreeningResult;
import com.ayush.hirescreenbuddy.nlp.AIScorer;
import com.ayush.hirescreenbuddy.repository.ResumeRepository;
import com.ayush.hirescreenbuddy.repository.ScreeningResultRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Screening Service - Business logic for AI-powered resume screening.
 * Orchestrates resume evaluation against job descriptions using AI scoring.
 */
@Service
public class ScreeningService {

    private final ResumeRepository resumeRepository;
    private final ScreeningResultRepository screeningResultRepository;
    private final JobService jobService;
    private final AIScorer aiScorer;

    public ScreeningService(ResumeRepository resumeRepository,
                            ScreeningResultRepository screeningResultRepository,
                            JobService jobService,
                            AIScorer aiScorer) {
        this.resumeRepository = resumeRepository;
        this.screeningResultRepository = screeningResultRepository;
        this.jobService = jobService;
        this.aiScorer = aiScorer;
    }

    /**
     * Run AI screening on all resumes against a specific job.
     * Uses Groq AI API to analyze each resume and generate matches.
     *
     * @param jobId Job ID to screen resumes against
     * @return List of screening results sorted by score
     * @throws IOException If AI API call fails
     */
    public List<ScreeningResult> screenAllResumes(Long jobId) throws IOException {
        // Fetch job description and all resumes
        JobDescription job = jobService.getJobById(jobId);
        List<Resume> allResumes = resumeRepository.findAll();
        List<ScreeningResult> results = new ArrayList<>();

        // Score each resume against the job
        for (Resume resume : allResumes) {
            // Call Groq AI to score resume
            AIScorer.ScoringResult scoring = aiScorer.scoreResume(
                    resume.getExtractedText(),
                    job.getDescription()
            );

            // Create and save screening result
            ScreeningResult result = new ScreeningResult();
            result.setResume(resume);
            result.setJob(job);
            result.setScore(scoring.getScore());
            result.setMatchedSkills(scoring.getMatchedSkills());
            result.setMissingSkills(scoring.getMissingSkills());
            result.setAiExplanation(scoring.getExplanation());

            results.add(screeningResultRepository.save(result));
        }

        return results;
    }

    /**
     * Retrieve screening results for a specific job.
     * Results are automatically sorted by score in descending order.
     *
     * @param jobId Job ID to get results for
     * @return List of screening results ranked by score
     */
    public List<ScreeningResult> getResultsByJob(Long jobId) {
        JobDescription job = jobService.getJobById(jobId);
        return screeningResultRepository.findByJobOrderByScoreDesc(job);
    }
}
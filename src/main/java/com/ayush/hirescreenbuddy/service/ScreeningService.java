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

    public List<ScreeningResult> screenAllResumes(Long jobId) throws IOException {
        JobDescription job = jobService.getJobById(jobId);
        List<Resume> allResumes = resumeRepository.findAll();
        List<ScreeningResult> results = new ArrayList<>();

        for (Resume resume : allResumes) {
            // Score each resume against the job
            AIScorer.ScoringResult scoring = aiScorer.scoreResume(
                    resume.getExtractedText(),
                    job.getDescription()
            );

            // Save result
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

    public List<ScreeningResult> getResultsByJob(Long jobId) {
        JobDescription job = jobService.getJobById(jobId);
        return screeningResultRepository.findByJobOrderByScoreDesc(job);
    }
}
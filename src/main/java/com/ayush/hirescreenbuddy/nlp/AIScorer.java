package com.ayush.hirescreenbuddy.nlp;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * AI Scorer - Uses Groq AI API to score resumes against job descriptions.
 * Leverages LLM to analyze candidate fit and extract skill matches.
 */
@Component
public class AIScorer {

    @Value("${app.ai.api-key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Change API URL
    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final MediaType JSON = MediaType.get("application/json");

    /**
     * Score a resume against a job description using AI.
     * Returns match score (0-100), matched skills, missing skills, and explanation.
     *
     * @param resumeText Extracted resume content
     * @param jobDescription Job posting description
     * @return ScoringResult with score and analysis
     * @throws IOException If API call fails
     */
    public ScoringResult scoreResume(String resumeText, String jobDescription) throws IOException {

        String prompt = buildPrompt(resumeText, jobDescription);
        String requestBody = buildRequestBody(prompt);

        // Build and send API request
        Request request = new Request.Builder()
                .url(API_URL)
                .post(RequestBody.create(requestBody, JSON))
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                throw new IOException("AI API call failed: " + response.code());
            }
            return parseResponse(responseBody);
        }
    }

    /**
     * Build the prompt for the AI model.
     * Instructs the AI on how to analyze resume vs job.
     *
     * @param resumeText Resume content
     * @param jobDescription Job description
     * @return Formatted prompt string
     */
    private String buildPrompt(String resumeText, String jobDescription) {
        return """
                You are an expert HR recruiter and resume screener.
                
                Analyze the resume against the job description and respond ONLY in this exact JSON format:
                {
                  "score": <number 0-100>,
                  "matchedSkills": "<comma separated matched skills>",
                  "missingSkills": "<comma separated missing skills>",
                  "explanation": "<2-3 sentence summary of candidate fit>"
                }
                
                JOB DESCRIPTION:
                %s
                
                RESUME:
                %s
                
                Respond with JSON only. No extra text.
                """.formatted(jobDescription, resumeText);
    }

    /**
     * Build the request body for Groq API.
     * Configures model, temperature, and system prompt.
     *
     * @param prompt User prompt for analysis
     * @return JSON request body
     * @throws IOException If JSON serialization fails
     */
    private String buildRequestBody(String prompt) throws IOException {
        return objectMapper.writeValueAsString(
                objectMapper.createObjectNode()
                        .put("model", "llama-3.3-70b-versatile")
                        .put("max_completion_tokens", 1024)
                        .put("temperature", 0.1)  // Low temperature for consistent results
                        .set("messages", objectMapper.createArrayNode()
                                .add(objectMapper.createObjectNode()
                                        .put("role", "system")
                                        .put("content", "You are an expert HR recruiter. Always respond with valid JSON only. No extra text, no markdown, no code blocks."))
                                .add(objectMapper.createObjectNode()
                                        .put("role", "user")
                                        .put("content", prompt)))
        );
    }

    /**
     * Parse the AI response and extract scoring details.
     * Handles JSON escaping and markdown code blocks.
     *
     * @param responseBody API response from Groq
     * @return ScoringResult with parsed values
     * @throws IOException If JSON parsing fails
     */
    private ScoringResult parseResponse(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        String content = root
                .path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();

        // Clean up in case AI wraps response in ```json ... ```
        content = content.trim();
        if (content.startsWith("```")) {
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
        }

        JsonNode result = objectMapper.readTree(content);

        // Extract scoring details from JSON response
        ScoringResult scoringResult = new ScoringResult();
        scoringResult.setScore(result.path("score").asInt());
        scoringResult.setMatchedSkills(result.path("matchedSkills").asText());
        scoringResult.setMissingSkills(result.path("missingSkills").asText());
        scoringResult.setExplanation(result.path("explanation").asText());

        return scoringResult;
    }

    /**
     * Inner class to hold AI scoring results.
     */
    public static class ScoringResult {
        private int score;
        private String matchedSkills;
        private String missingSkills;
        private String explanation;

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }

        public String getMatchedSkills() { return matchedSkills; }
        public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }

        public String getMissingSkills() { return missingSkills; }
        public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
}
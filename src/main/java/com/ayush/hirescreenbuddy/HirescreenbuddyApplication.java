package com.ayush.hirescreenbuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the HireScreenBuddy Spring Boot application.
 * This is an AI-powered resume screening system that helps recruiters
 * automatically screen job applications using NLP and AI.
 */
@SpringBootApplication
public class HirescreenbuddyApplication {

    /**
     * Entry point for the application.
     * Starts the Spring Boot framework and initializes all components.
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(HirescreenbuddyApplication.class, args);
    }

}

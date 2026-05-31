package com.ayush.hirescreenbuddy.security;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger Configuration - Configures OpenAPI/Swagger documentation.
 * Sets up API info and JWT authentication scheme for Swagger UI.
 */
@Configuration
public class SwaggerConfig {

    /**
     * Create OpenAPI configuration bean.
     * Defines API title, version, and JWT security scheme.
     *
     * @return Configured OpenAPI object
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                // Set API metadata
                .info(new Info()
                        .title("HireScreenBuddy API")
                        .version("1.0")
                        .description("AI-Powered Resume Screening System"))
                // Add JWT security requirement to all endpoints
                .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
                // Define JWT authentication scheme
                .components(new Components()
                        .addSecuritySchemes("Bearer Auth",
                                new SecurityScheme()
                                        .name("Bearer Auth")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
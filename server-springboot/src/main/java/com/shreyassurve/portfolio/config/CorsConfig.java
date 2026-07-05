package com.shreyassurve.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Allows the deployed React client (a different origin in production) to call
 * this API. In local dev with Vite's proxy this doesn't matter much, but it's
 * required once client and server are deployed separately.
 */
@Configuration
public class CorsConfig {

    // Comma-separated list, e.g. "https://shreyas-portfolio.vercel.app".
    // Defaults to "*" (allow all) for easy local development.
    @Value("${app.cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        String[] origins = allowedOrigins.split(",");
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(origins)
                        .allowedMethods("GET", "POST", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}

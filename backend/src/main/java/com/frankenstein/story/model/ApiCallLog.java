package com.frankenstein.story.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Model for tracking API calls and costs
 * 
 * @author alarinel@gmail.com
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiCallLog {
    private String id;
    private String storyId;
    private String apiProvider; // ANTHROPIC, STABILITY_AI, ELEVENLABS
    private String operation; // STORY_GENERATION, IMAGE_GENERATION, AUDIO_GENERATION
    private int tokensUsed;
    private double costUsd;
    private String status; // SUCCESS, FAILED, PARTIAL
    private String errorMessage;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    private long durationMs;
    private String metadata; // JSON string for additional info
}

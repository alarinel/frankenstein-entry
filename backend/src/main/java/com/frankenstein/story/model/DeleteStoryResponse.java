package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for story deletion operations.
 * Provides confirmation and details about the deletion result.
 * 
 * @author alarinel@gmail.com
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteStoryResponse {
    
    private boolean success;
    private String message;
    private String storyId;
}

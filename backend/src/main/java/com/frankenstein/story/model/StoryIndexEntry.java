package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a story entry in the story index.
 * Contains minimal metadata for displaying stories in the library.
 * 
 * @author alarinel@gmail.com
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryIndexEntry {
    
    private String id;
    private String title;
    private LocalDateTime createdAt;
}

package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Story {

    private String id;
    private String title;
    private StoryInput input;
    private List<StoryPage> pages;
    private StoryMetadata metadata;
    private StoryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String errorMessage;
}

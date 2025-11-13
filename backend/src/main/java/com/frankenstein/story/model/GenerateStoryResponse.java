package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateStoryResponse {

    private String storyId;
    private StoryStatus status;
    private String message;
}

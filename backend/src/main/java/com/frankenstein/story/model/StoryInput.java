package com.frankenstein.story.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryInput {

    @NotBlank(message = "Character name is required")
    @Size(min = 1, max = 50, message = "Character name must be between 1 and 50 characters")
    private String characterName;

    @NotBlank(message = "Setting is required")
    @Size(min = 1, max = 100, message = "Setting must be between 1 and 100 characters")
    private String setting;

    @NotBlank(message = "Villain is required")
    @Size(min = 1, max = 50, message = "Villain must be between 1 and 50 characters")
    private String villain;

    @NotBlank(message = "Special item is required")
    @Size(min = 1, max = 50, message = "Special item must be between 1 and 50 characters")
    private String specialItem;

    @NotBlank(message = "Character trait is required")
    @Size(min = 1, max = 50, message = "Character trait must be between 1 and 50 characters")
    private String characterTrait;

    @NotBlank(message = "Goal is required")
    @Size(min = 1, max = 100, message = "Goal must be between 1 and 100 characters")
    private String goal;

    @NotBlank(message = "Time period is required")
    @Size(min = 1, max = 50, message = "Time period must be between 1 and 50 characters")
    private String timePeriod;

    @NotBlank(message = "Mood is required")
    @Size(min = 1, max = 50, message = "Mood must be between 1 and 50 characters")
    private String mood;
}

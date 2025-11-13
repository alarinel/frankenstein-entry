package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryPage {

    private int pageNumber;
    private String text;
    private String imagePrompt;
    private String imageUrl;
    private String narrationUrl;
    private List<String> soundEffects;
    private List<String> soundEffectUrls;
    private String mood;
    private double duration; // in seconds
}

package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerationProgress {

   private String storyId;
   private StoryStatus status;
   private int progressPercentage; // 0-100
   private String stage; // Human-readable stage description
   private String message; // Detailed message
}

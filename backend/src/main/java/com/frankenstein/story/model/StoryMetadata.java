package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryMetadata {

   private int imageSeed;
   private double totalDuration; // in seconds
   private int pageCount;
   private String estimatedReadTime; // e.g., "3:45"
}

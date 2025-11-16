package com.frankenstein.story.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Structure returned by Claude for the story generation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryStructure {

   private String title;

   @JsonProperty("imageSeed")
   private int imageSeed;

   private List<PageStructure> pages;

   @Data
   @Builder
   @NoArgsConstructor
   @AllArgsConstructor
   public static class PageStructure {
      private int pageNumber;
      private String text;
      private String imagePrompt;
      private String backgroundMusic; // scary, action, awesome, or journey
      private String mood;
   }
}

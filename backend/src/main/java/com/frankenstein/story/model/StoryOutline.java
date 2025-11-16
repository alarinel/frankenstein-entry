package com.frankenstein.story.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Story outline structure generated in Phase 1 of story generation
 *
 * @author alarinel@gmail.com
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryOutline {

   private String title;
   private String theme;

   @JsonProperty("targetPages")
   private int targetPages;

   private BeginningSection beginning;
   private MiddleSection middle;
   private EndSection end;
   private List<CharacterProfile> characters;

   @JsonProperty("narrativeArc")
   private String narrativeArc;

   @JsonProperty("imageSeed")
   private int imageSeed;

   /**
    * Beginning section of the story (2-3 pages)
    */
   @Data
   @Builder
   @NoArgsConstructor
   @AllArgsConstructor
   public static class BeginningSection {
      private String summary;

      @JsonProperty("keyEvents")
      private List<String> keyEvents;

      @JsonProperty("pageCount")
      private int pageCount;
   }

   /**
    * Middle section of the story (6-9 pages)
    */
   @Data
   @Builder
   @NoArgsConstructor
   @AllArgsConstructor
   public static class MiddleSection {
      private String summary;

      @JsonProperty("keyEvents")
      private List<String> keyEvents;

      private String conflict;

      @JsonProperty("pageCount")
      private int pageCount;
   }

   /**
    * End section of the story (2-3 pages)
    */
   @Data
   @Builder
   @NoArgsConstructor
   @AllArgsConstructor
   public static class EndSection {
      private String summary;

      @JsonProperty("keyEvents")
      private List<String> keyEvents;

      private String resolution;

      @JsonProperty("pageCount")
      private int pageCount;
   }

   /**
    * Character profile in the story
    */
   @Data
   @Builder
   @NoArgsConstructor
   @AllArgsConstructor
   public static class CharacterProfile {
      private String name;
      private String role; // "protagonist", "antagonist", "supporting"
      private String appearance;
      private String personality;
   }
}

package com.frankenstein.story.controller;

import com.frankenstein.story.model.DeleteStoryResponse;
import com.frankenstein.story.model.GenerateStoryResponse;
import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryIndexEntry;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStatus;
import com.frankenstein.story.service.StoryIndexService;
import com.frankenstein.story.service.StoryOrchestrationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/stories")
public class StoryController {

   private final StoryOrchestrationService orchestrationService;
   private final StoryIndexService storyIndexService;

   public StoryController(final StoryOrchestrationService orchestrationService,
                          final StoryIndexService storyIndexService) {
      this.orchestrationService = orchestrationService;
      this.storyIndexService = storyIndexService;
   }

   @PostMapping("/generate")
   public ResponseEntity<GenerateStoryResponse> generateStory(@Valid @RequestBody final StoryInput input) {
      log.info("Received story generation request for character: {}", input.getCharacterName());

      final String storyId = orchestrationService.initiateStoryGeneration(input);

      // Start async generation
      orchestrationService.generateStoryAsync(storyId);

      final GenerateStoryResponse response = GenerateStoryResponse.builder()
                                                                  .storyId(storyId)
                                                                  .status(StoryStatus.PENDING)
                                                                  .message("Story generation started")
                                                                  .build();

      return ResponseEntity.accepted().body(response);
   }

   @GetMapping("/{storyId}")
   public ResponseEntity<Story> getStory(@PathVariable final String storyId) {
      log.debug("Fetching story: {}", storyId);
      final Story story = orchestrationService.getStory(storyId);
      return ResponseEntity.ok(story);
   }

   @GetMapping("/{storyId}/status")
   public ResponseEntity<StoryStatusResponse> getStoryStatus(@PathVariable final String storyId) {
      log.debug("Fetching story status: {}", storyId);
      final Story story = orchestrationService.getStory(storyId);

      final StoryStatusResponse response = StoryStatusResponse.builder()
                                                              .storyId(storyId)
                                                              .status(story.getStatus())
                                                              .progress(calculateProgress(story.getStatus()))
                                                              .build();

      return ResponseEntity.ok(response);
   }

   @GetMapping("/list")
   public ResponseEntity<List<StoryIndexEntry>> getStoryList() {
      try {
         log.debug("Fetching story list from index");
         final List<StoryIndexEntry> stories = storyIndexService.getAllStories();
         return ResponseEntity.ok(stories);
      } catch (Exception e) {
         log.error("Failed to retrieve story list", e);
         return ResponseEntity.internalServerError().build();
      }
   }

   @GetMapping
   public ResponseEntity<List<Story>> getAllStories() {
      log.debug("Fetching all stories");
      final List<Story> stories = orchestrationService.getAllStories();
      return ResponseEntity.ok(stories);
   }

   @DeleteMapping("/{storyId}")
   public ResponseEntity<DeleteStoryResponse> deleteStory(@PathVariable final String storyId) {
      try {
         log.info("Received delete request for story: {}", storyId);
         
         // Validate story exists
         if (!storyIndexService.storyExists(storyId)) {
            log.warn("Story not found: {}", storyId);
            final DeleteStoryResponse response = DeleteStoryResponse.builder()
                  .success(false)
                  .message("Story not found")
                  .storyId(storyId)
                  .build();
            return ResponseEntity.status(404).body(response);
         }
         
         // Delete story and its assets
         orchestrationService.deleteStoryWithAssets(storyId);
         
         log.info("Successfully deleted story: {}", storyId);
         final DeleteStoryResponse response = DeleteStoryResponse.builder()
               .success(true)
               .message("Story deleted successfully")
               .storyId(storyId)
               .build();
         
         return ResponseEntity.ok(response);
         
      } catch (Exception e) {
         log.error("Failed to delete story: {}", storyId, e);
         final DeleteStoryResponse response = DeleteStoryResponse.builder()
               .success(false)
               .message("Failed to delete story: " + e.getMessage())
               .storyId(storyId)
               .build();
         return ResponseEntity.internalServerError().body(response);
      }
   }

   private int calculateProgress(final StoryStatus status) {
      return switch (status) {
         case PENDING -> 0;
         case GENERATING_STORY -> 20;
         case GENERATING_IMAGES -> 50;
         case GENERATING_AUDIO -> 80;
         case ASSEMBLING -> 95;
         case COMPLETED -> 100;
         case FAILED -> 0;
      };
   }

   @lombok.Data
   @lombok.Builder
   @lombok.NoArgsConstructor
   @lombok.AllArgsConstructor
   public static class StoryStatusResponse {
      private String storyId;
      private StoryStatus status;
      private int progress;
   }
}

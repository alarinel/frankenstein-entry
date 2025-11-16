package com.frankenstein.story.service;

import com.frankenstein.story.exception.StoryGenerationException;
import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStatus;
import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.model.orchestration.AudioSet;
import com.frankenstein.story.service.orchestration.AudioOrchestrationService;
import com.frankenstein.story.service.orchestration.ImageOrchestrationService;
import com.frankenstein.story.service.orchestration.ProgressCoordinatorService;
import com.frankenstein.story.service.orchestration.StoryAssemblyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Orchestrates the entire story generation workflow
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StoryOrchestrationService {

   private final StoryGenerationService storyGenerationService;
   private final ImageOrchestrationService imageOrchestrationService;
   private final AudioOrchestrationService audioOrchestrationService;
   private final StoryAssemblyService storyAssemblyService;
   private final FileStorageService fileStorageService;
   private final ProgressCoordinatorService progressCoordinator;

   // In-memory storage for story status
   private final ConcurrentHashMap<String, Story> activeStories = new ConcurrentHashMap<>();

   public String initiateStoryGeneration(final StoryInput input) {
      final String storyId = UUID.randomUUID().toString();

      final Story story = Story.builder().id(storyId).input(input).status(StoryStatus.PENDING).createdAt(LocalDateTime.now()).build();

      activeStories.put(storyId, story);
      fileStorageService.createStoryDirectories(storyId);

      log.info("Initiated story generation: {}", storyId);
      return storyId;
   }

   @Async("storyGenerationExecutor")
   public CompletableFuture<Story> generateStoryAsync(final String storyId) {
      final Story story = activeStories.get(storyId);
      if (story == null) {
         return CompletableFuture.failedFuture(new StoryGenerationException("Story not found: " + storyId));
      }

      try {
         progressCoordinator.notifyStarted(storyId);

         // Phase 1: Generate story outline
         progressCoordinator.notifyGeneratingOutline(storyId);
         story.setStatus(StoryStatus.GENERATING_STORY);

         final com.frankenstein.story.model.StoryOutline outline;
         try {
            outline = storyGenerationService.generateOutline(storyId, story.getInput());
            log.info("Outline generation completed for story: {}", storyId);
         } catch (final Exception e) {
            log.error("Outline generation failed for story: {}", storyId, e);
            throw new StoryGenerationException("Failed to generate story outline: " + e.getMessage(), e);
         }

         // Phase 2: Generate full story from outline
         progressCoordinator.notifyGeneratingStory(storyId);

         final StoryStructure structure;
         try {
            structure = storyGenerationService.generateFullStory(storyId, story.getInput(), outline);
            story.setTitle(structure.getTitle());
            log.info("Full story generation completed for story: {}", storyId);
         } catch (final Exception e) {
            log.error("Full story generation failed for story: {}", storyId, e);
            throw new StoryGenerationException("Failed to generate full story: " + e.getMessage(), e);
         }

         progressCoordinator.notifyStoryComplete(storyId);

         // Step 3: Generate images in parallel
         story.setStatus(StoryStatus.GENERATING_IMAGES);
         final List<byte[]> images = imageOrchestrationService.generateAllImages(storyId, structure).join();

         progressCoordinator.notifyImagesComplete(storyId);

         // Step 4: Generate audio with throttling and selected voice type
         story.setStatus(StoryStatus.GENERATING_AUDIO);
         final String voiceType = story.getInput().getVoiceType();
         final List<AudioSet> audioSets = audioOrchestrationService.generateAllAudio(storyId, structure, voiceType).join();

         // Step 5: Assemble story
         progressCoordinator.notifyAssembling(storyId);
         story.setStatus(StoryStatus.ASSEMBLING);

         storyAssemblyService.assembleStory(story, structure, images, audioSets);

         // Step 6: Save and complete
         story.setStatus(StoryStatus.COMPLETED);
         story.setCompletedAt(LocalDateTime.now());

         fileStorageService.saveStoryMetadata(story);
         progressCoordinator.notifyComplete(storyId);

         log.info("Story generation completed: {}", storyId);
         return CompletableFuture.completedFuture(story);

      } catch (final Exception e) {
         log.error("Story generation failed for: {}", storyId, e);
         story.setStatus(StoryStatus.FAILED);
         story.setErrorMessage(e.getMessage());

         fileStorageService.saveStoryMetadata(story);
         progressCoordinator.notifyError(storyId, e.getMessage());

         return CompletableFuture.failedFuture(e);
      }
   }

   public Story getStory(final String storyId) {
      // Check active stories first
      final Story story = activeStories.get(storyId);
      if (story != null) {
         return story;
      }

      // Otherwise load from disk
      return fileStorageService.loadStory(storyId);
   }

   public List<Story> getAllStories() {
      return fileStorageService.loadAllStories();
   }
}

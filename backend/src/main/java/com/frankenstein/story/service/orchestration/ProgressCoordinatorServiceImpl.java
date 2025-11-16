package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.service.ProgressNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Implementation of progress coordination service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressCoordinatorServiceImpl implements ProgressCoordinatorService {

   private final ProgressNotificationService progressNotificationService;

   @Override
   public void notifyStarted(final String storyId) {
      log.debug("Story generation started: {}", storyId);
      progressNotificationService.sendStarted(storyId);
   }

   @Override
   public void notifyGeneratingStory(final String storyId) {
      log.debug("Generating story structure: {}", storyId);
      progressNotificationService.sendGeneratingStory(storyId);
   }

   @Override
   public void notifyStoryComplete(final String storyId) {
      log.debug("Story structure complete: {}", storyId);
      progressNotificationService.sendStoryComplete(storyId);
   }

   @Override
   public void notifyImageProgress(final String storyId, final int current, final int total) {
      log.debug("Image generation progress: {}/{} for story {}", current, total, storyId);
      progressNotificationService.sendGeneratingImage(storyId, current, total);
   }

   @Override
   public void notifyImagesComplete(final String storyId) {
      log.debug("All images complete: {}", storyId);
      progressNotificationService.sendImagesComplete(storyId);
   }

   @Override
   public void notifyAudioProgress(final String storyId, final int current, final int total) {
      log.debug("Audio generation progress: {}/{} for story {}", current, total, storyId);
      progressNotificationService.sendGeneratingAudio(storyId, current, total);
   }

   @Override
   public void notifyAssembling(final String storyId) {
      log.debug("Assembling story: {}", storyId);
      progressNotificationService.sendAssembling(storyId);
   }

   @Override
   public void notifyComplete(final String storyId) {
      log.info("Story generation complete: {}", storyId);
      progressNotificationService.sendComplete(storyId);
   }

   @Override
   public void notifyError(final String storyId, final String errorMessage) {
      log.error("Story generation error for {}: {}", storyId, errorMessage);
      progressNotificationService.sendError(storyId, errorMessage);
   }
}

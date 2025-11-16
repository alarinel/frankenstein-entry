package com.frankenstein.story.service.orchestration;

/**
 * Service for coordinating progress notifications during story generation
 *
 * @author alarinel@gmail.com
 */
public interface ProgressCoordinatorService {

   /**
    * Notify that story generation has started
    */
   void notifyStarted(String storyId);

   /**
    * Notify outline generation progress
    */
   void notifyGeneratingOutline(String storyId);

   /**
    * Notify story structure generation progress
    */
   void notifyGeneratingStory(String storyId);

   /**
    * Notify story structure generation complete
    */
   void notifyStoryComplete(String storyId);

   /**
    * Notify image generation progress
    */
   void notifyImageProgress(String storyId, int current, int total);

   /**
    * Notify all images complete
    */
   void notifyImagesComplete(String storyId);

   /**
    * Notify audio generation progress
    */
   void notifyAudioProgress(String storyId, int current, int total);

   /**
    * Notify story assembly in progress
    */
   void notifyAssembling(String storyId);

   /**
    * Notify story generation complete
    */
   void notifyComplete(String storyId);

   /**
    * Notify error occurred
    */
   void notifyError(String storyId, String errorMessage);
}

package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.StoryStructure;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Service for orchestrating parallel image generation
 *
 * @author alarinel@gmail.com
 */
public interface ImageOrchestrationService {

   /**
    * Generate all images for a story in parallel
    *
    * @param storyId   the story identifier
    * @param structure the story structure containing image prompts
    * @return CompletableFuture containing list of generated image data
    */
   CompletableFuture<List<byte[]>> generateAllImages(String storyId, StoryStructure structure);
}

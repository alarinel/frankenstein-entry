package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.model.orchestration.AudioSet;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Service for orchestrating batched audio generation with throttling
 *
 * @author alarinel@gmail.com
 */
public interface AudioOrchestrationService {

   /**
    * Generate all audio (narration and effects) for a story with throttling
    *
    * @param storyId   the story identifier
    * @param structure the story structure containing text and sound effects
    * @return CompletableFuture containing list of audio sets
    */
   CompletableFuture<List<AudioSet>> generateAllAudio(String storyId, StoryStructure structure);
}

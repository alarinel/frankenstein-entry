package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.model.orchestration.AudioSet;

import java.util.List;

/**
 * Service for assembling story pages and metadata from generated assets
 *
 * @author alarinel@gmail.com
 */
public interface StoryAssemblyService {

   /**
    * Assemble complete story from structure and generated assets
    *
    * @param story     the story object to populate
    * @param structure the story structure
    * @param images    the generated images
    * @param audioSets the generated audio sets
    */
   void assembleStory(Story story, StoryStructure structure, List<byte[]> images, List<AudioSet> audioSets);
}

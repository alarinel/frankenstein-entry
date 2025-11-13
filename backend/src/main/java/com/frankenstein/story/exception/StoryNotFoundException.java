package com.frankenstein.story.exception;

public class StoryNotFoundException extends RuntimeException {

   public StoryNotFoundException(final String storyId) {
      super("Story not found: " + storyId);
   }
}

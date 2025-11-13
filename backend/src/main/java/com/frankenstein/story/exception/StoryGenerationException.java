package com.frankenstein.story.exception;

public class StoryGenerationException extends RuntimeException {

   public StoryGenerationException(final String message) {
      super(message);
   }

   public StoryGenerationException(final String message, final Throwable cause) {
      super(message, cause);
   }
}

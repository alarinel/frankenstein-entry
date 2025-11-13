package com.frankenstein.story.exception;

/**
 * Exception thrown when audio generation fails
 *
 * @author alarinel@gmail.com
 */
public class AudioGenerationException extends RuntimeException {

   public AudioGenerationException(final String message) {
      super(message);
   }

   public AudioGenerationException(final String message, final Throwable cause) {
      super(message, cause);
   }
}

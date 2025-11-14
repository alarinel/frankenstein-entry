package com.frankenstein.story.exception;

/**
 * Exception thrown when audio generation fails
 *
 * @author alarinel@gmail.com
 */
public class AudioGenerationException extends RuntimeException {

   public AudioGenerationException(String message) {
      super(message);
   }

   public AudioGenerationException(String message, Throwable cause) {
      super(message, cause);
   }
}

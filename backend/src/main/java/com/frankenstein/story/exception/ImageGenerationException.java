package com.frankenstein.story.exception;

/**
 * Exception thrown when image generation fails
 *
 * @author alarinel@gmail.com
 */
public class ImageGenerationException extends RuntimeException {

   public ImageGenerationException(String message) {
      super(message);
   }

   public ImageGenerationException(String message, Throwable cause) {
      super(message, cause);
   }
}

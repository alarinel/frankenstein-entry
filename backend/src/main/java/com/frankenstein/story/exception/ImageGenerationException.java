package com.frankenstein.story.exception;

/**
 * Exception thrown when image generation fails
 *
 * @author alarinel@gmail.com
 */
public class ImageGenerationException extends RuntimeException {

   public ImageGenerationException(final String message) {
      super(message);
   }

   public ImageGenerationException(final String message, final Throwable cause) {
      super(message, cause);
   }
}

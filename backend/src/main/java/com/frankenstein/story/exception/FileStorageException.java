package com.frankenstein.story.exception;

/**
 * Exception thrown when file storage operations fail
 *
 * @author alarinel@gmail.com
 */
public class FileStorageException extends RuntimeException {

   public FileStorageException(final String message) {
      super(message);
   }

   public FileStorageException(final String message, final Throwable cause) {
      super(message, cause);
   }
}

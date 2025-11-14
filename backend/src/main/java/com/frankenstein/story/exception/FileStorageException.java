package com.frankenstein.story.exception;

/**
 * Exception thrown when file storage operations fail
 *
 * @author alarinel@gmail.com
 */
public class FileStorageException extends RuntimeException {

   public FileStorageException(String message) {
      super(message);
   }

   public FileStorageException(String message, Throwable cause) {
      super(message, cause);
   }
}

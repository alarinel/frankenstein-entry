package com.frankenstein.story.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

   @ExceptionHandler(StoryGenerationException.class)
   public ResponseEntity<ErrorResponse> handleStoryGenerationException(final StoryGenerationException ex, final WebRequest request) {
      log.error("Story generation failed", ex);

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                               .error("Story Generation Failed")
                                               .message(ex.getMessage())
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }

   @ExceptionHandler(ImageGenerationException.class)
   public ResponseEntity<ErrorResponse> handleImageGenerationException(final ImageGenerationException ex, final WebRequest request) {
      log.error("Image generation failed", ex);

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                               .error("Image Generation Failed")
                                               .message("Failed to generate images for your story. Please try again.")
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }

   @ExceptionHandler(AudioGenerationException.class)
   public ResponseEntity<ErrorResponse> handleAudioGenerationException(final AudioGenerationException ex, final WebRequest request) {
      log.error("Audio generation failed", ex);

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                               .error("Audio Generation Failed")
                                               .message("Failed to generate audio for your story. Please try again.")
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }

   @ExceptionHandler(FileStorageException.class)
   public ResponseEntity<ErrorResponse> handleFileStorageException(final FileStorageException ex, final WebRequest request) {
      log.error("File storage operation failed", ex);

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                               .error("File Storage Error")
                                               .message("Failed to store or retrieve file. Please try again.")
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }

   @ExceptionHandler(MethodArgumentNotValidException.class)
   public ResponseEntity<ErrorResponse> handleValidationExceptions(final MethodArgumentNotValidException ex, final WebRequest request) {
      log.warn("Validation failed: {}", ex.getMessage());

      final Map<String, String> validationErrors = new HashMap<>();
      ex.getBindingResult().getAllErrors().forEach(error -> {
         final String fieldName = ((FieldError) error).getField();
         final String errorMessage = error.getDefaultMessage();
         validationErrors.put(fieldName, errorMessage);
      });

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.BAD_REQUEST.value())
                                               .error("Validation Failed")
                                               .message("Invalid input provided")
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .validationErrors(validationErrors)
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(IllegalArgumentException.class)
   public ResponseEntity<ErrorResponse> handleIllegalArgumentException(final IllegalArgumentException ex, final WebRequest request) {
      log.warn("Invalid argument: {}", ex.getMessage());

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.BAD_REQUEST.value())
                                               .error("Invalid Argument")
                                               .message(ex.getMessage())
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(ResourceNotFoundException.class)
   public ResponseEntity<ErrorResponse> handleResourceNotFoundException(final ResourceNotFoundException ex, final WebRequest request) {
      log.warn("Resource not found: {}", ex.getMessage());

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.NOT_FOUND.value())
                                               .error("Resource Not Found")
                                               .message(ex.getMessage())
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
   }

   @ExceptionHandler(Exception.class)
   public ResponseEntity<ErrorResponse> handleGlobalException(final Exception ex, final WebRequest request) {
      log.error("Unexpected error occurred", ex);

      final ErrorResponse error = ErrorResponse.builder()
                                               .timestamp(LocalDateTime.now())
                                               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                               .error("Internal Server Error")
                                               .message("An unexpected error occurred. Our team has been notified.")
                                               .path(request.getDescription(false).replace("uri=", ""))
                                               .build();

      return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }
}

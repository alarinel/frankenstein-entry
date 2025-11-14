package com.frankenstein.story.service;

import com.frankenstein.story.exception.ImageGenerationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.image.Image;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.image.ImageResponseMetadata;

import java.util.Base64;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests for ImageGenerationService using Spring AI
 * 
 * @author alarinel@gmail.com
 */
@ExtendWith(MockitoExtension.class)
class ImageGenerationServiceTest {

   @Mock
   private ImageModel imageModel;

   private ImageGenerationService service;

   @BeforeEach
   void setUp() {
      service = new ImageGenerationService(imageModel);
   }

   @Test
   void generateImage_Success() throws Exception {
      // Given
      String prompt = "A magical forest scene";
      int seed = 12345;
      
      byte[] testImageData = "test-image-data".getBytes();
      String base64Image = Base64.getEncoder().encodeToString(testImageData);
      
      Image mockImage = new Image(null, base64Image);
      ImageResponse mockResponse = new ImageResponse(List.of(new org.springframework.ai.image.ImageGeneration(mockImage)));
      
      when(imageModel.call(any(ImagePrompt.class))).thenReturn(mockResponse);

      // When
      CompletableFuture<byte[]> result = service.generateImage(prompt, seed);

      // Then
      assertThat(result).isNotNull();
      byte[] imageData = result.get();
      assertThat(imageData).isEqualTo(testImageData);
      
      verify(imageModel).call(any(ImagePrompt.class));
   }

   @Test
   void generateImage_WithEmptyResponse_ThrowsException() {
      // Given
      String prompt = "A magical forest";
      int seed = 12345;
      
      ImageResponse emptyResponse = new ImageResponse(List.of());
      when(imageModel.call(any(ImagePrompt.class))).thenReturn(emptyResponse);

      // When/Then
      CompletableFuture<byte[]> result = service.generateImage(prompt, seed);
      
      assertThatThrownBy(() -> result.get())
            .isInstanceOf(ExecutionException.class)
            .hasCauseInstanceOf(ImageGenerationException.class)
            .hasMessageContaining("No image generated");
   }

   @Test
   void generateImage_WithApiError_ThrowsException() {
      // Given
      String prompt = "A magical forest";
      int seed = 12345;
      
      when(imageModel.call(any(ImagePrompt.class)))
            .thenThrow(new RuntimeException("API Error"));

      // When/Then
      CompletableFuture<byte[]> result = service.generateImage(prompt, seed);
      
      assertThatThrownBy(() -> result.get())
            .isInstanceOf(ExecutionException.class)
            .hasCauseInstanceOf(ImageGenerationException.class);
   }

   @Test
   void generateImageWithRetry_SucceedsOnSecondAttempt() throws Exception {
      // Given
      String prompt = "A magical forest";
      int seed = 12345;
      
      byte[] testImageData = "test-image-data".getBytes();
      String base64Image = Base64.getEncoder().encodeToString(testImageData);
      
      Image mockImage = new Image(null, base64Image);
      ImageResponse mockResponse = new ImageResponse(List.of(new org.springframework.ai.image.ImageGeneration(mockImage)));
      
      // First call fails, second succeeds
      when(imageModel.call(any(ImagePrompt.class)))
            .thenThrow(new RuntimeException("Temporary error"))
            .thenReturn(mockResponse);

      // When
      CompletableFuture<byte[]> result = service.generateImageWithRetry(prompt, seed, 3);

      // Then
      assertThat(result).isNotNull();
      byte[] imageData = result.get();
      assertThat(imageData).isEqualTo(testImageData);
      
      verify(imageModel, times(2)).call(any(ImagePrompt.class));
   }

   @Test
   void generateImageWithRetry_FailsAfterMaxRetries() {
      // Given
      String prompt = "A magical forest";
      int seed = 12345;
      int maxRetries = 2;
      
      when(imageModel.call(any(ImagePrompt.class)))
            .thenThrow(new RuntimeException("Persistent error"));

      // When/Then
      CompletableFuture<byte[]> result = service.generateImageWithRetry(prompt, seed, maxRetries);
      
      assertThatThrownBy(() -> result.get())
            .isInstanceOf(ExecutionException.class);
      
      // Should have tried initial + maxRetries times
      verify(imageModel, times(maxRetries + 1)).call(any(ImagePrompt.class));
   }

   @Test
   void generateImage_UsesCorrectSeed() throws Exception {
      // Given
      String prompt = "A magical forest";
      int seed = 99999;
      
      byte[] testImageData = "test-image-data".getBytes();
      String base64Image = Base64.getEncoder().encodeToString(testImageData);
      
      Image mockImage = new Image(null, base64Image);
      ImageResponse mockResponse = new ImageResponse(List.of(new org.springframework.ai.image.ImageGeneration(mockImage)));
      
      when(imageModel.call(any(ImagePrompt.class))).thenReturn(mockResponse);

      // When
      CompletableFuture<byte[]> result = service.generateImage(prompt, seed);

      // Then
      assertThat(result.get()).isNotNull();
      verify(imageModel).call(any(ImagePrompt.class));
   }
}

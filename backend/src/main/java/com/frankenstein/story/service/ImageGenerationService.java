package com.frankenstein.story.service;

import com.frankenstein.story.exception.ImageGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptions;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.stabilityai.api.StabilityAiImageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Service for generating images using Stability AI via Spring AI
 * 
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageGenerationService {

   private final ImageModel imageModel;
   
   @Value("${api.stability.image-width:1024}")
   private int imageWidth;
   
   @Value("${api.stability.image-height:768}")
   private int imageHeight;
   
   @Value("${api.stability.cfg-scale:7.0}")
   private float cfgScale;
   
   @Value("${api.stability.steps:30}")
   private int steps;
   
   @Value("${api.stability.style-preset:fantasy-art}")
   private String stylePreset;

   public CompletableFuture<byte[]> generateImage(String prompt, int seed) {
      if (prompt == null || prompt.trim().isEmpty()) {
         return CompletableFuture.failedFuture(
               new ImageGenerationException("Prompt cannot be null or empty"));
      }
      
      return CompletableFuture.supplyAsync(() -> {
         try {
            log.debug("Generating image with seed {} for prompt: {}", seed, prompt);

            ImageOptions options = StabilityAiImageOptions.builder()
                  .withSeed((long) seed)
                  .withHeight(imageHeight)
                  .withWidth(imageWidth)
                  .withCfgScale(cfgScale)
                  .withSteps(steps)
                  .withStylePreset(stylePreset)
                  .build();

            ImagePrompt imagePrompt = new ImagePrompt(prompt, options);
            ImageResponse response = imageModel.call(imagePrompt);

            if (response.getResults().isEmpty()) {
               throw new ImageGenerationException("No image generated in response");
            }

            String base64Image = response.getResult().getOutput().getB64Json();
            byte[] imageData = Base64.getDecoder().decode(base64Image);

            log.debug("Successfully generated image ({} bytes)", imageData.length);
            return imageData;

         } catch (ImageGenerationException e) {
            // Re-throw our own exceptions without wrapping
            throw e;
         } catch (Exception e) {
            log.error("Failed to generate image with seed {}: {}", seed, e.getMessage(), e);
            throw new ImageGenerationException("Image generation failed: " + e.getMessage(), e);
         }
      });
   }

   public CompletableFuture<byte[]> generateImageWithRetry(String prompt, int seed, int maxRetries) {
      if (maxRetries < 0) {
         return CompletableFuture.failedFuture(
               new ImageGenerationException("Max retries must be non-negative"));
      }
      return generateImageWithRetry(prompt, seed, maxRetries, 0);
   }

   private CompletableFuture<byte[]> generateImageWithRetry(String prompt, int seed, int maxRetries, int attempt) {
      return generateImage(prompt, seed).exceptionallyCompose(throwable -> {
         if (attempt < maxRetries) {
            long delaySeconds = (long) Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s, 8s...
            log.warn("Image generation failed (attempt {}/{}), retrying in {}s...", 
                  attempt + 1, maxRetries, delaySeconds);
            
            // Non-blocking delay using CompletableFuture
            return CompletableFuture.supplyAsync(() -> null, 
                  CompletableFuture.delayedExecutor(delaySeconds, TimeUnit.SECONDS))
                  .thenCompose(v -> generateImageWithRetry(prompt, seed, maxRetries, attempt + 1));
         } else {
            log.error("Image generation failed after {} attempts for seed {}", maxRetries, seed);
            return CompletableFuture.failedFuture(throwable);
         }
      });
   }
}

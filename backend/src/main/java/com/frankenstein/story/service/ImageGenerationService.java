package com.frankenstein.story.service;

import com.frankenstein.story.exception.ImageGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
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

   /**
    * Enhances the original prompt with left-third composition guidance for 3D book display.
    * Positions focal points in the left 35% of the frame for optimal viewing when pages are angled.
    *
    * @param originalPrompt The original image generation prompt
    * @return Enhanced prompt with composition guidance prepended
    */
   private String enhancePromptWithComposition(final String originalPrompt) {
      final String compositionGuidance = "Composition: focal point positioned in the left 35% of the frame, " + "subject on the left side of the image, " + "main character or object left of center. ";

      final String enhancedPrompt = compositionGuidance + originalPrompt;
      log.debug("Enhanced prompt with left-third composition guidance");

      return enhancedPrompt;
   }

   public CompletableFuture<byte[]> generateImage(final String prompt, final int seed) {
      if (prompt == null || prompt.trim().isEmpty()) {
         return CompletableFuture.failedFuture(new ImageGenerationException("Prompt cannot be null or empty"));
      }

      return CompletableFuture.supplyAsync(() -> {
         try {
            // Enhance prompt with left-third composition guidance
            final String enhancedPrompt = enhancePromptWithComposition(prompt);
            log.debug("Generating image with seed {} for enhanced prompt: {}", seed, enhancedPrompt);

            final ImagePrompt imagePrompt = new ImagePrompt(enhancedPrompt);
            final ImageResponse response = imageModel.call(imagePrompt);

            if (response.getResults().isEmpty()) {
               throw new ImageGenerationException("No image generated in response");
            }

            final String base64Image = response.getResult().getOutput().getB64Json();
            final byte[] imageData = Base64.getDecoder().decode(base64Image);

            log.debug("Successfully generated image ({} bytes) with left-third composition", imageData.length);
            return imageData;

         } catch (final ImageGenerationException e) {
            // Re-throw our own exceptions without wrapping
            throw e;
         } catch (final Exception e) {
            log.error("Failed to generate image with seed {}: {}", seed, e.getMessage(), e);
            throw new ImageGenerationException("Image generation failed: " + e.getMessage(), e);
         }
      });
   }

   public CompletableFuture<byte[]> generateImageWithRetry(final String prompt, final int seed, final int maxRetries) {
      if (maxRetries < 0) {
         return CompletableFuture.failedFuture(new ImageGenerationException("Max retries must be non-negative"));
      }
      return generateImageWithRetry(prompt, seed, maxRetries, 0);
   }

   private CompletableFuture<byte[]> generateImageWithRetry(final String prompt, final int seed, final int maxRetries, final int attempt) {
      return generateImage(prompt, seed).exceptionallyCompose(throwable -> {
         if (attempt < maxRetries) {
            final long delaySeconds = (long) Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s, 8s...
            log.warn("Image generation failed (attempt {}/{}), retrying in {}s...", attempt + 1, maxRetries, delaySeconds);

            // Non-blocking delay using CompletableFuture
            return CompletableFuture.supplyAsync(() -> null, CompletableFuture.delayedExecutor(delaySeconds, TimeUnit.SECONDS))
                                    .thenCompose(v -> generateImageWithRetry(prompt, seed, maxRetries, attempt + 1));
         } else {
            log.error("Image generation failed after {} attempts for seed {}", maxRetries, seed);
            return CompletableFuture.failedFuture(throwable);
         }
      });
   }
}

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
    * Quality enhancement tags to ensure high-quality image generation
    */
   private static final String QUALITY_TAGS = "high quality, highly detailed, sharp focus, professional illustration, " +
         "8k resolution, masterpiece, best quality, crisp details, vibrant colors, clean composition, " +
         "no text, no watermark, no signature, no labels, no words, no letters";

   /**
    * Negative prompt to exclude unwanted elements
    */
   private static final String NEGATIVE_ELEMENTS = "Avoid: blurry, low quality, pixelated, distorted, " +
         "text, watermark, signature, logo, copyright, words, letters, numbers, labels, captions, " +
         "ugly, deformed, disfigured, bad anatomy, bad proportions, extra limbs, cloned face, " +
         "malformed limbs, missing arms, missing legs, fused fingers, too many fingers, " +
         "long neck, cross-eyed, mutated hands, poorly drawn hands, poorly drawn face, " +
         "mutation, deformed, blurry, bad anatomy, bad proportions, extra limbs, " +
         "disfigured, ugly, gross proportions, malformed limbs, missing arms, missing legs, " +
         "extra arms, extra legs, mutated hands, fused fingers, too many fingers, long neck";

   /**
    * Enhances the original prompt with quality tags, composition guidance, and outpainting for 3D book display.
    * Positions focal points in the left 35% of the frame for optimal viewing when pages are angled.
    * Adds extra canvas space for better book page display.
    *
    * @param originalPrompt The original image generation prompt
    * @return Enhanced prompt with quality tags, composition guidance, and negative prompt guidance
    */
   private String enhancePromptWithComposition(final String originalPrompt) {
      final String compositionGuidance = "Composition: focal point positioned in the left 35% of the frame, " + 
         "subject on the left side of the image, " + 
         "main character or object left of center. " +
         "Extended canvas with extra space on top (10%), bottom (10%), and right side (30%) for book page display. " +
         "No extra space on left side. " +
         "Scene should extend naturally into the extra space with appropriate background elements. ";

      // Combine quality tags, composition guidance, original prompt, and negative guidance
      final String enhancedPrompt = QUALITY_TAGS + " " + compositionGuidance + originalPrompt + " " + NEGATIVE_ELEMENTS;
      log.debug("Enhanced prompt with quality tags, left-third composition, and negative prompt guidance");

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

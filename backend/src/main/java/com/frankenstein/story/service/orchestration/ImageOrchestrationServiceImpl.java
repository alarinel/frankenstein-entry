package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.ApiCallLog;
import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.service.FileStorageService;
import com.frankenstein.story.service.ImageGenerationService;
import com.frankenstein.story.service.tracking.ApiTrackingFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Implementation of image orchestration service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageOrchestrationServiceImpl implements ImageOrchestrationService {

   private final ImageGenerationService imageGenerationService;
   private final FileStorageService fileStorageService;
   private final ProgressCoordinatorService progressCoordinator;
   private final ApiTrackingFacade apiTrackingFacade;

   @Override
   public CompletableFuture<List<byte[]>> generateAllImages(final String storyId, final StoryStructure structure) {
      log.info("Starting parallel image generation for story: {}", storyId);

      final List<CompletableFuture<byte[]>> imageFutures = new ArrayList<>();
      final long startTime = System.currentTimeMillis();

      for (int i = 0; i < structure.getPages().size(); i++) {
         final int pageNumber = i + 1;
         final StoryStructure.PageStructure page = structure.getPages().get(i);

         final CompletableFuture<byte[]> imageFuture = imageGenerationService.generateImageWithRetry(page.getImagePrompt(),
               structure.getImageSeed() + i,
               3).thenApply(imageData -> {
            fileStorageService.saveImage(storyId, pageNumber, imageData);
            progressCoordinator.notifyImageProgress(storyId, pageNumber, structure.getPages().size());
            return imageData;
         }).exceptionally(throwable -> {
            log.error("Failed to generate image for page {}", pageNumber, throwable);
            return new byte[0];
         });

         imageFutures.add(imageFuture);
      }

      return CompletableFuture.allOf(imageFutures.toArray(new CompletableFuture[0])).thenApply(v -> {
         final List<byte[]> images = imageFutures.stream().map(CompletableFuture::join).collect(Collectors.toList());
         
         // Log API call for all images
         final int imageCount = structure.getPages().size();
         logImageApiCall(storyId, imageCount, startTime, "SUCCESS", null);
         
         log.info("Completed parallel image generation for story: {}", storyId);
         return images;
      }).exceptionally(throwable -> {
         logImageApiCall(storyId, structure.getPages().size(), startTime, "FAILED", throwable.getMessage());
         throw new RuntimeException("Image generation failed", throwable);
      });
   }

   /**
    * Log image API call to tracking system
    */
   private void logImageApiCall(final String storyId, final int imageCount,
                                final long startTime, final String status, final String errorMessage) {
      try {
         final long duration = System.currentTimeMillis() - startTime;
         final double cost = apiTrackingFacade.calculateImageGenerationCost(imageCount);
         
         final ApiCallLog log = ApiCallLog.builder()
               .storyId(storyId)
               .apiProvider("STABILITY_AI")
               .operation("IMAGE_GENERATION")
               .costUsd(cost)
               .durationMs(duration)
               .status(status)
               .errorMessage(errorMessage)
               .build();
         
         apiTrackingFacade.logApiCall(log);
      } catch (final Exception e) {
         log.error("Failed to log image API call", e);
      }
   }
}

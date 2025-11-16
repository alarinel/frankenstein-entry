package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.service.FileStorageService;
import com.frankenstein.story.service.ImageGenerationService;
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

   @Override
   public CompletableFuture<List<byte[]>> generateAllImages(final String storyId, final StoryStructure structure) {
      log.info("Starting parallel image generation for story: {}", storyId);

      final List<CompletableFuture<byte[]>> imageFutures = new ArrayList<>();

      for (int i = 0; i < structure.getPages().size(); i++) {
         final int pageNumber = i + 1;
         final StoryStructure.PageStructure page = structure.getPages().get(i);

         final CompletableFuture<byte[]> imageFuture = imageGenerationService.generateImageWithRetry(page.getImagePrompt(),
               structure.getImageSeed() + i,
               3).thenApply(imageData -> {
            fileStorageService.saveImage(storyId, pageNumber, imageData);
            progressCoordinator.notifyImageProgress(storyId, pageNumber, structure.getPages().size());
            return imageData;
         });

         imageFutures.add(imageFuture);
      }

      return CompletableFuture.allOf(imageFutures.toArray(new CompletableFuture[0])).thenApply(v -> {
         final List<byte[]> images = imageFutures.stream().map(CompletableFuture::join).collect(Collectors.toList());
         log.info("Completed parallel image generation for story: {}", storyId);
         return images;
      });
   }
}

package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.model.orchestration.AudioSet;
import com.frankenstein.story.service.AudioGenerationService;
import com.frankenstein.story.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Implementation of audio orchestration service with batched processing
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AudioOrchestrationServiceImpl implements AudioOrchestrationService {

   private static final int MAX_CONCURRENT_AUDIO_REQUESTS = 3;

   private final AudioGenerationService audioGenerationService;
   private final FileStorageService fileStorageService;
   private final ProgressCoordinatorService progressCoordinator;

   @Override
   public CompletableFuture<List<AudioSet>> generateAllAudio(final String storyId, final StoryStructure structure) {
      log.info("Starting batched audio generation for story: {}", storyId);

      final List<AudioSet> audioSets = new ArrayList<>();

      // Process pages in batches to throttle concurrent requests
      for (int batchStart = 0; batchStart < structure.getPages().size(); batchStart += MAX_CONCURRENT_AUDIO_REQUESTS) {
         final int batchEnd = Math.min(batchStart + MAX_CONCURRENT_AUDIO_REQUESTS, structure.getPages().size());
         final List<CompletableFuture<AudioSet>> batchFutures = new ArrayList<>();

         for (int i = batchStart; i < batchEnd; i++) {
            final int pageNumber = i + 1;
            final StoryStructure.PageStructure page = structure.getPages().get(i);

            final CompletableFuture<AudioSet> audioFuture = CompletableFuture.supplyAsync(() -> generateAudioForPage(storyId,
                  pageNumber,
                  page,
                  structure.getPages().size()));

            batchFutures.add(audioFuture);
         }

         // Wait for current batch to complete before starting next batch
         CompletableFuture.allOf(batchFutures.toArray(new CompletableFuture[0])).join();
         audioSets.addAll(batchFutures.stream().map(CompletableFuture::join).toList());
      }

      log.info("Completed batched audio generation for story: {}", storyId);
      return CompletableFuture.completedFuture(audioSets);
   }

   private AudioSet generateAudioForPage(final String storyId, final int pageNumber, final StoryStructure.PageStructure page, final int totalPages) {
      // Generate narration
      final byte[] narration = audioGenerationService.generateNarration(page.getText()).join();
      fileStorageService.saveNarration(storyId, pageNumber, narration);

      // Generate sound effects
      final List<byte[]> effects = page.getSoundEffects()
                                       .stream()
                                       .map(effectName -> generateSoundEffect(storyId, effectName))
                                       .collect(Collectors.toList());

      // Notify progress
      progressCoordinator.notifyAudioProgress(storyId, pageNumber, totalPages);

      // Calculate duration
      final double duration = audioGenerationService.estimateNarrationDuration(page.getText());

      return AudioSet.builder().narration(narration).effects(effects).duration(duration).build();
   }

   private byte[] generateSoundEffect(final String storyId, final String effectName) {
      final byte[] effectData = audioGenerationService.generateSoundEffect(effectName).join();
      if (effectData.length > 0) {
         fileStorageService.saveSoundEffect(storyId, effectName, effectData);
      }
      return effectData;
   }
}

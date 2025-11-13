package com.frankenstein.story.service;

import com.frankenstein.story.exception.StoryGenerationException;
import com.frankenstein.story.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Orchestrates the entire story generation workflow
 */
@Slf4j
@Service
public class StoryOrchestrationService {

    private final StoryGenerationService storyGenerationService;
    private final ImageGenerationService imageGenerationService;
    private final AudioGenerationService audioGenerationService;
    private final FileStorageService fileStorageService;
    private final ProgressNotificationService progressService;

    // In-memory storage for story status
    private final ConcurrentHashMap<String, Story> activeStories = new ConcurrentHashMap<>();

    public StoryOrchestrationService(
            StoryGenerationService storyGenerationService,
            ImageGenerationService imageGenerationService,
            AudioGenerationService audioGenerationService,
            FileStorageService fileStorageService,
            ProgressNotificationService progressService) {
        this.storyGenerationService = storyGenerationService;
        this.imageGenerationService = imageGenerationService;
        this.audioGenerationService = audioGenerationService;
        this.fileStorageService = fileStorageService;
        this.progressService = progressService;
    }

    public String initiateStoryGeneration(StoryInput input) {
        String storyId = UUID.randomUUID().toString();

        Story story = Story.builder()
                .id(storyId)
                .input(input)
                .status(StoryStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        activeStories.put(storyId, story);
        fileStorageService.createStoryDirectories(storyId);

        log.info("Initiated story generation: {}", storyId);
        return storyId;
    }

    @Async("storyGenerationExecutor")
    public CompletableFuture<Story> generateStoryAsync(String storyId) {
        Story story = activeStories.get(storyId);
        if (story == null) {
            return CompletableFuture.failedFuture(
                    new StoryGenerationException("Story not found: " + storyId));
        }

        try {
            progressService.sendStarted(storyId);

            // Step 1: Generate story structure with Claude
            progressService.sendGeneratingStory(storyId);
            story.setStatus(StoryStatus.GENERATING_STORY);

            StoryStructure structure = storyGenerationService.generateStory(story.getInput());
            story.setTitle(structure.getTitle());

            progressService.sendStoryComplete(storyId);

            // Step 2: Generate images in parallel
            story.setStatus(StoryStatus.GENERATING_IMAGES);
            List<byte[]> images = generateAllImages(storyId, structure).join();

            progressService.sendImagesComplete(storyId);

            // Step 3: Generate audio in parallel
            story.setStatus(StoryStatus.GENERATING_AUDIO);
            List<AudioSet> audioSets = generateAllAudio(storyId, structure).join();

            // Step 4: Assemble story
            progressService.sendAssembling(storyId);
            story.setStatus(StoryStatus.ASSEMBLING);

            assembleStory(story, structure, images, audioSets);

            // Step 5: Save and complete
            story.setStatus(StoryStatus.COMPLETED);
            story.setCompletedAt(LocalDateTime.now());

            fileStorageService.saveStoryMetadata(story);
            progressService.sendComplete(storyId);

            log.info("Story generation completed: {}", storyId);
            return CompletableFuture.completedFuture(story);

        } catch (Exception e) {
            log.error("Story generation failed for: {}", storyId, e);
            story.setStatus(StoryStatus.FAILED);
            story.setErrorMessage(e.getMessage());

            fileStorageService.saveStoryMetadata(story);
            progressService.sendError(storyId, e.getMessage());

            return CompletableFuture.failedFuture(e);
        }
    }

    private CompletableFuture<List<byte[]>> generateAllImages(String storyId, StoryStructure structure) {
        List<CompletableFuture<byte[]>> imageFutures = new ArrayList<>();

        for (int i = 0; i < structure.getPages().size(); i++) {
            final int pageNumber = i + 1;
            StoryStructure.PageStructure page = structure.getPages().get(i);

            CompletableFuture<byte[]> imageFuture = imageGenerationService
                    .generateImageWithRetry(page.getImagePrompt(), structure.getImageSeed() + i, 3)
                    .thenApply(imageData -> {
                        fileStorageService.saveImage(storyId, pageNumber, imageData);
                        progressService.sendGeneratingImage(storyId, pageNumber, structure.getPages().size());
                        return imageData;
                    });

            imageFutures.add(imageFuture);
        }

        return CompletableFuture.allOf(imageFutures.toArray(new CompletableFuture[0]))
                .thenApply(v -> imageFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList()));
    }

    private CompletableFuture<List<AudioSet>> generateAllAudio(String storyId, StoryStructure structure) {
        List<CompletableFuture<AudioSet>> audioFutures = new ArrayList<>();

        for (int i = 0; i < structure.getPages().size(); i++) {
            final int pageNumber = i + 1;
            StoryStructure.PageStructure page = structure.getPages().get(i);

            CompletableFuture<AudioSet> audioFuture = CompletableFuture.supplyAsync(() -> {
                // Generate narration
                byte[] narration = audioGenerationService.generateNarration(page.getText()).join();
                fileStorageService.saveNarration(storyId, pageNumber, narration);

                // Generate sound effects
                List<byte[]> effects = page.getSoundEffects().stream()
                        .map(effectName -> {
                            byte[] effectData = audioGenerationService.generateSoundEffect(effectName).join();
                            if (effectData.length > 0) {
                                fileStorageService.saveSoundEffect(storyId, effectName, effectData);
                            }
                            return effectData;
                        })
                        .collect(Collectors.toList());

                progressService.sendGeneratingAudio(storyId, pageNumber, structure.getPages().size());

                AudioSet audioSet = new AudioSet();
                audioSet.narration = narration;
                audioSet.effects = effects;
                audioSet.duration = audioGenerationService.estimateNarrationDuration(page.getText());

                return audioSet;
            });

            audioFutures.add(audioFuture);
        }

        return CompletableFuture.allOf(audioFutures.toArray(new CompletableFuture[0]))
                .thenApply(v -> audioFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList()));
    }

    private void assembleStory(Story story, StoryStructure structure,
                                List<byte[]> images, List<AudioSet> audioSets) {
        List<StoryPage> pages = new ArrayList<>();
        double totalDuration = 0;

        for (int i = 0; i < structure.getPages().size(); i++) {
            StoryStructure.PageStructure pageStructure = structure.getPages().get(i);
            AudioSet audioSet = audioSets.get(i);

            List<String> effectUrls = pageStructure.getSoundEffects().stream()
                    .map(effect -> fileStorageService.getSoundEffectUrl(story.getId(), effect))
                    .collect(Collectors.toList());

            StoryPage page = StoryPage.builder()
                    .pageNumber(i + 1)
                    .text(pageStructure.getText())
                    .imagePrompt(pageStructure.getImagePrompt())
                    .imageUrl(fileStorageService.getImageUrl(story.getId(), i + 1))
                    .narrationUrl(fileStorageService.getNarrationUrl(story.getId(), i + 1))
                    .soundEffects(pageStructure.getSoundEffects())
                    .soundEffectUrls(effectUrls)
                    .mood(pageStructure.getMood())
                    .duration(audioSet.duration)
                    .build();

            pages.add(page);
            totalDuration += audioSet.duration;
        }

        story.setPages(pages);

        StoryMetadata metadata = StoryMetadata.builder()
                .imageSeed(structure.getImageSeed())
                .totalDuration(totalDuration)
                .pageCount(pages.size())
                .estimatedReadTime(formatDuration(totalDuration))
                .build();

        story.setMetadata(metadata);
    }

    private String formatDuration(double seconds) {
        int minutes = (int) (seconds / 60);
        int secs = (int) (seconds % 60);
        return String.format("%d:%02d", minutes, secs);
    }

    public Story getStory(String storyId) {
        // Check active stories first
        Story story = activeStories.get(storyId);
        if (story != null) {
            return story;
        }

        // Otherwise load from disk
        return fileStorageService.loadStory(storyId);
    }

    public List<Story> getAllStories() {
        return fileStorageService.loadAllStories();
    }

    // Helper class for audio data
    private static class AudioSet {
        byte[] narration;
        List<byte[]> effects;
        double duration;
    }
}

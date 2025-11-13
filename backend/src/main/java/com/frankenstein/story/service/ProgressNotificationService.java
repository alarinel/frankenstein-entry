package com.frankenstein.story.service;

import com.frankenstein.story.model.GenerationProgress;
import com.frankenstein.story.model.StoryStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for sending real-time progress updates via WebSocket
 */
@Slf4j
@Service
public class ProgressNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public ProgressNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendProgress(String storyId, StoryStatus status, int percentage, String stage, String message) {
        GenerationProgress progress = GenerationProgress.builder()
                .storyId(storyId)
                .status(status)
                .progressPercentage(percentage)
                .stage(stage)
                .message(message)
                .build();

        messagingTemplate.convertAndSend("/topic/story-progress/" + storyId, progress);
        log.debug("Sent progress for story {}: {}% - {}", storyId, percentage, message);
    }

    public void sendStarted(String storyId) {
        sendProgress(storyId, StoryStatus.PENDING, 0,
                "Starting", "Initializing your magical story...");
    }

    public void sendGeneratingStory(String storyId) {
        sendProgress(storyId, StoryStatus.GENERATING_STORY, 10,
                "Crafting Story", "Weaving together your tale...");
    }

    public void sendStoryComplete(String storyId) {
        sendProgress(storyId, StoryStatus.GENERATING_STORY, 30,
                "Story Complete", "Your story is written! Now creating illustrations...");
    }

    public void sendGeneratingImage(String storyId, int pageNumber, int totalPages) {
        int baseProgress = 30;
        int progressRange = 40; // 30-70% for images
        int currentProgress = baseProgress + (progressRange * pageNumber / totalPages);

        sendProgress(storyId, StoryStatus.GENERATING_IMAGES, currentProgress,
                "Painting Illustrations",
                String.format("Creating magical artwork for page %d of %d...", pageNumber, totalPages));
    }

    public void sendImagesComplete(String storyId) {
        sendProgress(storyId, StoryStatus.GENERATING_AUDIO, 70,
                "Illustrations Complete", "All images painted! Recording narration...");
    }

    public void sendGeneratingAudio(String storyId, int pageNumber, int totalPages) {
        int baseProgress = 70;
        int progressRange = 20; // 70-90% for audio
        int currentProgress = baseProgress + (progressRange * pageNumber / totalPages);

        sendProgress(storyId, StoryStatus.GENERATING_AUDIO, currentProgress,
                "Recording Narration",
                String.format("Adding voice to page %d of %d...", pageNumber, totalPages));
    }

    public void sendAssembling(String storyId) {
        sendProgress(storyId, StoryStatus.ASSEMBLING, 90,
                "Assembling Book", "Bringing all the pieces together...");
    }

    public void sendComplete(String storyId) {
        sendProgress(storyId, StoryStatus.COMPLETED, 100,
                "Complete", "Your magical story is ready!");
    }

    public void sendError(String storyId, String errorMessage) {
        sendProgress(storyId, StoryStatus.FAILED, 0,
                "Error", "Something went wrong: " + errorMessage);
    }
}

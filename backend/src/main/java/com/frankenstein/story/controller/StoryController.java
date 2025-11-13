package com.frankenstein.story.controller;

import com.frankenstein.story.model.GenerateStoryResponse;
import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStatus;
import com.frankenstein.story.service.StoryOrchestrationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryOrchestrationService orchestrationService;

    public StoryController(StoryOrchestrationService orchestrationService) {
        this.orchestrationService = orchestrationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<GenerateStoryResponse> generateStory(@Valid @RequestBody StoryInput input) {
        log.info("Received story generation request for character: {}", input.getCharacterName());

        String storyId = orchestrationService.initiateStoryGeneration(input);

        // Start async generation
        orchestrationService.generateStoryAsync(storyId);

        GenerateStoryResponse response = GenerateStoryResponse.builder()
                .storyId(storyId)
                .status(StoryStatus.PENDING)
                .message("Story generation started")
                .build();

        return ResponseEntity.accepted().body(response);
    }

    @GetMapping("/{storyId}")
    public ResponseEntity<Story> getStory(@PathVariable String storyId) {
        log.debug("Fetching story: {}", storyId);
        Story story = orchestrationService.getStory(storyId);
        return ResponseEntity.ok(story);
    }

    @GetMapping("/{storyId}/status")
    public ResponseEntity<StoryStatusResponse> getStoryStatus(@PathVariable String storyId) {
        log.debug("Fetching story status: {}", storyId);
        Story story = orchestrationService.getStory(storyId);

        StoryStatusResponse response = StoryStatusResponse.builder()
                .storyId(storyId)
                .status(story.getStatus())
                .progress(calculateProgress(story.getStatus()))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Story>> getAllStories() {
        log.debug("Fetching all stories");
        List<Story> stories = orchestrationService.getAllStories();
        return ResponseEntity.ok(stories);
    }

    private int calculateProgress(StoryStatus status) {
        return switch (status) {
            case PENDING -> 0;
            case GENERATING_STORY -> 20;
            case GENERATING_IMAGES -> 50;
            case GENERATING_AUDIO -> 80;
            case ASSEMBLING -> 95;
            case COMPLETED -> 100;
            case FAILED -> 0;
        };
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class StoryStatusResponse {
        private String storyId;
        private StoryStatus status;
        private int progress;
    }
}

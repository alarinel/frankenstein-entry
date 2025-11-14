package com.frankenstein.story.service;

import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStatus;
import com.frankenstein.story.model.StoryStructure;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests for StoryOrchestrationService
 *
 * @author alarinel@gmail.com
 */
@ExtendWith(MockitoExtension.class)
class StoryOrchestrationServiceTest {

   @Mock
   private StoryGenerationService storyGenerationService;

   @Mock
   private ImageGenerationService imageGenerationService;

   @Mock
   private AudioGenerationService audioGenerationService;

   @Mock
   private FileStorageService fileStorageService;

   @Mock
   private ProgressNotificationService progressService;

   private StoryOrchestrationService service;

   @BeforeEach
   void setUp() {
      service = new StoryOrchestrationService(storyGenerationService,
            imageGenerationService,
            audioGenerationService,
            fileStorageService,
            progressService);
   }

   @Test
   void initiateStoryGeneration_CreatesStoryWithId() {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("Luna")
                                         .setting("enchanted forest")
                                         .villain("dark wizard")
                                         .specialItem("magic wand")
                                         .characterTrait("brave")
                                         .goal("save the forest")
                                         .timePeriod("medieval times")
                                         .mood("adventurous")
                                         .build();

      // When
      final String storyId = service.initiateStoryGeneration(input);

      // Then
      assertThat(storyId).isNotNull();
      assertThat(storyId).isNotEmpty();
      verify(fileStorageService).createStoryDirectories(storyId);
   }

   @Test
   void generateStoryAsync_Success() throws Exception {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("Luna")
                                         .setting("enchanted forest")
                                         .villain("dark wizard")
                                         .specialItem("magic wand")
                                         .characterTrait("brave")
                                         .goal("save the forest")
                                         .timePeriod("medieval times")
                                         .mood("adventurous")
                                         .build();

      final String storyId = service.initiateStoryGeneration(input);

      final StoryStructure.PageStructure page1 = StoryStructure.PageStructure.builder()
                                                                             .pageNumber(1)
                                                                             .text("Luna entered the enchanted forest.")
                                                                             .imagePrompt("A brave girl entering a magical forest")
                                                                             .soundEffects(List.of("forest_ambience"))
                                                                             .mood("mysterious")
                                                                             .build();

      final StoryStructure.PageStructure page2 = StoryStructure.PageStructure.builder()
                                                                             .pageNumber(2)
                                                                             .text("She found a magic wand.")
                                                                             .imagePrompt("A girl discovering a glowing wand")
                                                                             .soundEffects(List.of("magic_sparkle"))
                                                                             .mood("exciting")
                                                                             .build();

      final StoryStructure storyStructure = StoryStructure.builder().title("Luna's Adventure").imageSeed(12345).pages(Arrays.asList(page1, page2)).build();

      final byte[] mockImageData = "mock-image-data".getBytes();
      final byte[] mockAudioData = "mock-audio-data".getBytes();

      when(storyGenerationService.generateStory(any(StoryInput.class))).thenReturn(storyStructure);
      when(imageGenerationService.generateImageWithRetry(anyString(),
            anyInt(),
            anyInt())).thenReturn(CompletableFuture.completedFuture(mockImageData));
      when(audioGenerationService.generateNarration(anyString())).thenReturn(CompletableFuture.completedFuture(mockAudioData));
      when(audioGenerationService.generateSoundEffect(anyString())).thenReturn(CompletableFuture.completedFuture(mockAudioData));
      when(audioGenerationService.estimateNarrationDuration(anyString())).thenReturn(5.0);
      when(fileStorageService.getImageUrl(anyString(), anyInt())).thenReturn("http://localhost/images/page-1.png");
      when(fileStorageService.getNarrationUrl(anyString(), anyInt())).thenReturn("http://localhost/audio/narration-1.mp3");
      when(fileStorageService.getSoundEffectUrl(anyString(), anyString())).thenReturn("http://localhost/audio/effect.mp3");

      // When
      final CompletableFuture<Story> result = service.generateStoryAsync(storyId);
      final Story story = result.get();

      // Then
      assertThat(story).isNotNull();
      assertThat(story.getId()).isEqualTo(storyId);
      assertThat(story.getTitle()).isEqualTo("Luna's Adventure");
      assertThat(story.getStatus()).isEqualTo(StoryStatus.COMPLETED);
      assertThat(story.getPages()).hasSize(2);

      // Verify services were called
      verify(storyGenerationService).generateStory(any(StoryInput.class));
      verify(imageGenerationService, times(2)).generateImageWithRetry(anyString(), anyInt(), eq(3));
      verify(audioGenerationService, times(2)).generateNarration(anyString());
      verify(fileStorageService).saveStoryMetadata(any(Story.class));
      verify(progressService).sendComplete(storyId);
   }

   @Test
   void generateStoryAsync_SendsProgressUpdates() throws Exception {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("Luna")
                                         .setting("forest")
                                         .villain("wizard")
                                         .specialItem("wand")
                                         .characterTrait("brave")
                                         .goal("save forest")
                                         .timePeriod("medieval")
                                         .mood("adventurous")
                                         .build();

      final String storyId = service.initiateStoryGeneration(input);

      final StoryStructure.PageStructure page = StoryStructure.PageStructure.builder()
                                                                            .pageNumber(1)
                                                                            .text("Test text")
                                                                            .imagePrompt("Test prompt")
                                                                            .soundEffects(List.of("test_effect"))
                                                                            .mood("test")
                                                                            .build();

      final StoryStructure storyStructure = StoryStructure.builder().title("Test Story").imageSeed(12345).pages(Collections.singletonList(page)).build();

      final byte[] mockData = "mock-data".getBytes();

      when(storyGenerationService.generateStory(any(StoryInput.class))).thenReturn(storyStructure);
      when(imageGenerationService.generateImageWithRetry(anyString(), anyInt(), anyInt())).thenReturn(CompletableFuture.completedFuture(mockData));
      when(audioGenerationService.generateNarration(anyString())).thenReturn(CompletableFuture.completedFuture(mockData));
      when(audioGenerationService.generateSoundEffect(anyString())).thenReturn(CompletableFuture.completedFuture(mockData));
      when(audioGenerationService.estimateNarrationDuration(anyString())).thenReturn(5.0);
      when(fileStorageService.getImageUrl(anyString(), anyInt())).thenReturn("http://localhost/images/test.png");
      when(fileStorageService.getNarrationUrl(anyString(), anyInt())).thenReturn("http://localhost/audio/test.mp3");
      when(fileStorageService.getSoundEffectUrl(anyString(), anyString())).thenReturn("http://localhost/audio/effect.mp3");

      // When
      service.generateStoryAsync(storyId).get();

      // Then - Verify progress updates for each stage
      verify(progressService).sendStarted(storyId);
      verify(progressService).sendGeneratingStory(storyId);
      verify(progressService).sendStoryComplete(storyId);
      verify(progressService).sendImagesComplete(storyId);
      verify(progressService).sendAssembling(storyId);
      verify(progressService).sendComplete(storyId);
   }

   @Test
   void generateStoryAsync_WithStoryGenerationFailure_SendsError() throws Exception {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("Luna")
                                         .setting("forest")
                                         .villain("wizard")
                                         .specialItem("wand")
                                         .characterTrait("brave")
                                         .goal("save forest")
                                         .timePeriod("medieval")
                                         .mood("adventurous")
                                         .build();

      final String storyId = service.initiateStoryGeneration(input);

      when(storyGenerationService.generateStory(any(StoryInput.class))).thenThrow(new RuntimeException("Story generation failed"));

      // When
      final CompletableFuture<Story> result = service.generateStoryAsync(storyId);

      // Then
      assertThat(result).isCompletedExceptionally();

      final Story story = service.getStory(storyId);
      assertThat(story.getStatus()).isEqualTo(StoryStatus.FAILED);
      assertThat(story.getErrorMessage()).isNotNull();

      verify(progressService).sendError(eq(storyId), anyString());
   }

   @Test
   void getStory_ReturnsStoryFromMemory() {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("Luna")
                                         .setting("forest")
                                         .villain("wizard")
                                         .specialItem("wand")
                                         .characterTrait("brave")
                                         .goal("save forest")
                                         .timePeriod("medieval")
                                         .mood("adventurous")
                                         .build();

      final String storyId = service.initiateStoryGeneration(input);

      // When
      final Story story = service.getStory(storyId);

      // Then
      assertThat(story).isNotNull();
      assertThat(story.getId()).isEqualTo(storyId);
      assertThat(story.getInput()).isEqualTo(input);
   }

   @Test
   void getStory_LoadsFromDiskIfNotInMemory() {
      // Given
      final String storyId = "non-existent-id";
      final Story mockStory = Story.builder().id(storyId).title("Test Story").status(StoryStatus.COMPLETED).build();

      when(fileStorageService.loadStory(storyId)).thenReturn(mockStory);

      // When
      final Story story = service.getStory(storyId);

      // Then
      assertThat(story).isNotNull();
      assertThat(story.getId()).isEqualTo(storyId);
      verify(fileStorageService).loadStory(storyId);
   }

   @Test
   void getAllStories_LoadsFromFileStorage() {
      // Given
      final List<Story> mockStories = Arrays.asList(Story.builder().id("story-1").title("Story 1").build(),
            Story.builder().id("story-2").title("Story 2").build());

      when(fileStorageService.loadAllStories()).thenReturn(mockStories);

      // When
      final List<Story> stories = service.getAllStories();

      // Then
      assertThat(stories).hasSize(2);
      verify(fileStorageService).loadAllStories();
   }
}

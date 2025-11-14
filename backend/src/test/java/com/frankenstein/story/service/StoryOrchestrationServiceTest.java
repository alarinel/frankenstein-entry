package com.frankenstein.story.service;

import com.frankenstein.story.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StoryOrchestrationServiceTest {

   @Mock
   private StoryGenerationService storyGenerationService;

   @Mock
   private ImageGenerationService imageGenerationService;

   @Mock
   private AudioGenerationService audioGenerationService;

   @Mock
   private ProgressNotificationService progressNotificationService;

   private StoryOrchestrationService service;

   @BeforeEach
   void setUp() {
      service = new StoryOrchestrationService(storyGenerationService, imageGenerationService, audioGenerationService, progressNotificationService);
   }

   @Test
   void generateCompleteStory_Success() throws Exception {
      // Given
      StoryInput input = StoryInput.builder()
                                   .characterName("Luna")
                                   .setting("enchanted forest")
                                   .villain("dark wizard")
                                   .specialItem("magic wand")
                                   .characterTrait("brave")
                                   .goal("save the forest")
                                   .timePeriod("medieval times")
                                   .mood("adventurous")
                                   .build();

      StoryStructure.PageStructure page1 = StoryStructure.PageStructure.builder()
                                                                       .pageNumber(1)
                                                                       .text("Luna entered the enchanted forest.")
                                                                       .imagePrompt("A brave girl entering a magical forest")
                                                                       .soundEffects(Arrays.asList("forest_ambience"))
                                                                       .mood("mysterious")
                                                                       .build();

      StoryStructure.PageStructure page2 = StoryStructure.PageStructure.builder()
                                                                       .pageNumber(2)
                                                                       .text("She found a magic wand.")
                                                                       .imagePrompt("A girl discovering a glowing wand")
                                                                       .soundEffects(Arrays.asList("magic_sparkle"))
                                                                       .mood("exciting")
                                                                       .build();

      StoryStructure storyStructure = StoryStructure.builder().title("Luna's Adventure").pages(Arrays.asList(page1, page2)).build();

      when(storyGenerationService.generateStory(input)).thenReturn(storyStructure);
      when(imageGenerationService.generateImage(anyString(), anyInt(), anyLong())).thenReturn(CompletableFuture.completedFuture("images/page-1.png"))
                                                                                  .thenReturn(CompletableFuture.completedFuture("images/page-2.png"));
      when(audioGenerationService.generateNarration(anyString(), anyInt())).thenReturn(CompletableFuture.completedFuture("audio/narration-1.mp3"))
                                                                           .thenReturn(CompletableFuture.completedFuture("audio/narration-2.mp3"));
      when(audioGenerationService.generateAllSoundEffects(anyList(), anyInt())).thenReturn(CompletableFuture.completedFuture(Arrays.asList(
            "audio/effect-1.mp3"))).thenReturn(CompletableFuture.completedFuture(Arrays.asList("audio/effect-2.mp3")));
      when(audioGenerationService.estimateAudioDuration(anyString())).thenReturn(5.0);

      // When
      String storyId = "test-story-id";
      Story result = service.generateCompleteStory(input, storyId);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(storyId);
      assertThat(result.getTitle()).isEqualTo("Luna's Adventure");
      assertThat(result.getStatus()).isEqualTo(StoryStatus.COMPLETED);
      assertThat(result.getPages()).hasSize(2);

      // Verify first page
      Story.StoryPage firstPage = result.getPages().get(0);
      assertThat(firstPage.getPageNumber()).isEqualTo(1);
      assertThat(firstPage.getText()).contains("Luna");
      assertThat(firstPage.getImageUrl()).isEqualTo("images/page-1.png");
      assertThat(firstPage.getNarrationUrl()).isEqualTo("audio/narration-1.mp3");

      // Verify services were called
      verify(storyGenerationService).generateStory(input);
      verify(imageGenerationService, times(2)).generateImage(anyString(), anyInt(), anyLong());
      verify(audioGenerationService, times(2)).generateNarration(anyString(), anyInt());
      verify(audioGenerationService, times(2)).generateAllSoundEffects(anyList(), anyInt());
      verify(progressNotificationService, atLeastOnce()).sendProgress(eq(storyId), any(GenerationProgress.class));
   }

   @Test
   void generateCompleteStory_SendsProgressUpdates() throws Exception {
      // Given
      StoryInput input = StoryInput.builder()
                                   .characterName("Luna")
                                   .setting("forest")
                                   .villain("wizard")
                                   .specialItem("wand")
                                   .characterTrait("brave")
                                   .goal("save forest")
                                   .timePeriod("medieval")
                                   .mood("adventurous")
                                   .build();

      StoryStructure.PageStructure page = StoryStructure.PageStructure.builder()
                                                                      .pageNumber(1)
                                                                      .text("Test text")
                                                                      .imagePrompt("Test prompt")
                                                                      .soundEffects(Arrays.asList("test_effect"))
                                                                      .mood("test")
                                                                      .build();

      StoryStructure storyStructure = StoryStructure.builder().title("Test Story").pages(Arrays.asList(page)).build();

      when(storyGenerationService.generateStory(input)).thenReturn(storyStructure);
      when(imageGenerationService.generateImage(anyString(), anyInt(), anyLong())).thenReturn(CompletableFuture.completedFuture("images/test.png"));
      when(audioGenerationService.generateNarration(anyString(), anyInt())).thenReturn(CompletableFuture.completedFuture("audio/test.mp3"));
      when(audioGenerationService.generateAllSoundEffects(anyList(), anyInt())).thenReturn(CompletableFuture.completedFuture(Arrays.asList(
            "audio/effect.mp3")));
      when(audioGenerationService.estimateAudioDuration(anyString())).thenReturn(5.0);

      // When
      service.generateCompleteStory(input, "test-id");

      // Then - Verify progress updates for each stage
      verify(progressNotificationService).sendProgress(eq("test-id"), argThat(progress -> progress.getStatus() == StoryStatus.GENERATING_STORY));
      verify(progressNotificationService).sendProgress(eq("test-id"), argThat(progress -> progress.getStatus() == StoryStatus.GENERATING_IMAGES));
      verify(progressNotificationService).sendProgress(eq("test-id"), argThat(progress -> progress.getStatus() == StoryStatus.GENERATING_AUDIO));
      verify(progressNotificationService).sendProgress(eq("test-id"), argThat(progress -> progress.getStatus() == StoryStatus.ASSEMBLING));
      verify(progressNotificationService).sendProgress(eq("test-id"), argThat(progress -> progress.getStatus() == StoryStatus.COMPLETED));
   }

   @Test
   void generateCompleteStory_WithStoryGenerationFailure_SendsFailedStatus() {
      // Given
      StoryInput input = StoryInput.builder()
                                   .characterName("Luna")
                                   .setting("forest")
                                   .villain("wizard")
                                   .specialItem("wand")
                                   .characterTrait("brave")
                                   .goal("save forest")
                                   .timePeriod("medieval")
                                   .mood("adventurous")
                                   .build();

      when(storyGenerationService.generateStory(input)).thenThrow(new RuntimeException("Story generation failed"));

      // When
      String storyId = "test-id";
      Story result = service.generateCompleteStory(input, storyId);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getStatus()).isEqualTo(StoryStatus.FAILED);
      assertThat(result.getErrorMessage()).isNotNull();

      verify(progressNotificationService).sendProgress(eq(storyId), argThat(progress -> progress.getStatus() == StoryStatus.FAILED));
   }

   @Test
   void generateCompleteStory_WithImageGenerationFailure_SendsFailedStatus() throws Exception {
      // Given
      StoryInput input = StoryInput.builder()
                                   .characterName("Luna")
                                   .setting("forest")
                                   .villain("wizard")
                                   .specialItem("wand")
                                   .characterTrait("brave")
                                   .goal("save forest")
                                   .timePeriod("medieval")
                                   .mood("adventurous")
                                   .build();

      StoryStructure.PageStructure page = StoryStructure.PageStructure.builder()
                                                                      .pageNumber(1)
                                                                      .text("Test")
                                                                      .imagePrompt("Test")
                                                                      .soundEffects(Arrays.asList("test"))
                                                                      .mood("test")
                                                                      .build();

      StoryStructure storyStructure = StoryStructure.builder().title("Test").pages(Arrays.asList(page)).build();

      when(storyGenerationService.generateStory(input)).thenReturn(storyStructure);
      when(imageGenerationService.generateImage(anyString(), anyInt(), anyLong())).thenReturn(CompletableFuture.failedFuture(new RuntimeException(
            "Image generation failed")));

      // When
      String storyId = "test-id";
      Story result = service.generateCompleteStory(input, storyId);

      // Then
      assertThat(result.getStatus()).isEqualTo(StoryStatus.FAILED);
      verify(progressNotificationService).sendProgress(eq(storyId), argThat(progress -> progress.getStatus() == StoryStatus.FAILED));
   }

   @Test
   void generateCompleteStory_CalculatesMetadataCorrectly() throws Exception {
      // Given
      StoryInput input = StoryInput.builder()
                                   .characterName("Luna")
                                   .setting("forest")
                                   .villain("wizard")
                                   .specialItem("wand")
                                   .characterTrait("brave")
                                   .goal("save forest")
                                   .timePeriod("medieval")
                                   .mood("adventurous")
                                   .build();

      List<StoryStructure.PageStructure> pages = Arrays.asList(createTestPage(1), createTestPage(2), createTestPage(3));

      StoryStructure storyStructure = StoryStructure.builder().title("Test Story").pages(pages).build();

      when(storyGenerationService.generateStory(input)).thenReturn(storyStructure);
      when(imageGenerationService.generateImage(anyString(), anyInt(), anyLong())).thenReturn(CompletableFuture.completedFuture("images/test.png"));
      when(audioGenerationService.generateNarration(anyString(), anyInt())).thenReturn(CompletableFuture.completedFuture("audio/test.mp3"));
      when(audioGenerationService.generateAllSoundEffects(anyList(), anyInt())).thenReturn(CompletableFuture.completedFuture(Arrays.asList(
            "audio/effect.mp3")));
      when(audioGenerationService.estimateAudioDuration(anyString())).thenReturn(5.0);

      // When
      Story result = service.generateCompleteStory(input, "test-id");

      // Then
      assertThat(result.getMetadata()).isNotNull();
      assertThat(result.getMetadata().getPageCount()).isEqualTo(3);
      assertThat(result.getMetadata().getEstimatedReadTime()).isNotNull();
      assertThat(result.getMetadata().getGeneratedAt()).isNotNull();
   }

   private StoryStructure.PageStructure createTestPage(int pageNumber) {
      return StoryStructure.PageStructure.builder()
                                         .pageNumber(pageNumber)
                                         .text("Page " + pageNumber + " text")
                                         .imagePrompt("Page " + pageNumber + " image")
                                         .soundEffects(Arrays.asList("effect_" + pageNumber))
                                         .mood("test")
                                         .build();
   }
}

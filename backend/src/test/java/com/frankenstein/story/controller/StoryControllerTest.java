package com.frankenstein.story.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStatus;
import com.frankenstein.story.service.StoryOrchestrationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StoryController.class)
class StoryControllerTest {

   @Autowired
   private MockMvc mockMvc;

   @Autowired
   private ObjectMapper objectMapper;

   @MockBean
   private StoryOrchestrationService orchestrationService;

   @Test
   void generateStory_WithValidInput_ReturnsAccepted() throws Exception {
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

      final Story mockStory = createMockStory("test-story-id", StoryStatus.PENDING);

      when(orchestrationService.generateCompleteStory(any(StoryInput.class), anyString())).thenAnswer(invocation -> {
         CompletableFuture.runAsync(() -> {
            // Simulate async generation
         });
         return mockStory;
      });

      // When/Then
      mockMvc.perform(post("/api/stories/generate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(input)))
             .andExpect(status().isAccepted())
             .andExpect(jsonPath("$.id").value("test-story-id"))
             .andExpect(jsonPath("$.status").value("PENDING"));

      verify(orchestrationService).generateCompleteStory(any(StoryInput.class), anyString());
   }

   @Test
   void generateStory_WithInvalidInput_ReturnsBadRequest() throws Exception {
      // Given - Missing required fields
      final StoryInput invalidInput = StoryInput.builder().characterName("") // Empty name
                                                .build();

      // When/Then
      mockMvc.perform(post("/api/stories/generate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(invalidInput)))
             .andExpect(status().isBadRequest());

      verify(orchestrationService, never()).generateCompleteStory(any(), anyString());
   }

   @Test
   void getStory_WithExistingId_ReturnsStory() throws Exception {
      // Given
      final String storyId = "existing-story-id";
      final Story mockStory = createMockStory(storyId, StoryStatus.COMPLETED);

      when(orchestrationService.getStory(storyId)).thenReturn(mockStory);

      // When/Then
      mockMvc.perform(get("/api/stories/{id}", storyId))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.id").value(storyId))
             .andExpect(jsonPath("$.status").value("COMPLETED"))
             .andExpect(jsonPath("$.title").value("Test Story"))
             .andExpect(jsonPath("$.pages").isArray())
             .andExpect(jsonPath("$.pages.length()").value(2));
   }

   @Test
   void getStory_WithNonExistentId_ReturnsNotFound() throws Exception {
      // Given
      final String nonExistentId = "non-existent-id";
      when(orchestrationService.getStory(nonExistentId)).thenReturn(null);

      // When/Then
      mockMvc.perform(get("/api/stories/{id}", nonExistentId)).andExpect(status().isNotFound());
   }

   @Test
   void getStoryStatus_WithExistingId_ReturnsStatus() throws Exception {
      // Given
      final String storyId = "test-id";
      final Story mockStory = createMockStory(storyId, StoryStatus.GENERATING_IMAGES);

      when(orchestrationService.getStory(storyId)).thenReturn(mockStory);

      // When/Then
      mockMvc.perform(get("/api/stories/{id}/status", storyId))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.status").value("GENERATING_IMAGES"))
             .andExpect(jsonPath("$.id").value(storyId));
   }

   @Test
   void getStoryStatus_WithFailedStory_ReturnsErrorMessage() throws Exception {
      // Given
      final String storyId = "failed-story-id";
      final Story mockStory = createMockStory(storyId, StoryStatus.FAILED);
      mockStory.setErrorMessage("Generation failed due to API error");

      when(orchestrationService.getStory(storyId)).thenReturn(mockStory);

      // When/Then
      mockMvc.perform(get("/api/stories/{id}/status", storyId))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.status").value("FAILED"))
             .andExpect(jsonPath("$.errorMessage").value("Generation failed due to API error"));
   }

   @Test
   void generateStory_WithCharacterNameTooLong_ReturnsBadRequest() throws Exception {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("A".repeat(100)) // Too long
                                         .setting("forest")
                                         .villain("wizard")
                                         .specialItem("wand")
                                         .characterTrait("brave")
                                         .goal("save forest")
                                         .timePeriod("medieval")
                                         .mood("adventurous")
                                         .build();

      // When/Then
      mockMvc.perform(post("/api/stories/generate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(input)))
             .andExpect(status().isBadRequest());
   }

   @Test
   void generateStory_WithNullValues_ReturnsBadRequest() throws Exception {
      // Given
      final StoryInput input = StoryInput.builder()
                                         .characterName("Luna")
                                         .setting(null) // Null setting
                                         .villain("wizard")
                                         .specialItem("wand")
                                         .characterTrait("brave")
                                         .goal("save forest")
                                         .timePeriod("medieval")
                                         .mood("adventurous")
                                         .build();

      // When/Then
      mockMvc.perform(post("/api/stories/generate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(input)))
             .andExpect(status().isBadRequest());
   }

   private Story createMockStory(final String id, final StoryStatus status) {
      final Story story = new Story();
      story.setId(id);
      story.setTitle("Test Story");
      story.setStatus(status);

      final Story.StoryPage page1 = new Story.StoryPage();
      page1.setPageNumber(1);
      page1.setText("Page 1 text");
      page1.setImageUrl("images/page-1.png");
      page1.setNarrationUrl("audio/narration-1.mp3");
      page1.setDuration(5.0);

      final Story.StoryPage page2 = new Story.StoryPage();
      page2.setPageNumber(2);
      page2.setText("Page 2 text");
      page2.setImageUrl("images/page-2.png");
      page2.setNarrationUrl("audio/narration-2.mp3");
      page2.setDuration(5.0);

      story.setPages(Arrays.asList(page1, page2));

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
      story.setInput(input);

      final Story.StoryMetadata metadata = new Story.StoryMetadata();
      metadata.setPageCount(2);
      metadata.setEstimatedReadTime("10 seconds");
      metadata.setGeneratedAt(LocalDateTime.now());
      story.setMetadata(metadata);

      return story;
   }
}

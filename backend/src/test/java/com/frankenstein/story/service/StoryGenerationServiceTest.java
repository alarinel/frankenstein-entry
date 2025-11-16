package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.exception.StoryGenerationException;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStructure;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StoryGenerationServiceTest {

   @Mock
   private AnthropicChatModel chatModel;

   @Mock
   private ChatResponse chatResponse;

   @Mock
   private Generation generation;

   private ObjectMapper objectMapper;
   private StoryGenerationService service;

   @BeforeEach
   void setUp() {
      objectMapper = new ObjectMapper();
      service = new StoryGenerationService(chatModel, objectMapper, 8);
   }

   @Test
   void generateStory_Success() {
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

      final String mockResponse = """
                                  ```json
                                  {
                                    "title": "Luna's Magical Adventure",
                                    "pages": [
                                      {
                                        "pageNumber": 1,
                                        "text": "Luna lived in an enchanted forest.",
                                        "imagePrompt": "A brave young girl in a magical forest",
                                        "soundEffects": ["forest_ambience"],
                                        "mood": "peaceful"
                                      }
                                    ]
                                  }
                                  ```
                                  """;

      when(chatModel.call(any(Prompt.class))).thenReturn(chatResponse);
      when(chatResponse.getResult()).thenReturn(generation);
      when(generation.getOutput()).thenReturn(new org.springframework.ai.chat.messages.AssistantMessage(mockResponse));

      // When
      final StoryStructure result = service.generateStory(input);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getTitle()).isEqualTo("Luna's Magical Adventure");
      assertThat(result.getPages()).hasSize(1);
      assertThat(result.getPages().get(0).getText()).contains("Luna");

      verify(chatModel).call(any(Prompt.class));
   }

   @Test
   void generateStory_WithInvalidJson_ThrowsException() {
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

      final String invalidResponse = "This is not valid JSON";

      when(chatModel.call(any(Prompt.class))).thenReturn(chatResponse);
      when(chatResponse.getResult()).thenReturn(generation);
      when(generation.getOutput()).thenReturn(new org.springframework.ai.chat.messages.AssistantMessage(invalidResponse));

      // When/Then
      assertThatThrownBy(() -> service.generateStory(input)).isInstanceOf(StoryGenerationException.class)
                                                            .hasMessageContaining("Failed to parse AI response");
   }

   @Test
   void generateStory_WithChatModelException_ThrowsException() {
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

      when(chatModel.call(any(Prompt.class))).thenThrow(new RuntimeException("API Error"));

      // When/Then
      assertThatThrownBy(() -> service.generateStory(input)).isInstanceOf(StoryGenerationException.class)
                                                            .hasMessageContaining("Story generation failed");
   }

   @Test
   void generateStory_BuildsCorrectPrompt() {
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

      final String mockResponse = """
                                  {
                                    "title": "Test Story",
                                    "pages": []
                                  }
                                  """;

      when(chatModel.call(any(Prompt.class))).thenReturn(chatResponse);
      when(chatResponse.getResult()).thenReturn(generation);
      when(generation.getOutput()).thenReturn(new org.springframework.ai.chat.messages.AssistantMessage(mockResponse));

      // When
      service.generateStory(input);

      // Then
      final ArgumentCaptor<Prompt> promptCaptor = ArgumentCaptor.forClass(Prompt.class);
      verify(chatModel).call(promptCaptor.capture());

      final String promptContent = promptCaptor.getValue().getContents();
      assertThat(promptContent).contains("Luna");
      assertThat(promptContent).contains("enchanted forest");
      assertThat(promptContent).contains("dark wizard");
      assertThat(promptContent).contains("magic wand");
   }
}

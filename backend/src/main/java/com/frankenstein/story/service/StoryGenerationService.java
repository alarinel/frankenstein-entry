package com.frankenstein.story.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.exception.StoryGenerationException;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryStructure;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Service for generating story structure using Claude (Anthropic)
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
public class StoryGenerationService {

   private static final int SEED_MIN = 1000;
   private static final int SEED_MAX = 9999;
   private static final int MAX_INPUT_LENGTH = 500;
   private static final Pattern JSON_CODE_BLOCK_PATTERN = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)```");

   private final AnthropicChatModel chatModel;
   private final ObjectMapper objectMapper;
   private final int defaultPages;
   private final SecureRandom random;

   public StoryGenerationService(final AnthropicChatModel chatModel, final ObjectMapper objectMapper,
                                 @Value("${generation.default-pages}") final int defaultPages) {
      this.chatModel = chatModel;
      this.objectMapper = objectMapper;
      this.defaultPages = defaultPages;
      this.random = new SecureRandom();
   }

   public StoryStructure generateStory(final StoryInput input) {
      log.info("Generating story for character: {}", input.getCharacterName());

      validateInput(input);

      try {
         final String prompt = buildPrompt(input);
         final ChatResponse response = chatModel.call(new Prompt(prompt));
         final String content = response.getResult().getOutput().getContent();

         log.debug("Claude response: {}", content);

         final String jsonContent = extractJson(content);
         final StoryStructure structure = objectMapper.readValue(jsonContent, StoryStructure.class);

         log.info("Successfully generated story: {} with {} pages", structure.getTitle(), structure.getPages().size());

         return structure;
      } catch (final JsonProcessingException e) {
         log.error("Failed to parse story structure from Claude response", e);
         throw new StoryGenerationException("Failed to parse AI response into story structure", e);
      } catch (final IllegalArgumentException e) {
         log.error("Invalid input provided: {}", e.getMessage());
         throw new StoryGenerationException("Invalid story input: " + e.getMessage(), e);
      } catch (final Exception e) {
         log.error("Unexpected error during story generation", e);
         throw new StoryGenerationException("Story generation failed: " + e.getMessage(), e);
      }
   }

   private void validateInput(final StoryInput input) {
      validateField(input.getCharacterName(), "Character name");
      validateField(input.getSetting(), "Setting");
      validateField(input.getVillain(), "Villain");
      validateField(input.getSpecialItem(), "Special item");
      validateField(input.getCharacterTrait(), "Character trait");
      validateField(input.getGoal(), "Goal");
      validateField(input.getTimePeriod(), "Time period");
      validateField(input.getMood(), "Mood");
   }

   private void validateField(final String value, final String fieldName) {
      if (value == null || value.isBlank()) {
         throw new IllegalArgumentException(fieldName + " cannot be empty");
      }
      if (value.length() > MAX_INPUT_LENGTH) {
         throw new IllegalArgumentException(fieldName + " exceeds maximum length of " + MAX_INPUT_LENGTH);
      }
   }

   private String buildPrompt(final StoryInput input) {
      final int randomSeed = SEED_MIN + random.nextInt(SEED_MAX - SEED_MIN + 1);

      return String.format(PROMPT_TEMPLATE,
            sanitizeInput(input.getCharacterName()),
            sanitizeInput(input.getSetting()),
            sanitizeInput(input.getVillain()),
            sanitizeInput(input.getSpecialItem()),
            sanitizeInput(input.getCharacterTrait()),
            sanitizeInput(input.getGoal()),
            sanitizeInput(input.getTimePeriod()),
            sanitizeInput(input.getMood()),
            defaultPages,
            randomSeed);
   }

   private String sanitizeInput(final String input) {
      // Remove potential prompt injection attempts and normalize whitespace
      return input.replaceAll("[\\r\\n]+", " ").trim();
   }

   private static final String PROMPT_TEMPLATE = """
                                                 You are a creative children's story writer. Generate an engaging, age-appropriate children's story with the following elements:
                                                 
                                                 Story Elements:
                                                 - Main Character: %s
                                                 - Setting: %s
                                                 - Villain/Antagonist: %s
                                                 - Special Item: %s
                                                 - Character Trait: %s
                                                 - Adventure Goal: %s
                                                 - Time Period: %s
                                                 - Overall Mood: %s
                                                 
                                                 Requirements:
                                                 1. Create exactly %d pages
                                                 2. Each page should have 2-3 sentences of story text (child-friendly, engaging)
                                                 3. For each page, provide a detailed image prompt optimized for Stability AI's SDXL model
                                                 4. For each page, list 1-3 sound effects that would enhance that scene
                                                 5. Specify the mood/atmosphere for each page
                                                 6. Make the story have a clear beginning, middle, and satisfying ending
                                                 7. Keep language appropriate for children ages 5-10
                                                 
                                                 Image Prompt Guidelines:
                                                 - Be very specific and detailed
                                                 - Include art style (e.g., "fantasy art", "watercolor", "digital painting")
                                                 - Describe lighting, colors, composition
                                                 - Mention the character by name and appearance
                                                 - Keep prompts focused and coherent
                                                 
                                                 Sound Effect Guidelines:
                                                 - Use simple, descriptive names (e.g., "thunder_rumble", "door_creak", "magic_sparkle")
                                                 - Choose effects that match the scene's action
                                                 
                                                 Return your response as a JSON object with this EXACT structure:
                                                 {
                                                   "title": "The Story Title",
                                                   "imageSeed": %d,
                                                   "pages": [
                                                     {
                                                       "pageNumber": 1,
                                                       "text": "The story text for this page...",
                                                       "imagePrompt": "Detailed prompt for Stability AI...",
                                                       "soundEffects": ["effect1", "effect2"],
                                                       "mood": "mysterious"
                                                     }
                                                   ]
                                                 }
                                                 
                                                 IMPORTANT: Return ONLY the JSON object, no additional text before or after.
                                                 """;

   private String extractJson(String content) {
      if (content == null || content.isBlank()) {
         throw new StoryGenerationException("Received empty response from Claude");
      }

      content = content.trim();

      // Try to extract JSON from markdown code blocks using regex
      final Matcher matcher = JSON_CODE_BLOCK_PATTERN.matcher(content);
      if (matcher.find()) {
         return matcher.group(1).trim();
      }

      // If no code blocks found, assume the entire content is JSON
      return content;
   }
}

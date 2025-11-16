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
                                                 You are a master children's story writer in the tradition of classic fairy tales. Create a rich, engaging story with the following elements:
                                                 
                                                 Story Elements:
                                                 - Main Character: %s
                                                 - Setting: %s
                                                 - Villain/Antagonist: %s
                                                 - Special Item: %s
                                                 - Character Trait: %s
                                                 - Adventure Goal: %s
                                                 - Time Period: %s
                                                 - Overall Mood: %s
                                                 
                                                 Story Structure (Classic Fairy Tale Format):
                                                 Follow this proven narrative arc across exactly %d pages:
                                                 
                                                 1. INTRODUCTION (Pages 1-2): Establish the character, their world, and what makes them special. Use phrases like "Once upon a time" or "Long ago." Show their ordinary life and relationships. Introduce the special item naturally.
                                                 
                                                 2. CALL TO ADVENTURE (Page 3): Present the goal/quest and why it matters. Show what's at stake. The character decides to embark on their journey.
                                                 
                                                 3. JOURNEY & CHALLENGES (Pages 4-5): The character travels through the setting, encounters obstacles, and meets the villain. Show how their special trait helps them. Build tension and suspense.
                                                 
                                                 4. CLIMAX (Page 6): The confrontation with the villain. The character uses their trait and special item cleverly. The most exciting moment of the story.
                                                 
                                                 5. RESOLUTION (Page 7): The immediate aftermath. The villain is defeated, the goal is achieved. Show the character's growth.
                                                 
                                                 6. HAPPY ENDING (Page 8): Return home or new beginning. Lessons learned. End with "happily ever after" or similar closure. Show how the character has changed.
                                                 
                                                 Writing Guidelines:
                                                 - Use rich, descriptive language with sensory details (sights, sounds, feelings)
                                                 - Include dialogue to bring characters to life
                                                 - Each page should have 3-5 sentences (not just 2-3) to allow proper storytelling
                                                 - Use varied sentence structure and pacing
                                                 - Show emotions and reactions, not just actions
                                                 - Create memorable, quotable moments
                                                 - Build atmosphere and mood through description
                                                 - Make the villain interesting and the hero relatable
                                                 - Age-appropriate for children 5-10, but don't talk down to them
                                                 
                                                 Image Prompt Guidelines:
                                                 - Highly detailed and specific for Stability AI SDXL
                                                 - Include: art style (storybook illustration, watercolor, digital painting), lighting (warm sunset, moonlight, bright morning), colors, composition, character appearance and expression
                                                 - Describe the scene's emotional tone visually
                                                 - Maintain visual consistency across pages (same character appearance, art style)
                                                 - Example: "Storybook watercolor illustration of [character name], a brave young [description], standing in [setting] with [lighting]. [Character] wears [clothing] and holds [item]. [Mood] atmosphere with [colors]. Fantasy art style, detailed, child-friendly."
                                                 
                                                 Sound Effect Guidelines:
                                                 - 1-3 effects per page that enhance immersion
                                                 - Use descriptive names: "thunder_rumble", "door_creak", "magic_sparkle", "footsteps_forest", "wind_howling"
                                                 - Match the scene's action and mood
                                                 
                                                 Return your response as a JSON object with this EXACT structure:
                                                 {
                                                   "title": "The Story Title",
                                                   "imageSeed": %d,
                                                   "pages": [
                                                     {
                                                       "pageNumber": 1,
                                                       "text": "The story text for this page (3-5 sentences with rich detail)...",
                                                       "imagePrompt": "Highly detailed prompt for Stability AI SDXL...",
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

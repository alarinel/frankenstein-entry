package com.frankenstein.story.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.exception.StoryGenerationException;
import com.frankenstein.story.model.ApiCallLog;
import com.frankenstein.story.model.StoryInput;
import com.frankenstein.story.model.StoryOutline;
import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.service.tracking.ApiTrackingFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.chat.metadata.Usage;
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
@RequiredArgsConstructor
public class StoryGenerationService {

   private static final int SEED_MIN = 1000;
   private static final int SEED_MAX = 9999;
   private static final int MAX_INPUT_LENGTH = 500;
   private static final Pattern JSON_CODE_BLOCK_PATTERN = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)```");

   private final AnthropicChatModel chatModel;
   private final ObjectMapper objectMapper;
   private final ApiTrackingFacade apiTrackingFacade;
   private final SecureRandom random = new SecureRandom();

   @Value("${generation.default-pages}")
   private int defaultPages;

   /**
    * Phase 1: Generate story outline with theme integration
    *
    * @param storyId Story ID for tracking
    * @param input   Story input with theme and character details
    * @return StoryOutline with narrative structure
    */
   public StoryOutline generateOutline(final String storyId, final StoryInput input) {
      log.info("Generating story outline for character: {} with theme: {}", input.getCharacterName(), input.getTheme());

      validateInput(input);

      final long startTime = System.currentTimeMillis();

      try {
         final String prompt = buildOutlinePrompt(input);
         final ChatResponse response = chatModel.call(new Prompt(prompt));
         final String content = response.getResult().getOutput().getContent();

         log.debug("Claude outline response: {}", content);

         final String jsonContent = extractJson(content);
         final StoryOutline outline = objectMapper.readValue(jsonContent, StoryOutline.class);

         // Log API call
         logApiCall(storyId, "OUTLINE_GENERATION", response, startTime, "SUCCESS", null);

         log.info("Successfully generated outline: {} with {} target pages (theme: {})",
               outline.getTitle(),
               outline.getTargetPages(),
               outline.getTheme());

         return outline;
      } catch (final JsonProcessingException e) {
         logApiCall(storyId, "OUTLINE_GENERATION", null, startTime, "FAILED", e.getMessage());
         log.error("Failed to parse story outline from Claude response", e);
         throw new StoryGenerationException("Failed to parse AI response into story outline", e);
      } catch (final IllegalArgumentException e) {
         log.error("Invalid input provided: {}", e.getMessage());
         throw new StoryGenerationException("Invalid story input: " + e.getMessage(), e);
      } catch (final Exception e) {
         logApiCall(storyId, "OUTLINE_GENERATION", null, startTime, "FAILED", e.getMessage());
         log.error("Unexpected error during outline generation", e);
         throw new StoryGenerationException("Outline generation failed: " + e.getMessage(), e);
      }
   }

   /**
    * Phase 2: Generate full story from outline with modern writing style
    *
    * @param storyId Story ID for tracking
    * @param input   Story input with theme and character details
    * @param outline Story outline from Phase 1
    * @return StoryStructure with complete story pages
    */
   public StoryStructure generateFullStory(final String storyId, final StoryInput input, final StoryOutline outline) {
      log.info("Generating full story from outline: {} ({} target pages)", outline.getTitle(), outline.getTargetPages());

      final long startTime = System.currentTimeMillis();

      try {
         final String prompt = buildFullStoryPrompt(input, outline);
         final ChatResponse response = chatModel.call(new Prompt(prompt));
         final String content = response.getResult().getOutput().getContent();

         log.debug("Claude full story response: {}", content);

         final String jsonContent = extractJson(content);
         final StoryStructure structure = objectMapper.readValue(jsonContent, StoryStructure.class);

         // Validate page count is between 10-15
         final int pageCount = structure.getPages().size();
         if (pageCount < 10 || pageCount > 15) {
            log.warn("Generated story has {} pages, outside target range of 10-15 pages", pageCount);
         }

         // Log API call
         logApiCall(storyId, "STORY_GENERATION", response, startTime, "SUCCESS", null);

         log.info("Successfully generated full story: {} with {} pages", structure.getTitle(), pageCount);

         return structure;
      } catch (final JsonProcessingException e) {
         logApiCall(storyId, "STORY_GENERATION", null, startTime, "FAILED", e.getMessage());
         log.error("Failed to parse story structure from Claude response", e);
         throw new StoryGenerationException("Failed to parse AI response into story structure", e);
      } catch (final Exception e) {
         logApiCall(storyId, "STORY_GENERATION", null, startTime, "FAILED", e.getMessage());
         log.error("Unexpected error during full story generation", e);
         throw new StoryGenerationException("Full story generation failed: " + e.getMessage(), e);
      }
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
      validateField(input.getTheme(), "Theme");
      validateField(input.getVoiceType(), "Voice type");
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

   private String buildOutlinePrompt(final StoryInput input) {
      final int randomSeed = SEED_MIN + random.nextInt(SEED_MAX - SEED_MIN + 1);

      return String.format(OUTLINE_PROMPT_TEMPLATE,
            sanitizeInput(input.getTheme()),
            sanitizeInput(input.getTheme()),
            sanitizeInput(input.getCharacterName()),
            sanitizeInput(input.getSetting()),
            sanitizeInput(input.getVillain()),
            sanitizeInput(input.getSpecialItem()),
            sanitizeInput(input.getCharacterTrait()),
            sanitizeInput(input.getGoal()),
            sanitizeInput(input.getTimePeriod()),
            sanitizeInput(input.getMood()),
            randomSeed);
   }

   private String buildFullStoryPrompt(final StoryInput input, final StoryOutline outline) {
      try {
         // Serialize outline to JSON for context
         final String outlineJson = objectMapper.writeValueAsString(outline);

         return String.format(FULL_STORY_PROMPT_TEMPLATE,
               outline.getTargetPages(),
               outlineJson,
               outline.getBeginning().getPageCount(),
               outline.getBeginning().getSummary(),
               outline.getBeginning().getPageCount() + 1,
               outline.getBeginning().getPageCount() + outline.getMiddle().getPageCount(),
               outline.getMiddle().getSummary(),
               outline.getEnd().getPageCount(),
               outline.getEnd().getSummary());
      } catch (final JsonProcessingException e) {
         log.error("Failed to serialize outline to JSON", e);
         throw new StoryGenerationException("Failed to build full story prompt", e);
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

   /**
    * Enhance image prompt with left-third composition guidance for 3D book display
    *
    * @param prompt Original image prompt
    * @return Enhanced prompt with composition guidance
    */
   private String enhancePromptWithComposition(final String prompt) {
      final String compositionGuidance = "Composition: focal point positioned in the left 35% of the frame, " + "subject on the left side of the image, " + "main character or object left of center. ";

      return compositionGuidance + prompt;
   }

   private static final String OUTLINE_PROMPT_TEMPLATE = """
                                                         You are a master children's story architect. Create a detailed story outline that teaches an important life lesson.
                                                         
                                                         Story Elements:
                                                         - Moral Theme/Lesson: %s (This is the CORE MESSAGE - weave it throughout the story)
                                                         - Character: %s
                                                         - Setting: %s
                                                         - Villain: %s
                                                         - Special Item: %s
                                                         - Character Trait: %s
                                                         - Goal: %s
                                                         - Time Period: %s
                                                         - Mood: %s
                                                         
                                                         Create an outline for a 10-15 page story with:
                                                         1. Beginning (2-3 pages): Character introduction, world-building, inciting incident that relates to the moral theme
                                                         2. Middle (6-9 pages): Journey where the character learns and grows, challenges that test the moral lesson, character development
                                                         3. End (2-3 pages): Climax where the moral lesson is applied, resolution showing character growth and understanding
                                                         
                                                         CRITICAL: The moral theme should be:
                                                         - Naturally woven into the plot (not preachy)
                                                         - Demonstrated through character actions and consequences
                                                         - Reinforced in the resolution
                                                         - Age-appropriate and relatable for children
                                                         
                                                         Include:
                                                         - Detailed character profiles (protagonist, antagonist, supporting characters)
                                                         - Key events for each section that support the moral theme
                                                         - Narrative arc with clear beginning, middle, end
                                                         - Conflict and resolution strategy that teaches the lesson
                                                         - Emotional beats and pacing
                                                         
                                                         Return your response as a JSON object with this EXACT structure:
                                                         {
                                                           "title": "The Story Title",
                                                           "theme": "%s",
                                                           "targetPages": 12,
                                                           "beginning": {
                                                             "summary": "Brief summary of beginning section",
                                                             "keyEvents": ["Event 1", "Event 2"],
                                                             "pageCount": 3
                                                           },
                                                           "middle": {
                                                             "summary": "Brief summary of middle section",
                                                             "keyEvents": ["Event 1", "Event 2", "Event 3"],
                                                             "conflict": "Main conflict description",
                                                             "pageCount": 7
                                                           },
                                                           "end": {
                                                             "summary": "Brief summary of ending",
                                                             "keyEvents": ["Event 1", "Event 2"],
                                                             "resolution": "How conflict is resolved",
                                                             "pageCount": 2
                                                           },
                                                           "characters": [
                                                             {
                                                               "name": "Character Name",
                                                               "role": "protagonist",
                                                               "appearance": "Physical description",
                                                               "personality": "Personality traits"
                                                             }
                                                           ],
                                                           "narrativeArc": "Overall story arc description",
                                                           "imageSeed": %d
                                                         }
                                                         
                                                         IMPORTANT: Return ONLY the JSON object, no additional text before or after.
                                                         """;

   private static final String FULL_STORY_PROMPT_TEMPLATE = """
                                                            You are a master children's story writer. Using the outline below, write a complete %d-page story.
                                                            
                                                            [OUTLINE CONTEXT]
                                                            %s
                                                            
                                                            Writing Style Requirements:
                                                            - SHORT, PUNCHY sentences (modern children's book style)
                                                            - DIALOGUE-DRIVEN: Include conversations between characters
                                                            - CHARACTER INTERACTION: Show relationships and emotions
                                                            - ACTIVE VOICE: Characters do things, don't just observe
                                                            - SENSORY DETAILS: What characters see, hear, feel
                                                            - 2-4 sentences per page (concise, impactful)
                                                            - Age-appropriate for 5-10 years old
                                                            
                                                            Story Structure:
                                                            - Pages 1-%d: %s
                                                            - Pages %d-%d: %s
                                                            - Final %d pages: %s
                                                            
                                                            Image Prompt Requirements:
                                                            - CRITICAL: Position focal points in the LEFT 35%% of the image
                                                            - Use phrases: "subject on the left side", "focal point left of center", "character positioned left"
                                                            - Detailed descriptions for Stability AI SDXL
                                                            - Consistent character appearance across all pages
                                                            - Art style: storybook illustration, watercolor, digital painting
                                                            
                                                            Return JSON with: {title, imageSeed, pages: [{pageNumber, text, imagePrompt, soundEffects, mood}]}
                                                            
                                                            IMPORTANT: Return ONLY the JSON object, no additional text before or after.
                                                            """;

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
                                                 
                                                 Background Music Guidelines:
                                                 - Choose ONE music type per page that matches the scene's energy and mood
                                                 - Options: "scary" (tense/mysterious), "action" (exciting/battle), "awesome" (triumphant/magical), "journey" (adventure/travel)
                                                 - Match the scene's pacing and emotional tone
                                                 
                                                 Return your response as a JSON object with this EXACT structure:
                                                 {
                                                   "title": "The Story Title",
                                                   "imageSeed": %d,
                                                   "pages": [
                                                     {
                                                       "pageNumber": 1,
                                                       "text": "The story text for this page (3-5 sentences with rich detail)...",
                                                       "imagePrompt": "Highly detailed prompt for Stability AI SDXL...",
                                                       "backgroundMusic": "scary",
                                                       "mood": "mysterious"
                                                     }
                                                   ]
                                                 }
                                                 
                                                 CRITICAL: backgroundMusic must be one of: "scary", "action", "awesome", or "journey"
                                                 
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

   /**
    * Log API call to tracking system
    */
   private void logApiCall(final String storyId, final String operation, final ChatResponse response, final long startTime, final String status, final String errorMessage) {
      try {
         final long duration = System.currentTimeMillis() - startTime;

         int inputTokens = 0;
         int outputTokens = 0;
         double cost = 0.0;

         if (response != null && response.getMetadata() != null && response.getMetadata().getUsage() != null) {
            final Usage usage = response.getMetadata().getUsage();
            inputTokens = usage.getPromptTokens().intValue();
            outputTokens = usage.getGenerationTokens().intValue();
            cost = apiTrackingFacade.calculateStoryGenerationCost(inputTokens, outputTokens);
         }

         final ApiCallLog log = ApiCallLog.builder()
                                          .storyId(storyId)
                                          .apiProvider("ANTHROPIC")
                                          .operation(operation)
                                          .tokensUsed(inputTokens + outputTokens)
                                          .costUsd(cost)
                                          .durationMs(duration)
                                          .status(status)
                                          .errorMessage(errorMessage)
                                          .build();

         apiTrackingFacade.logApiCall(log);
      } catch (final Exception e) {
         log.error("Failed to log API call", e);
      }
   }
}

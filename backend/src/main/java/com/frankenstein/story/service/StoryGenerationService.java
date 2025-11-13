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
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Service for generating story structure using Claude (Anthropic)
 */
@Slf4j
@Service
public class StoryGenerationService {

    private final AnthropicChatModel chatModel;
    private final ObjectMapper objectMapper;
    private final int defaultPages;
    private final Random random = new Random();

    public StoryGenerationService(
            AnthropicChatModel chatModel,
            ObjectMapper objectMapper,
            @Value("${generation.default-pages}") int defaultPages) {
        this.chatModel = chatModel;
        this.objectMapper = objectMapper;
        this.defaultPages = defaultPages;
    }

    public StoryStructure generateStory(StoryInput input) {
        log.info("Generating story for character: {}", input.getCharacterName());

        try {
            String prompt = buildPrompt(input);
            ChatResponse response = chatModel.call(new Prompt(prompt));
            String content = response.getResult().getOutput().getContent();

            log.debug("Claude response: {}", content);

            // Extract JSON from the response (Claude might wrap it in markdown)
            String jsonContent = extractJson(content);

            StoryStructure structure = objectMapper.readValue(jsonContent, StoryStructure.class);
            log.info("Successfully generated story: {} with {} pages",
                    structure.getTitle(), structure.getPages().size());

            return structure;
        } catch (JsonProcessingException e) {
            log.error("Failed to parse story structure", e);
            throw new StoryGenerationException("Failed to parse AI response", e);
        } catch (Exception e) {
            log.error("Story generation failed", e);
            throw new StoryGenerationException("Story generation failed", e);
        }
    }

    private String buildPrompt(StoryInput input) {
        String template = """
                You are a creative children's story writer. Generate an engaging, age-appropriate children's story with the following elements:

                Story Elements:
                - Main Character: {characterName}
                - Setting: {setting}
                - Villain/Antagonist: {villain}
                - Special Item: {specialItem}
                - Character Trait: {characterTrait}
                - Adventure Goal: {goal}
                - Time Period: {timePeriod}
                - Overall Mood: {mood}

                Requirements:
                1. Create exactly {pageCount} pages
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
                ```json
                {
                  "title": "The Story Title",
                  "imageSeed": {randomSeed},
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
                ```

                IMPORTANT: Return ONLY the JSON object, no additional text before or after.
                """;

        Map<String, Object> variables = new HashMap<>();
        variables.put("characterName", input.getCharacterName());
        variables.put("setting", input.getSetting());
        variables.put("villain", input.getVillain());
        variables.put("specialItem", input.getSpecialItem());
        variables.put("characterTrait", input.getCharacterTrait());
        variables.put("goal", input.getGoal());
        variables.put("timePeriod", input.getTimePeriod());
        variables.put("mood", input.getMood());
        variables.put("pageCount", defaultPages);
        variables.put("randomSeed", 1000 + random.nextInt(9000)); // 1000-9999

        PromptTemplate promptTemplate = new PromptTemplate(template);
        return promptTemplate.create(variables).getContents();
    }

    private String extractJson(String content) {
        // Remove markdown code blocks if present
        content = content.trim();
        if (content.startsWith("```json")) {
            content = content.substring(7);
        } else if (content.startsWith("```")) {
            content = content.substring(3);
        }
        if (content.endsWith("```")) {
            content = content.substring(0, content.length() - 3);
        }
        return content.trim();
    }
}

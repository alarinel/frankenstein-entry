package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.exception.StoryGenerationException;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Service for generating audio using ElevenLabs
 */
@Slf4j
@Service
public class AudioGenerationService {

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String voiceId;
    private final double stability;
    private final double similarityBoost;

    public AudioGenerationService(
            OkHttpClient httpClient,
            ObjectMapper objectMapper,
            @Value("${api.elevenlabs.key}") String apiKey,
            @Value("${api.elevenlabs.url}") String apiUrl,
            @Value("${api.elevenlabs.voice-id}") String voiceId,
            @Value("${api.elevenlabs.stability}") double stability,
            @Value("${api.elevenlabs.similarity-boost}") double similarityBoost) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.voiceId = voiceId;
        this.stability = stability;
        this.similarityBoost = similarityBoost;
    }

    public CompletableFuture<byte[]> generateNarration(String text) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Generating narration for text: {}...", text.substring(0, Math.min(50, text.length())));

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("text", text);
                requestBody.put("model_id", "eleven_monolingual_v1");
                requestBody.put("voice_settings", Map.of(
                        "stability", stability,
                        "similarity_boost", similarityBoost
                ));

                RequestBody body = RequestBody.create(
                        objectMapper.writeValueAsString(requestBody),
                        MediaType.parse("application/json")
                );

                String url = String.format("%s/text-to-speech/%s", apiUrl, voiceId);

                Request request = new Request.Builder()
                        .url(url)
                        .addHeader("xi-api-key", apiKey)
                        .addHeader("Accept", "audio/mpeg")
                        .post(body)
                        .build();

                try (Response response = httpClient.newCall(request).execute()) {
                    if (!response.isSuccessful()) {
                        String errorBody = response.body() != null ? response.body().string() : "No error body";
                        log.error("ElevenLabs TTS error: {} - {}", response.code(), errorBody);
                        throw new StoryGenerationException("TTS generation failed: " + response.code());
                    }

                    byte[] audioData = response.body().bytes();
                    log.debug("Successfully generated narration ({} bytes)", audioData.length);
                    return audioData;
                }
            } catch (IOException e) {
                log.error("Failed to generate narration", e);
                throw new StoryGenerationException("Narration generation failed", e);
            }
        });
    }

    public CompletableFuture<byte[]> generateSoundEffect(String effectDescription) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Generating sound effect: {}", effectDescription);

                // For now, we'll use TTS to generate a description of the sound
                // In a real implementation, you might use a dedicated sound effects API
                // or have pre-recorded sound effects

                // ElevenLabs has a sound effects API in beta, but for this demo
                // we'll use a simplified approach
                String soundText = convertEffectNameToDescription(effectDescription);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("text", soundText);
                requestBody.put("model_id", "eleven_monolingual_v1");

                // Use different voice settings for effects (more dramatic)
                requestBody.put("voice_settings", Map.of(
                        "stability", 0.3,
                        "similarity_boost", 0.5
                ));

                RequestBody body = RequestBody.create(
                        objectMapper.writeValueAsString(requestBody),
                        MediaType.parse("application/json")
                );

                String url = String.format("%s/text-to-speech/%s", apiUrl, voiceId);

                Request request = new Request.Builder()
                        .url(url)
                        .addHeader("xi-api-key", apiKey)
                        .addHeader("Accept", "audio/mpeg")
                        .post(body)
                        .build();

                try (Response response = httpClient.newCall(request).execute()) {
                    if (!response.isSuccessful()) {
                        String errorBody = response.body() != null ? response.body().string() : "No error body";
                        log.error("ElevenLabs sound effect error: {} - {}", response.code(), errorBody);
                        // Return empty audio instead of failing
                        return new byte[0];
                    }

                    byte[] audioData = response.body().bytes();
                    log.debug("Successfully generated sound effect ({} bytes)", audioData.length);
                    return audioData;
                }
            } catch (IOException e) {
                log.warn("Failed to generate sound effect: {}", effectDescription, e);
                // Return empty audio instead of failing
                return new byte[0];
            }
        });
    }

    private String convertEffectNameToDescription(String effectName) {
        // Convert snake_case effect names to spoken descriptions
        // This is a simplified approach - in production, you'd use actual sound effects
        return effectName.replace("_", " ");
    }

    public double estimateNarrationDuration(String text) {
        // Rough estimate: average reading speed is about 150 words per minute
        // which is about 2.5 words per second
        int wordCount = text.split("\\s+").length;
        return wordCount / 2.5;
    }
}

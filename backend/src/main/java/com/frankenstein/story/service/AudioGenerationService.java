package com.frankenstein.story.service;

import com.frankenstein.story.exception.AudioGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Service for generating audio using ElevenLabs TTS API
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AudioGenerationService {

   private final RestClient.Builder restClientBuilder;

   @Value("${api.elevenlabs.key}")
   private String apiKey;

   @Value("${api.elevenlabs.url}")
   private String apiUrl;

   @Value("${api.elevenlabs.voice-id}")
   private String voiceId;

   @Value("${api.elevenlabs.stability}")
   private double stability;

   @Value("${api.elevenlabs.similarity-boost}")
   private double similarityBoost;

   public CompletableFuture<byte[]> generateNarration(final String text) {
      return CompletableFuture.supplyAsync(() -> {
         try {
            log.debug("Generating narration for text: {}...", text.substring(0, Math.min(50, text.length())));

            final Map<String, Object> requestBody = Map.of("text",
                  text,
                  "model_id",
                  "eleven_monolingual_v1",
                  "voice_settings",
                  Map.of("stability", stability, "similarity_boost", similarityBoost));

            final RestClient client = restClientBuilder.baseUrl(apiUrl)
                                                       .defaultHeader("xi-api-key", apiKey)
                                                       .defaultHeader("Accept", "audio/mpeg")
                                                       .build();

            final byte[] audioData = client.post()
                                           .uri("/text-to-speech/{voiceId}", voiceId)
                                           .contentType(MediaType.APPLICATION_JSON)
                                           .body(requestBody)
                                           .retrieve()
                                           .body(byte[].class);

            if (audioData == null || audioData.length == 0) {
               throw new AudioGenerationException("Received empty audio response");
            }

            log.debug("Successfully generated narration ({} bytes)", audioData.length);
            return audioData;

         } catch (final Exception e) {
            log.error("Failed to generate narration", e);
            throw new AudioGenerationException("Narration generation failed: " + e.getMessage(), e);
         }
      });
   }

   public CompletableFuture<byte[]> generateSoundEffect(final String effectDescription) {
      return CompletableFuture.supplyAsync(() -> {
         try {
            log.debug("Generating sound effect: {}", effectDescription);

            // Convert effect name to spoken description
            final String soundText = convertEffectNameToDescription(effectDescription);

            final Map<String, Object> requestBody = Map.of("text",
                  soundText,
                  "model_id",
                  "eleven_monolingual_v1",
                  "voice_settings",
                  Map.of("stability", 0.3, "similarity_boost", 0.5));

            final RestClient client = restClientBuilder.baseUrl(apiUrl)
                                                       .defaultHeader("xi-api-key", apiKey)
                                                       .defaultHeader("Accept", "audio/mpeg")
                                                       .build();

            final byte[] audioData = client.post()
                                           .uri("/text-to-speech/{voiceId}", voiceId)
                                           .contentType(MediaType.APPLICATION_JSON)
                                           .body(requestBody)
                                           .retrieve()
                                           .body(byte[].class);

            if (audioData == null) {
               log.warn("Received null audio for sound effect: {}", effectDescription);
               return new byte[0];
            }

            log.debug("Successfully generated sound effect ({} bytes)", audioData.length);
            return audioData;

         } catch (final Exception e) {
            log.warn("Failed to generate sound effect: {}", effectDescription, e);
            // Return empty audio instead of failing for sound effects
            return new byte[0];
         }
      });
   }

   private String convertEffectNameToDescription(final String effectName) {
      // Convert snake_case effect names to spoken descriptions
      return effectName.replace("_", " ");
   }

   public double estimateNarrationDuration(final String text) {
      // Rough estimate: average reading speed is about 150 words per minute
      // which is about 2.5 words per second
      final int wordCount = text.split("\\s+").length;
      return wordCount / 2.5;
   }
}

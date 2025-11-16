package com.frankenstein.story.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Configuration for API costs and rate limits
 *
 * @author alarinel@gmail.com
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiConfiguration {
   // Anthropic Claude pricing
   private double anthropicInputCostPerMillionTokens;
   private double anthropicOutputCostPerMillionTokens;

   // Stability AI pricing
   private double stabilityImageCostPerImage;

   // ElevenLabs pricing
   private double elevenlabsCostPerCharacter;
   private int elevenlabsMaxConcurrentRequests;

   // ElevenLabs voice configuration
   private String maleVoiceId;
   private String femaleVoiceId;

   // General settings
   private int maxStoriesPerDay;
   private boolean enableCostTracking;

   public static ApiConfiguration getDefaults() {
      return ApiConfiguration.builder().anthropicInputCostPerMillionTokens(3.0)  // $3 per 1M input tokens
                             .anthropicOutputCostPerMillionTokens(15.0) // $15 per 1M output tokens
                             .stabilityImageCostPerImage(0.04)  // $0.04 per image
                             .elevenlabsCostPerCharacter(0.00003) // $0.30 per 1M characters
                             .elevenlabsMaxConcurrentRequests(3) // Max 3 concurrent requests
                             .maleVoiceId("21m00Tcm4TlvDq8ikWAM") // Default male voice
                             .femaleVoiceId("EXAVITQu4vr4xnSDxMaL") // Default female voice
                             .maxStoriesPerDay(100).enableCostTracking(true).build();
   }
}

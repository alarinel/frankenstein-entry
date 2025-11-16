package com.frankenstein.story.service.tracking;

/**
 * Service for calculating API costs
 *
 * @author alarinel@gmail.com
 */
public interface CostCalculationService {

   /**
    * Calculate cost for story generation (Anthropic Claude)
    *
    * @param inputTokens  number of input tokens
    * @param outputTokens number of output tokens
    * @return cost in USD
    */
   double calculateStoryGenerationCost(int inputTokens, int outputTokens);

   /**
    * Calculate cost for image generation (Stability AI)
    *
    * @param imageCount number of images generated
    * @return cost in USD
    */
   double calculateImageGenerationCost(int imageCount);

   /**
    * Calculate cost for audio generation (ElevenLabs)
    *
    * @param characterCount number of characters in text
    * @return cost in USD
    */
   double calculateAudioGenerationCost(int characterCount);
}

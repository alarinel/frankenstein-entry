package com.frankenstein.story.service.tracking;

import com.frankenstein.story.model.ApiConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Implementation of cost calculation service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CostCalculationServiceImpl implements CostCalculationService {

   private final ApiConfigurationService configurationService;

   @Override
   public double calculateStoryGenerationCost(final int inputTokens, final int outputTokens) {
      final ApiConfiguration config = configurationService.getConfiguration();
      final double cost = (inputTokens / 1_000_000.0 * config.getAnthropicInputCostPerMillionTokens()) + (outputTokens / 1_000_000.0 * config.getAnthropicOutputCostPerMillionTokens());
      log.debug("Story generation cost: ${} (input: {}, output: {})", cost, inputTokens, outputTokens);
      return cost;
   }

   @Override
   public double calculateImageGenerationCost(final int imageCount) {
      final ApiConfiguration config = configurationService.getConfiguration();
      final double cost = imageCount * config.getStabilityImageCostPerImage();
      log.debug("Image generation cost: ${} ({} images)", cost, imageCount);
      return cost;
   }

   @Override
   public double calculateAudioGenerationCost(final int characterCount) {
      final ApiConfiguration config = configurationService.getConfiguration();
      final double cost = characterCount * config.getElevenlabsCostPerCharacter();
      log.debug("Audio generation cost: ${} ({} characters)", cost, characterCount);
      return cost;
   }
}

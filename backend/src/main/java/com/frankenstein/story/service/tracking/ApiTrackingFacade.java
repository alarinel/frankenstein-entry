package com.frankenstein.story.service.tracking;

import com.frankenstein.story.model.ApiCallLog;
import com.frankenstein.story.model.ApiConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Facade for coordinating API tracking services
 * Provides a simplified API for controllers and other services
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApiTrackingFacade {

   private final ApiConfigurationService configurationService;
   private final ApiLogService logService;
   private final ApiStatisticsService statisticsService;
   private final CostCalculationService costCalculationService;

   // Configuration methods

   public ApiConfiguration getConfiguration() {
      return configurationService.getConfiguration();
   }

   public void updateConfiguration(final ApiConfiguration config) {
      configurationService.updateConfiguration(config);
   }

   // Log methods

   public void logApiCall(final ApiCallLog callLog) {
      logService.logApiCall(callLog);
   }

   public List<ApiCallLog> getAllLogs() {
      return logService.getAllLogs();
   }

   public List<ApiCallLog> getLogsByStoryId(final String storyId) {
      return logService.getLogsByStoryId(storyId);
   }

   public void deleteLog(final String logId) {
      logService.deleteLog(logId);
   }

   public void deleteOldLogs(final int daysOld) {
      logService.deleteOldLogs(daysOld);
   }

   // Statistics methods

   public Map<String, Object> getStatistics() {
      final List<ApiCallLog> logs = logService.getAllLogs();
      return statisticsService.calculateStatistics(logs);
   }

   // Cost calculation methods

   public double calculateStoryGenerationCost(final int inputTokens, final int outputTokens) {
      return costCalculationService.calculateStoryGenerationCost(inputTokens, outputTokens);
   }

   public double calculateImageGenerationCost(final int imageCount) {
      return costCalculationService.calculateImageGenerationCost(imageCount);
   }

   public double calculateAudioGenerationCost(final int characterCount) {
      return costCalculationService.calculateAudioGenerationCost(characterCount);
   }
}

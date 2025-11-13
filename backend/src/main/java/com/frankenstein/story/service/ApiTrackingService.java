package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.model.ApiCallLog;
import com.frankenstein.story.model.ApiConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for tracking API calls and managing costs
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApiTrackingService {
   private final ObjectMapper objectMapper;
   private final Path trackingDir = Paths.get("storage/api-tracking");
   private final Path configPath = Paths.get("storage/api-config.json");

   private ApiConfiguration configuration;

   @jakarta.annotation.PostConstruct
   public void initialize() {
      try {
         Files.createDirectories(trackingDir);
         loadConfiguration();
      } catch (final IOException e) {
         log.error("Failed to initialize API tracking", e);
      }
   }

   public ApiConfiguration getConfiguration() {
      if (configuration == null) {
         loadConfiguration();
      }
      return configuration;
   }

   public void updateConfiguration(final ApiConfiguration newConfig) {
      this.configuration = newConfig;
      saveConfiguration();
   }

   private void loadConfiguration() {
      try {
         if (Files.exists(configPath)) {
            configuration = objectMapper.readValue(configPath.toFile(), ApiConfiguration.class);
         } else {
            configuration = ApiConfiguration.getDefaults();
            saveConfiguration();
         }
      } catch (final IOException e) {
         log.error("Failed to load configuration, using defaults", e);
         configuration = ApiConfiguration.getDefaults();
      }
   }

   private void saveConfiguration() {
      try {
         objectMapper.writerWithDefaultPrettyPrinter().writeValue(configPath.toFile(), configuration);
      } catch (final IOException e) {
         log.error("Failed to save configuration", e);
      }
   }

   public void logApiCall(final ApiCallLog callLog) {
      if (!configuration.isEnableCostTracking()) {
         return;
      }

      try {
         callLog.setId(UUID.randomUUID().toString());
         callLog.setTimestamp(LocalDateTime.now());

         final String filename = String.format("%s_%s.json", callLog.getTimestamp().toString().replace(":", "-"), callLog.getId());

         final Path logPath = trackingDir.resolve(filename);
         objectMapper.writerWithDefaultPrettyPrinter().writeValue(logPath.toFile(), callLog);

         log.info("Logged API call: {} - ${}", callLog.getOperation(), callLog.getCostUsd());
      } catch (final IOException e) {
         log.error("Failed to log API call", e);
      }
   }

   public List<ApiCallLog> getAllLogs() {
      try {
         return Files.list(trackingDir).filter(path -> path.toString().endsWith(".json")).map(path -> {
            try {
               return objectMapper.readValue(path.toFile(), ApiCallLog.class);
            } catch (final IOException e) {
               log.error("Failed to read log file: {}", path, e);
               return null;
            }
         }).filter(Objects::nonNull).sorted(Comparator.comparing(ApiCallLog::getTimestamp).reversed()).collect(Collectors.toList());
      } catch (final IOException e) {
         log.error("Failed to list API logs", e);
         return Collections.emptyList();
      }
   }

   public List<ApiCallLog> getLogsByStoryId(final String storyId) {
      return getAllLogs().stream().filter(log -> storyId.equals(log.getStoryId())).collect(Collectors.toList());
   }

   public void deleteLog(final String logId) {
      try {
         Files.list(trackingDir).filter(path -> path.getFileName().toString().contains(logId)).forEach(path -> {
            try {
               Files.delete(path);
               log.info("Deleted log: {}", logId);
            } catch (final IOException e) {
               log.error("Failed to delete log: {}", logId, e);
            }
         });
      } catch (final IOException e) {
         log.error("Failed to delete log", e);
      }
   }

   public void deleteOldLogs(final int daysOld) {
      final LocalDateTime cutoff = LocalDateTime.now().minusDays(daysOld);
      getAllLogs().stream().filter(log -> log.getTimestamp().isBefore(cutoff)).forEach(log -> deleteLog(log.getId()));
   }

   public Map<String, Object> getStatistics() {
      final List<ApiCallLog> logs = getAllLogs();

      final double totalCost = logs.stream().mapToDouble(ApiCallLog::getCostUsd).sum();

      final Map<String, Long> callsByProvider = logs.stream().collect(Collectors.groupingBy(ApiCallLog::getApiProvider, Collectors.counting()));

      final Map<String, Double> costByProvider = logs.stream()
                                                     .collect(Collectors.groupingBy(ApiCallLog::getApiProvider,
                                                     Collectors.summingDouble(ApiCallLog::getCostUsd)));

      final long successCount = logs.stream().filter(log -> "SUCCESS".equals(log.getStatus())).count();

      final Map<String, Object> stats = new HashMap<>();
      stats.put("totalCalls", logs.size());
      stats.put("totalCost", totalCost);
      stats.put("successRate",
            logs.isEmpty()
            ? 0
            : (double) successCount / logs.size() * 100);
      stats.put("callsByProvider", callsByProvider);
      stats.put("costByProvider", costByProvider);
      stats.put("averageCostPerCall",
            logs.isEmpty()
            ? 0
            : totalCost / logs.size());

      return stats;
   }

   public double calculateStoryGenerationCost(final int inputTokens, final int outputTokens) {
      return (inputTokens / 1_000_000.0 * configuration.getAnthropicInputCostPerMillionTokens()) + (outputTokens / 1_000_000.0 * configuration.getAnthropicOutputCostPerMillionTokens());
   }

   public double calculateImageGenerationCost(final int imageCount) {
      return imageCount * configuration.getStabilityImageCostPerImage();
   }

   public double calculateAudioGenerationCost(final int characterCount) {
      return characterCount * configuration.getElevenlabsCostPerCharacter();
   }
}

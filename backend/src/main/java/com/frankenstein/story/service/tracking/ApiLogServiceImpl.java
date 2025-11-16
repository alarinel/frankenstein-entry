package com.frankenstein.story.service.tracking;

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
 * Implementation of API log service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApiLogServiceImpl implements ApiLogService {

   private final ObjectMapper objectMapper;
   private final ApiConfigurationService configurationService;
   private final Path trackingDir = Paths.get("storage/api-tracking");

   @jakarta.annotation.PostConstruct
   public void initialize() {
      try {
         Files.createDirectories(trackingDir);
         log.info("Initialized API tracking directory: {}", trackingDir);
      } catch (final IOException e) {
         log.error("Failed to initialize API tracking directory", e);
      }
   }

   @Override
   public void logApiCall(final ApiCallLog callLog) {
      final ApiConfiguration config = configurationService.getConfiguration();
      if (!config.isEnableCostTracking()) {
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

   @Override
   public List<ApiCallLog> getAllLogs() {
      try {
         return Files.list(trackingDir)
                     .filter(path -> path.toString().endsWith(".json"))
                     .map(this::readLogFile)
                     .filter(Objects::nonNull)
                     .sorted(Comparator.comparing(ApiCallLog::getTimestamp).reversed())
                     .collect(Collectors.toList());
      } catch (final IOException e) {
         log.error("Failed to list API logs", e);
         return Collections.emptyList();
      }
   }

   @Override
   public List<ApiCallLog> getLogsByStoryId(final String storyId) {
      return getAllLogs().stream().filter(log -> storyId.equals(log.getStoryId())).collect(Collectors.toList());
   }

   @Override
   public void deleteLog(final String logId) {
      try {
         Files.list(trackingDir).filter(path -> path.getFileName().toString().contains(logId)).forEach(this::deleteLogFile);
      } catch (final IOException e) {
         log.error("Failed to delete log", e);
      }
   }

   @Override
   public void deleteOldLogs(final int daysOld) {
      final LocalDateTime cutoff = LocalDateTime.now().minusDays(daysOld);
      getAllLogs().stream().filter(log -> log.getTimestamp().isBefore(cutoff)).forEach(log -> deleteLog(log.getId()));
      log.info("Deleted logs older than {} days", daysOld);
   }

   private ApiCallLog readLogFile(final Path path) {
      try {
         return objectMapper.readValue(path.toFile(), ApiCallLog.class);
      } catch (final IOException e) {
         log.error("Failed to read log file: {}", path, e);
         return null;
      }
   }

   private void deleteLogFile(final Path path) {
      try {
         Files.delete(path);
         log.info("Deleted log file: {}", path.getFileName());
      } catch (final IOException e) {
         log.error("Failed to delete log file: {}", path, e);
      }
   }
}

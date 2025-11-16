package com.frankenstein.story.controller;

import com.frankenstein.story.model.ApiCallLog;
import com.frankenstein.story.model.ApiConfiguration;
import com.frankenstein.story.service.tracking.ApiTrackingFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin controller for managing API tracking and configuration
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

   private final ApiTrackingFacade apiTrackingFacade;

   @GetMapping("/logs")
   public ResponseEntity<List<ApiCallLog>> getAllLogs() {
      return ResponseEntity.ok(apiTrackingFacade.getAllLogs());
   }

   @GetMapping("/logs/story/{storyId}")
   public ResponseEntity<List<ApiCallLog>> getLogsByStory(@PathVariable final String storyId) {
      return ResponseEntity.ok(apiTrackingFacade.getLogsByStoryId(storyId));
   }

   @DeleteMapping("/logs/{logId}")
   public ResponseEntity<Void> deleteLog(@PathVariable final String logId) {
      apiTrackingFacade.deleteLog(logId);
      return ResponseEntity.ok().build();
   }

   @DeleteMapping("/logs/old/{days}")
   public ResponseEntity<Void> deleteOldLogs(@PathVariable final int days) {
      apiTrackingFacade.deleteOldLogs(days);
      return ResponseEntity.ok().build();
   }

   @GetMapping("/statistics")
   public ResponseEntity<Map<String, Object>> getStatistics() {
      return ResponseEntity.ok(apiTrackingFacade.getStatistics());
   }

   @GetMapping("/configuration")
   public ResponseEntity<ApiConfiguration> getConfiguration() {
      return ResponseEntity.ok(apiTrackingFacade.getConfiguration());
   }

   @PutMapping("/configuration")
   public ResponseEntity<ApiConfiguration> updateConfiguration(@RequestBody final ApiConfiguration config) {
      // Validate voice ID fields
      validateVoiceIds(config);

      apiTrackingFacade.updateConfiguration(config);
      return ResponseEntity.ok(config);
   }

   /**
    * Validate voice ID fields in configuration
    *
    * @param config configuration to validate
    * @throws IllegalArgumentException if validation fails
    */
   private void validateVoiceIds(final ApiConfiguration config) {
      if (config.getMaleVoiceId() != null && !config.getMaleVoiceId().isEmpty()) {
         if (!isValidVoiceId(config.getMaleVoiceId())) {
            throw new IllegalArgumentException("Invalid male voice ID format. Must be alphanumeric.");
         }
      }

      if (config.getFemaleVoiceId() != null && !config.getFemaleVoiceId().isEmpty()) {
         if (!isValidVoiceId(config.getFemaleVoiceId())) {
            throw new IllegalArgumentException("Invalid female voice ID format. Must be alphanumeric.");
         }
      }
   }

   /**
    * Check if voice ID has valid format (alphanumeric)
    *
    * @param voiceId voice ID to validate
    * @return true if valid, false otherwise
    */
   private boolean isValidVoiceId(final String voiceId) {
      return voiceId.matches("^[a-zA-Z0-9]+$");
   }
}

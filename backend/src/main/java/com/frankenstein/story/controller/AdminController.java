package com.frankenstein.story.controller;

import com.frankenstein.story.model.ApiCallLog;
import com.frankenstein.story.model.ApiConfiguration;
import com.frankenstein.story.service.ApiTrackingService;
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
    
    private final ApiTrackingService apiTrackingService;
    
    @GetMapping("/logs")
    public ResponseEntity<List<ApiCallLog>> getAllLogs() {
        return ResponseEntity.ok(apiTrackingService.getAllLogs());
    }
    
    @GetMapping("/logs/story/{storyId}")
    public ResponseEntity<List<ApiCallLog>> getLogsByStory(@PathVariable String storyId) {
        return ResponseEntity.ok(apiTrackingService.getLogsByStoryId(storyId));
    }
    
    @DeleteMapping("/logs/{logId}")
    public ResponseEntity<Void> deleteLog(@PathVariable String logId) {
        apiTrackingService.deleteLog(logId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/logs/old/{days}")
    public ResponseEntity<Void> deleteOldLogs(@PathVariable int days) {
        apiTrackingService.deleteOldLogs(days);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(apiTrackingService.getStatistics());
    }
    
    @GetMapping("/configuration")
    public ResponseEntity<ApiConfiguration> getConfiguration() {
        return ResponseEntity.ok(apiTrackingService.getConfiguration());
    }
    
    @PutMapping("/configuration")
    public ResponseEntity<ApiConfiguration> updateConfiguration(@RequestBody ApiConfiguration config) {
        apiTrackingService.updateConfiguration(config);
        return ResponseEntity.ok(config);
    }
}

package com.frankenstein.story.service.tracking;

import com.frankenstein.story.model.ApiCallLog;

import java.util.List;

/**
 * Service for managing API call logs
 *
 * @author alarinel@gmail.com
 */
public interface ApiLogService {

   /**
    * Log an API call
    *
    * @param callLog the log entry to save
    */
   void logApiCall(ApiCallLog callLog);

   /**
    * Get all API call logs
    *
    * @return list of all logs
    */
   List<ApiCallLog> getAllLogs();

   /**
    * Get logs for a specific story
    *
    * @param storyId the story ID
    * @return list of logs for the story
    */
   List<ApiCallLog> getLogsByStoryId(String storyId);

   /**
    * Delete a specific log entry
    *
    * @param logId the log ID to delete
    */
   void deleteLog(String logId);

   /**
    * Delete logs older than specified days
    *
    * @param daysOld number of days
    */
   void deleteOldLogs(int daysOld);
}

package com.frankenstein.story.service.tracking;

import com.frankenstein.story.model.ApiCallLog;

import java.util.List;
import java.util.Map;

/**
 * Service for calculating API usage statistics
 *
 * @author alarinel@gmail.com
 */
public interface ApiStatisticsService {

   /**
    * Calculate comprehensive statistics from logs
    *
    * @param logs list of API call logs
    * @return map of statistics
    */
   Map<String, Object> calculateStatistics(List<ApiCallLog> logs);

   /**
    * Get call counts by provider
    *
    * @param logs list of API call logs
    * @return map of provider to call count
    */
   Map<String, Long> getCallsByProvider(List<ApiCallLog> logs);

   /**
    * Get costs by provider
    *
    * @param logs list of API call logs
    * @return map of provider to total cost
    */
   Map<String, Double> getCostByProvider(List<ApiCallLog> logs);

   /**
    * Calculate success rate
    *
    * @param logs list of API call logs
    * @return success rate as percentage
    */
   double getSuccessRate(List<ApiCallLog> logs);
}

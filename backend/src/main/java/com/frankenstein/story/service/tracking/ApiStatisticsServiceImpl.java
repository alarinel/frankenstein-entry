package com.frankenstein.story.service.tracking;

import com.frankenstein.story.model.ApiCallLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of API statistics service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApiStatisticsServiceImpl implements ApiStatisticsService {

   @Override
   public Map<String, Object> calculateStatistics(final List<ApiCallLog> logs) {
      final double totalCost = logs.stream().mapToDouble(ApiCallLog::getCostUsd).sum();

      final Map<String, Long> callsByProvider = getCallsByProvider(logs);
      final Map<String, Double> costByProvider = getCostByProvider(logs);
      final double successRate = getSuccessRate(logs);

      final Map<String, Object> stats = new HashMap<>();
      stats.put("totalCalls", logs.size());
      stats.put("totalCost", totalCost);
      stats.put("successRate", successRate);
      stats.put("callsByProvider", callsByProvider);
      stats.put("costByProvider", costByProvider);
      stats.put("averageCostPerCall",
            logs.isEmpty()
            ? 0
            : totalCost / logs.size());

      log.debug("Calculated statistics for {} logs", logs.size());
      return stats;
   }

   @Override
   public Map<String, Long> getCallsByProvider(final List<ApiCallLog> logs) {
      return logs.stream().collect(Collectors.groupingBy(ApiCallLog::getApiProvider, Collectors.counting()));
   }

   @Override
   public Map<String, Double> getCostByProvider(final List<ApiCallLog> logs) {
      return logs.stream().collect(Collectors.groupingBy(ApiCallLog::getApiProvider, Collectors.summingDouble(ApiCallLog::getCostUsd)));
   }

   @Override
   public double getSuccessRate(final List<ApiCallLog> logs) {
      if (logs.isEmpty()) {
         return 0.0;
      }

      final long successCount = logs.stream().filter(log -> "SUCCESS".equals(log.getStatus())).count();

      return (double) successCount / logs.size() * 100;
   }
}

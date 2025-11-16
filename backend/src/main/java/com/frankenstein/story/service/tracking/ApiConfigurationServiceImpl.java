package com.frankenstein.story.service.tracking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.model.ApiConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Implementation of API configuration service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApiConfigurationServiceImpl implements ApiConfigurationService {

   private final ObjectMapper objectMapper;
   private final Path configPath = Paths.get("storage/api-config.json");

   private ApiConfiguration configuration;

   @jakarta.annotation.PostConstruct
   public void initialize() {
      loadConfiguration();
   }

   @Override
   public ApiConfiguration getConfiguration() {
      if (configuration == null) {
         loadConfiguration();
      }
      return configuration;
   }

   @Override
   public void updateConfiguration(final ApiConfiguration newConfig) {
      this.configuration = newConfig;
      saveConfiguration();
   }

   @Override
   public void loadConfiguration() {
      try {
         if (Files.exists(configPath)) {
            configuration = objectMapper.readValue(configPath.toFile(), ApiConfiguration.class);
            log.info("Loaded API configuration from {}", configPath);
         } else {
            configuration = ApiConfiguration.getDefaults();
            saveConfiguration();
            log.info("Created default API configuration");
         }
      } catch (final IOException e) {
         log.error("Failed to load configuration, using defaults", e);
         configuration = ApiConfiguration.getDefaults();
      }
   }

   @Override
   public void saveConfiguration() {
      try {
         Files.createDirectories(configPath.getParent());
         objectMapper.writerWithDefaultPrettyPrinter().writeValue(configPath.toFile(), configuration);
         log.info("Saved API configuration to {}", configPath);
      } catch (final IOException e) {
         log.error("Failed to save configuration", e);
      }
   }
}

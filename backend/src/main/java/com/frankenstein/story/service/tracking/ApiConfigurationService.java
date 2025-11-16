package com.frankenstein.story.service.tracking;

import com.frankenstein.story.model.ApiConfiguration;

/**
 * Service for managing API configuration
 *
 * @author alarinel@gmail.com
 */
public interface ApiConfigurationService {

   /**
    * Get the current API configuration
    *
    * @return current configuration
    */
   ApiConfiguration getConfiguration();

   /**
    * Update the API configuration
    *
    * @param config new configuration
    */
   void updateConfiguration(ApiConfiguration config);

   /**
    * Load configuration from storage
    */
   void loadConfiguration();

   /**
    * Save configuration to storage
    */
   void saveConfiguration();
}

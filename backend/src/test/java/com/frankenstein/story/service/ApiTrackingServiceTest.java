package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.model.ApiConfiguration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Tests for ApiTrackingService voice configuration management
 *
 * @author alarinel@gmail.com
 */
class ApiTrackingServiceTest {

   @TempDir
   Path tempDir;

   private ApiTrackingService service;
   private ObjectMapper objectMapper;
   private Path configPath;

   @BeforeEach
   void setUp() {
      objectMapper = new ObjectMapper();
      service = new ApiTrackingService(objectMapper);
      
      // Set up temporary paths
      final Path trackingDir = tempDir.resolve("api-tracking");
      configPath = tempDir.resolve("api-config.json");
      
      ReflectionTestUtils.setField(service, "trackingDir", trackingDir);
      ReflectionTestUtils.setField(service, "configPath", configPath);
      
      service.initialize();
   }

   @Test
   void loadConfiguration_WithMissingVoiceFields_AppliesDefaults() throws IOException {
      // Given - configuration without voice fields (simulating old config file)
      final String configJson = "{\n" +
         "  \"anthropicInputCostPerMillionTokens\" : 3.0,\n" +
         "  \"anthropicOutputCostPerMillionTokens\" : 15.0,\n" +
         "  \"stabilityImageCostPerImage\" : 0.04,\n" +
         "  \"elevenlabsCostPerCharacter\" : 3.0E-5,\n" +
         "  \"elevenlabsMaxConcurrentRequests\" : 3,\n" +
         "  \"maxStoriesPerDay\" : 100,\n" +
         "  \"enableCostTracking\" : true\n" +
         "}";
      
      Files.writeString(configPath, configJson);

      // When - service loads configuration
      service.initialize();
      final ApiConfiguration loadedConfig = service.getConfiguration();

      // Then - voice fields should have defaults
      assertThat(loadedConfig.getMaleVoiceId()).isEqualTo("21m00Tcm4TlvDq8ikWAM");
      assertThat(loadedConfig.getFemaleVoiceId()).isEqualTo("EXAVITQu4vr4xnSDxMaL");
   }

   @Test
   void loadConfiguration_WithExistingVoiceFields_PreservesValues() throws IOException {
      // Given - configuration with custom voice fields
      final ApiConfiguration configWithVoices = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId("customMaleVoice123")
         .femaleVoiceId("customFemaleVoice456")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();
      
      objectMapper.writerWithDefaultPrettyPrinter()
         .writeValue(configPath.toFile(), configWithVoices);

      // When - service loads configuration
      service.initialize();
      final ApiConfiguration loadedConfig = service.getConfiguration();

      // Then - voice fields should be preserved
      assertThat(loadedConfig.getMaleVoiceId()).isEqualTo("customMaleVoice123");
      assertThat(loadedConfig.getFemaleVoiceId()).isEqualTo("customFemaleVoice456");
   }

   @Test
   void updateConfiguration_WithValidVoiceIds_Success() {
      // Given
      final ApiConfiguration newConfig = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId("validMaleVoice123")
         .femaleVoiceId("validFemaleVoice456")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();

      // When
      service.updateConfiguration(newConfig);

      // Then
      final ApiConfiguration savedConfig = service.getConfiguration();
      assertThat(savedConfig.getMaleVoiceId()).isEqualTo("validMaleVoice123");
      assertThat(savedConfig.getFemaleVoiceId()).isEqualTo("validFemaleVoice456");
   }

   @Test
   void updateConfiguration_WithInvalidMaleVoiceId_ThrowsException() {
      // Given - configuration with non-alphanumeric male voice ID
      final ApiConfiguration invalidConfig = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId("invalid-voice-id!")
         .femaleVoiceId("validFemaleVoice456")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();

      // When/Then
      assertThatThrownBy(() -> service.updateConfiguration(invalidConfig))
         .isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("Male voice ID must contain only alphanumeric characters");
   }

   @Test
   void updateConfiguration_WithInvalidFemaleVoiceId_ThrowsException() {
      // Given - configuration with non-alphanumeric female voice ID
      final ApiConfiguration invalidConfig = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId("validMaleVoice123")
         .femaleVoiceId("invalid@voice#id")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();

      // When/Then
      assertThatThrownBy(() -> service.updateConfiguration(invalidConfig))
         .isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("Female voice ID must contain only alphanumeric characters");
   }

   @Test
   void updateConfiguration_WithNullMaleVoiceId_ThrowsException() {
      // Given - configuration with null male voice ID
      final ApiConfiguration invalidConfig = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId(null)
         .femaleVoiceId("validFemaleVoice456")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();

      // When/Then
      assertThatThrownBy(() -> service.updateConfiguration(invalidConfig))
         .isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("Male voice ID cannot be null or empty");
   }

   @Test
   void updateConfiguration_WithEmptyFemaleVoiceId_ThrowsException() {
      // Given - configuration with empty female voice ID
      final ApiConfiguration invalidConfig = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId("validMaleVoice123")
         .femaleVoiceId("")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();

      // When/Then
      assertThatThrownBy(() -> service.updateConfiguration(invalidConfig))
         .isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("Female voice ID cannot be null or empty");
   }

   @Test
   void saveConfiguration_PersistsVoiceIds() throws IOException {
      // Given
      final ApiConfiguration config = ApiConfiguration.builder()
         .anthropicInputCostPerMillionTokens(3.0)
         .anthropicOutputCostPerMillionTokens(15.0)
         .stabilityImageCostPerImage(0.04)
         .elevenlabsCostPerCharacter(0.00003)
         .elevenlabsMaxConcurrentRequests(3)
         .maleVoiceId("persistedMaleVoice")
         .femaleVoiceId("persistedFemaleVoice")
         .maxStoriesPerDay(100)
         .enableCostTracking(true)
         .build();

      // When
      service.updateConfiguration(config);

      // Then - verify file contains voice IDs
      final ApiConfiguration savedConfig = objectMapper.readValue(
         configPath.toFile(), 
         ApiConfiguration.class
      );
      assertThat(savedConfig.getMaleVoiceId()).isEqualTo("persistedMaleVoice");
      assertThat(savedConfig.getFemaleVoiceId()).isEqualTo("persistedFemaleVoice");
   }

   @Test
   void loadConfiguration_WithNoConfigFile_CreatesDefaultWithVoiceIds() {
      // Given - no config file exists (fresh initialization)
      
      // When
      final ApiConfiguration config = service.getConfiguration();

      // Then - should have default voice IDs
      assertThat(config.getMaleVoiceId()).isEqualTo("21m00Tcm4TlvDq8ikWAM");
      assertThat(config.getFemaleVoiceId()).isEqualTo("EXAVITQu4vr4xnSDxMaL");
      assertThat(Files.exists(configPath)).isTrue();
   }
}

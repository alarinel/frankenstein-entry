package com.frankenstein.story.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.model.ApiConfiguration;
import com.frankenstein.story.service.tracking.ApiTrackingFacade;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests for AdminController
 *
 * @author alarinel@gmail.com
 */
@WebMvcTest(AdminController.class)
class AdminControllerTest {

   @Autowired
   private MockMvc mockMvc;

   @Autowired
   private ObjectMapper objectMapper;

   @MockBean
   private ApiTrackingFacade apiTrackingFacade;

   @Test
   void getConfiguration_ReturnsConfigurationWithVoiceFields() throws Exception {
      // Given
      final ApiConfiguration config = ApiConfiguration.builder()
                                                      .anthropicInputCostPerMillionTokens(3.0)
                                                      .anthropicOutputCostPerMillionTokens(15.0)
                                                      .stabilityImageCostPerImage(0.04)
                                                      .elevenlabsCostPerCharacter(0.00003)
                                                      .elevenlabsMaxConcurrentRequests(3)
                                                      .maleVoiceId("21m00Tcm4TlvDq8ikWAM")
                                                      .femaleVoiceId("EXAVITQu4vr4xnSDxMaL")
                                                      .maxStoriesPerDay(100)
                                                      .enableCostTracking(true)
                                                      .build();

      when(apiTrackingFacade.getConfiguration()).thenReturn(config);

      // When/Then
      mockMvc.perform(get("/api/admin/configuration"))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.maleVoiceId").value("21m00Tcm4TlvDq8ikWAM"))
             .andExpect(jsonPath("$.femaleVoiceId").value("EXAVITQu4vr4xnSDxMaL"))
             .andExpect(jsonPath("$.anthropicInputCostPerMillionTokens").value(3.0))
             .andExpect(jsonPath("$.elevenlabsMaxConcurrentRequests").value(3));

      verify(apiTrackingFacade).getConfiguration();
   }

   @Test
   void updateConfiguration_WithValidVoiceIds_UpdatesConfiguration() throws Exception {
      // Given
      final ApiConfiguration config = ApiConfiguration.builder()
                                                      .anthropicInputCostPerMillionTokens(3.0)
                                                      .anthropicOutputCostPerMillionTokens(15.0)
                                                      .stabilityImageCostPerImage(0.04)
                                                      .elevenlabsCostPerCharacter(0.00003)
                                                      .elevenlabsMaxConcurrentRequests(3)
                                                      .maleVoiceId("newMaleVoiceId123")
                                                      .femaleVoiceId("newFemaleVoiceId456")
                                                      .maxStoriesPerDay(100)
                                                      .enableCostTracking(true)
                                                      .build();

      // When/Then
      mockMvc.perform(put("/api/admin/configuration")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsString(config)))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.maleVoiceId").value("newMaleVoiceId123"))
             .andExpect(jsonPath("$.femaleVoiceId").value("newFemaleVoiceId456"));

      verify(apiTrackingFacade).updateConfiguration(any(ApiConfiguration.class));
   }

   @Test
   void updateConfiguration_WithInvalidMaleVoiceId_ReturnsBadRequest() throws Exception {
      // Given
      final ApiConfiguration config = ApiConfiguration.builder()
                                                      .anthropicInputCostPerMillionTokens(3.0)
                                                      .anthropicOutputCostPerMillionTokens(15.0)
                                                      .stabilityImageCostPerImage(0.04)
                                                      .elevenlabsCostPerCharacter(0.00003)
                                                      .elevenlabsMaxConcurrentRequests(3)
                                                      .maleVoiceId("invalid-voice-id-with-dashes!")
                                                      .femaleVoiceId("validVoiceId123")
                                                      .maxStoriesPerDay(100)
                                                      .enableCostTracking(true)
                                                      .build();

      // When/Then
      mockMvc.perform(put("/api/admin/configuration")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsString(config)))
             .andExpect(status().isBadRequest());

      verify(apiTrackingFacade, never()).updateConfiguration(any(ApiConfiguration.class));
   }

   @Test
   void updateConfiguration_WithInvalidFemaleVoiceId_ReturnsBadRequest() throws Exception {
      // Given
      final ApiConfiguration config = ApiConfiguration.builder()
                                                      .anthropicInputCostPerMillionTokens(3.0)
                                                      .anthropicOutputCostPerMillionTokens(15.0)
                                                      .stabilityImageCostPerImage(0.04)
                                                      .elevenlabsCostPerCharacter(0.00003)
                                                      .elevenlabsMaxConcurrentRequests(3)
                                                      .maleVoiceId("validVoiceId123")
                                                      .femaleVoiceId("invalid voice id with spaces")
                                                      .maxStoriesPerDay(100)
                                                      .enableCostTracking(true)
                                                      .build();

      // When/Then
      mockMvc.perform(put("/api/admin/configuration")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsString(config)))
             .andExpect(status().isBadRequest());

      verify(apiTrackingFacade, never()).updateConfiguration(any(ApiConfiguration.class));
   }

   @Test
   void updateConfiguration_WithEmptyVoiceIds_AcceptsConfiguration() throws Exception {
      // Given - Empty voice IDs should be allowed (will use defaults)
      final ApiConfiguration config = ApiConfiguration.builder()
                                                      .anthropicInputCostPerMillionTokens(3.0)
                                                      .anthropicOutputCostPerMillionTokens(15.0)
                                                      .stabilityImageCostPerImage(0.04)
                                                      .elevenlabsCostPerCharacter(0.00003)
                                                      .elevenlabsMaxConcurrentRequests(3)
                                                      .maleVoiceId("")
                                                      .femaleVoiceId("")
                                                      .maxStoriesPerDay(100)
                                                      .enableCostTracking(true)
                                                      .build();

      // When/Then
      mockMvc.perform(put("/api/admin/configuration")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsString(config)))
             .andExpect(status().isOk());

      verify(apiTrackingFacade).updateConfiguration(any(ApiConfiguration.class));
   }

   @Test
   void updateConfiguration_WithNullVoiceIds_AcceptsConfiguration() throws Exception {
      // Given - Null voice IDs should be allowed (will use defaults)
      final ApiConfiguration config = ApiConfiguration.builder()
                                                      .anthropicInputCostPerMillionTokens(3.0)
                                                      .anthropicOutputCostPerMillionTokens(15.0)
                                                      .stabilityImageCostPerImage(0.04)
                                                      .elevenlabsCostPerCharacter(0.00003)
                                                      .elevenlabsMaxConcurrentRequests(3)
                                                      .maleVoiceId(null)
                                                      .femaleVoiceId(null)
                                                      .maxStoriesPerDay(100)
                                                      .enableCostTracking(true)
                                                      .build();

      // When/Then
      mockMvc.perform(put("/api/admin/configuration")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsString(config)))
             .andExpect(status().isOk());

      verify(apiTrackingFacade).updateConfiguration(any(ApiConfiguration.class));
   }
}

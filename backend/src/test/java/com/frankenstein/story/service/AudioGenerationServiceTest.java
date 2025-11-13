package com.frankenstein.story.service;

import com.frankenstein.story.exception.AudioGenerationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests for AudioGenerationService using Spring RestClient
 *
 * @author alarinel@gmail.com
 */
@ExtendWith(MockitoExtension.class)
class AudioGenerationServiceTest {

   @Mock
   private RestClient.Builder restClientBuilder;

   @Mock
   private RestClient restClient;

   @Mock
   private RestClient.RequestBodyUriSpec requestBodyUriSpec;

   @Mock
   private RestClient.RequestBodySpec requestBodySpec;

   @Mock
   private RestClient.ResponseSpec responseSpec;

   private AudioGenerationService service;

   @BeforeEach
   void setUp() {
      service = new AudioGenerationService(restClientBuilder);
      ReflectionTestUtils.setField(service, "apiKey", "test-api-key");
      ReflectionTestUtils.setField(service, "apiUrl", "https://api.elevenlabs.io/v1");
      ReflectionTestUtils.setField(service, "voiceId", "test-voice-id");
      ReflectionTestUtils.setField(service, "stability", 0.5);
      ReflectionTestUtils.setField(service, "similarityBoost", 0.75);
   }

   @Test
   void generateNarration_Success() throws Exception {
      // Given
      final String text = "Once upon a time in a magical forest";
      final byte[] mockAudioData = "mock-audio-data".getBytes();

      when(restClientBuilder.baseUrl(anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.build()).thenReturn(restClient);
      when(restClient.post()).thenReturn(requestBodyUriSpec);
      when(requestBodyUriSpec.uri(anyString(), any(Object.class))).thenReturn(requestBodySpec);
      when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.body(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.retrieve()).thenReturn(responseSpec);
      when(responseSpec.body(byte[].class)).thenReturn(mockAudioData);

      // When
      final CompletableFuture<byte[]> result = service.generateNarration(text);

      // Then
      assertThat(result).isNotNull();
      final byte[] audioData = result.get();
      assertThat(audioData).isEqualTo(mockAudioData);

      verify(restClientBuilder).baseUrl("https://api.elevenlabs.io/v1");
      verify(restClientBuilder).defaultHeader("xi-api-key", "test-api-key");
   }

   @Test
   void generateNarration_WithEmptyResponse_ThrowsException() {
      // Given
      final String text = "Test narration";

      when(restClientBuilder.baseUrl(anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.build()).thenReturn(restClient);
      when(restClient.post()).thenReturn(requestBodyUriSpec);
      when(requestBodyUriSpec.uri(anyString(), any(Object.class))).thenReturn(requestBodySpec);
      when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.body(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.retrieve()).thenReturn(responseSpec);
      when(responseSpec.body(byte[].class)).thenReturn(new byte[0]);

      // When/Then
      final CompletableFuture<byte[]> result = service.generateNarration(text);

      assertThatThrownBy(() -> result.get()).isInstanceOf(ExecutionException.class)
                                            .hasCauseInstanceOf(AudioGenerationException.class)
                                            .hasMessageContaining("empty audio");
   }

   @Test
   void generateNarration_WithApiError_ThrowsException() {
      // Given
      final String text = "Test narration";

      when(restClientBuilder.baseUrl(anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.build()).thenReturn(restClient);
      when(restClient.post()).thenReturn(requestBodyUriSpec);
      when(requestBodyUriSpec.uri(anyString(), any(Object.class))).thenReturn(requestBodySpec);
      when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.body(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.retrieve()).thenThrow(new RuntimeException("API Error"));

      // When/Then
      final CompletableFuture<byte[]> result = service.generateNarration(text);

      assertThatThrownBy(() -> result.get()).isInstanceOf(ExecutionException.class).hasCauseInstanceOf(AudioGenerationException.class);
   }

   @Test
   void generateSoundEffect_Success() throws Exception {
      // Given
      final String effect = "thunder_rumble";
      final byte[] mockAudioData = "mock-sound-effect".getBytes();

      when(restClientBuilder.baseUrl(anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.build()).thenReturn(restClient);
      when(restClient.post()).thenReturn(requestBodyUriSpec);
      when(requestBodyUriSpec.uri(anyString(), any(Object.class))).thenReturn(requestBodySpec);
      when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.body(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.retrieve()).thenReturn(responseSpec);
      when(responseSpec.body(byte[].class)).thenReturn(mockAudioData);

      // When
      final CompletableFuture<byte[]> result = service.generateSoundEffect(effect);

      // Then
      assertThat(result).isNotNull();
      final byte[] audioData = result.get();
      assertThat(audioData).isEqualTo(mockAudioData);
   }

   @Test
   void generateSoundEffect_WithError_ReturnsEmptyArray() throws Exception {
      // Given
      final String effect = "thunder_rumble";

      when(restClientBuilder.baseUrl(anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(restClientBuilder);
      when(restClientBuilder.build()).thenReturn(restClient);
      when(restClient.post()).thenReturn(requestBodyUriSpec);
      when(requestBodyUriSpec.uri(anyString(), any(Object.class))).thenReturn(requestBodySpec);
      when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.body(any())).thenReturn(requestBodySpec);
      when(requestBodySpec.retrieve()).thenThrow(new RuntimeException("API Error"));

      // When
      final CompletableFuture<byte[]> result = service.generateSoundEffect(effect);

      // Then - should return empty array instead of throwing
      assertThat(result).isNotNull();
      final byte[] audioData = result.get();
      assertThat(audioData).isEmpty();
   }

   @Test
   void estimateNarrationDuration_CalculatesCorrectly() {
      // Given
      final String shortText = "Hello world";
      final String longText = "This is a much longer piece of text that should take more time to narrate when converted to speech";

      // When
      final double shortDuration = service.estimateNarrationDuration(shortText);
      final double longDuration = service.estimateNarrationDuration(longText);

      // Then
      assertThat(shortDuration).isGreaterThan(0);
      assertThat(longDuration).isGreaterThan(shortDuration);
      assertThat(longDuration).isLessThan(60); // Reasonable upper bound
   }

   @Test
   void estimateNarrationDuration_WithEmptyText_ReturnsZero() {
      // Given
      final String emptyText = "";

      // When
      final double duration = service.estimateNarrationDuration(emptyText);

      // Then
      assertThat(duration).isEqualTo(0.0);
   }
}

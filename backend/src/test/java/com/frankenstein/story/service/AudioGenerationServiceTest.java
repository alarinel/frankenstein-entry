package com.frankenstein.story.service;

import com.frankenstein.story.exception.AudioGenerationException;
import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AudioGenerationServiceTest {

   @Mock
   private OkHttpClient httpClient;

   @Mock
   private Call call;

   @Mock
   private Response response;

   @Mock
   private ResponseBody responseBody;

   @Mock
   private FileStorageService fileStorageService;

   private AudioGenerationService service;

   @BeforeEach
   void setUp() {
      service = new AudioGenerationService(httpClient, fileStorageService);
      ReflectionTestUtils.setField(service, "elevenLabsApiKey", "test-api-key");
      ReflectionTestUtils.setField(service, "elevenLabsVoiceId", "test-voice-id");
   }

   @Test
   void generateNarration_Success() throws Exception {
      // Given
      String text = "Once upon a time in a magical forest";
      int pageNumber = 1;

      byte[] mockAudioData = "mock-audio-data".getBytes();

      when(httpClient.newCall(any(Request.class))).thenReturn(call);
      when(call.execute()).thenReturn(response);
      when(response.isSuccessful()).thenReturn(true);
      when(response.body()).thenReturn(responseBody);
      when(responseBody.bytes()).thenReturn(mockAudioData);
      when(fileStorageService.storeAudio(any(byte[].class), anyString())).thenReturn("audio/narration-1.mp3");

      // When
      CompletableFuture<String> result = service.generateNarration(text, pageNumber);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.get()).isEqualTo("audio/narration-1.mp3");

      ArgumentCaptor<Request> requestCaptor = ArgumentCaptor.forClass(Request.class);
      verify(httpClient).newCall(requestCaptor.capture());

      Request capturedRequest = requestCaptor.getValue();
      assertThat(capturedRequest.header("xi-api-key")).isEqualTo("test-api-key");
      assertThat(capturedRequest.url().toString()).contains("test-voice-id");
   }

   @Test
   void generateNarration_WithApiError_ThrowsException() throws Exception {
      // Given
      String text = "Test narration";
      int pageNumber = 1;

      when(httpClient.newCall(any(Request.class))).thenReturn(call);
      when(call.execute()).thenReturn(response);
      when(response.isSuccessful()).thenReturn(false);
      when(response.code()).thenReturn(429);
      when(response.message()).thenReturn("Too Many Requests");

      // When/Then
      CompletableFuture<String> result = service.generateNarration(text, pageNumber);

      assertThatThrownBy(() -> result.get()).hasCauseInstanceOf(AudioGenerationException.class);
   }

   @Test
   void generateNarration_WithNetworkError_RetriesAndThrowsException() throws Exception {
      // Given
      String text = "Test narration";
      int pageNumber = 1;

      when(httpClient.newCall(any(Request.class))).thenReturn(call);
      when(call.execute()).thenThrow(new IOException("Connection timeout"));

      // When/Then
      CompletableFuture<String> result = service.generateNarration(text, pageNumber);

      assertThatThrownBy(() -> result.get()).hasCauseInstanceOf(AudioGenerationException.class);

      // Should have retried 3 times
      verify(httpClient, times(3)).newCall(any(Request.class));
   }

   @Test
   void generateSoundEffect_Success() throws Exception {
      // Given
      String effect = "thunder_rumble";
      int pageNumber = 2;

      byte[] mockAudioData = "mock-sound-effect".getBytes();

      when(httpClient.newCall(any(Request.class))).thenReturn(call);
      when(call.execute()).thenReturn(response);
      when(response.isSuccessful()).thenReturn(true);
      when(response.body()).thenReturn(responseBody);
      when(responseBody.bytes()).thenReturn(mockAudioData);
      when(fileStorageService.storeAudio(any(byte[].class), anyString())).thenReturn("audio/effect-thunder_rumble-2.mp3");

      // When
      CompletableFuture<String> result = service.generateSoundEffect(effect, pageNumber);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.get()).contains("thunder_rumble");

      verify(fileStorageService).storeAudio(any(byte[].class), contains("thunder_rumble"));
   }

   @Test
   void generateAllSoundEffects_Success() throws Exception {
      // Given
      List<String> effects = Arrays.asList("wind_howl", "door_creak", "magic_sparkle");
      int pageNumber = 3;

      byte[] mockAudioData = "mock-audio".getBytes();

      when(httpClient.newCall(any(Request.class))).thenReturn(call);
      when(call.execute()).thenReturn(response);
      when(response.isSuccessful()).thenReturn(true);
      when(response.body()).thenReturn(responseBody);
      when(responseBody.bytes()).thenReturn(mockAudioData);
      when(fileStorageService.storeAudio(any(byte[].class), anyString())).thenAnswer(invocation -> "audio/" + invocation.getArgument(1));

      // When
      CompletableFuture<List<String>> result = service.generateAllSoundEffects(effects, pageNumber);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.get()).hasSize(3);
      assertThat(result.get()).allMatch(path -> path.startsWith("audio/"));

      verify(httpClient, times(3)).newCall(any(Request.class));
   }

   @Test
   void estimateAudioDuration_CalculatesCorrectly() {
      // Given
      String shortText = "Hello world";
      String longText = "This is a much longer piece of text that should take more time to narrate when converted to speech";

      // When
      double shortDuration = service.estimateAudioDuration(shortText);
      double longDuration = service.estimateAudioDuration(longText);

      // Then
      assertThat(shortDuration).isGreaterThan(0);
      assertThat(longDuration).isGreaterThan(shortDuration);
      assertThat(longDuration).isLessThan(60); // Reasonable upper bound
   }

   @Test
   void generateNarration_WithEmptyText_ThrowsException() {
      // Given
      String emptyText = "";
      int pageNumber = 1;

      // When/Then
      assertThatThrownBy(() -> service.generateNarration(emptyText, pageNumber)).isInstanceOf(IllegalArgumentException.class);
   }

   @Test
   void generateSoundEffect_WithEmptyEffect_ThrowsException() {
      // Given
      String emptyEffect = "";
      int pageNumber = 1;

      // When/Then
      assertThatThrownBy(() -> service.generateSoundEffect(emptyEffect, pageNumber)).isInstanceOf(IllegalArgumentException.class);
   }
}

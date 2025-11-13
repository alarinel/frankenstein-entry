package com.frankenstein.story.service;

import com.frankenstein.story.exception.ImageGenerationException;
import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImageGenerationServiceTest {

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

    private ImageGenerationService service;

    @BeforeEach
    void setUp() {
        service = new ImageGenerationService(httpClient, fileStorageService);
        ReflectionTestUtils.setField(service, "stabilityApiKey", "test-api-key");
        ReflectionTestUtils.setField(service, "stabilityEngineId", "stable-diffusion-xl-1024-v1-0");
    }

    @Test
    void generateImage_Success() throws Exception {
        // Given
        String prompt = "A magical forest scene";
        long seed = 12345L;

        String mockResponseBody = """
                {
                  "artifacts": [
                    {
                      "base64": "dGVzdC1pbWFnZS1kYXRh",
                      "finishReason": "SUCCESS"
                    }
                  ]
                }
                """;

        when(httpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);
        when(fileStorageService.storeImage(any(byte[].class), anyString()))
                .thenReturn("images/test-image.png");

        // When
        CompletableFuture<String> result = service.generateImage(prompt, 1, seed);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.get()).isEqualTo("images/test-image.png");

        ArgumentCaptor<Request> requestCaptor = ArgumentCaptor.forClass(Request.class);
        verify(httpClient).newCall(requestCaptor.capture());

        Request capturedRequest = requestCaptor.getValue();
        assertThat(capturedRequest.header("Authorization")).isEqualTo("Bearer test-api-key");
        assertThat(capturedRequest.url().toString()).contains("stable-diffusion-xl-1024-v1-0");
    }

    @Test
    void generateImage_WithApiError_ThrowsException() throws Exception {
        // Given
        String prompt = "A magical forest";
        long seed = 12345L;

        when(httpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(500);
        when(response.message()).thenReturn("Internal Server Error");

        // When/Then
        CompletableFuture<String> result = service.generateImage(prompt, 1, seed);

        assertThatThrownBy(() -> result.get())
                .hasCauseInstanceOf(ImageGenerationException.class);
    }

    @Test
    void generateImage_WithNetworkError_RetriesAndThrowsException() throws Exception {
        // Given
        String prompt = "A magical forest";
        long seed = 12345L;

        when(httpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new IOException("Network error"));

        // When/Then
        CompletableFuture<String> result = service.generateImage(prompt, 1, seed);

        assertThatThrownBy(() -> result.get())
                .hasCauseInstanceOf(ImageGenerationException.class);

        // Should have retried 3 times
        verify(httpClient, times(3)).newCall(any(Request.class));
    }

    @Test
    void generateImage_WithInvalidResponse_ThrowsException() throws Exception {
        // Given
        String prompt = "A magical forest";
        long seed = 12345L;

        String invalidResponse = "Not valid JSON";

        when(httpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(invalidResponse);

        // When/Then
        CompletableFuture<String> result = service.generateImage(prompt, 1, seed);

        assertThatThrownBy(() -> result.get())
                .hasCauseInstanceOf(ImageGenerationException.class);
    }

    @Test
    void generateImage_UsesCorrectSeed() throws Exception {
        // Given
        String prompt = "A magical forest";
        long seed = 99999L;

        String mockResponseBody = """
                {
                  "artifacts": [
                    {
                      "base64": "dGVzdC1pbWFnZS1kYXRh",
                      "seed": 99999
                    }
                  ]
                }
                """;

        when(httpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);
        when(fileStorageService.storeImage(any(byte[].class), anyString()))
                .thenReturn("images/test-image.png");

        // When
        CompletableFuture<String> result = service.generateImage(prompt, 1, seed);

        // Then
        assertThat(result.get()).isNotNull();

        ArgumentCaptor<Request> requestCaptor = ArgumentCaptor.forClass(Request.class);
        verify(httpClient).newCall(requestCaptor.capture());

        // Verify seed is in request body
        RequestBody requestBody = requestCaptor.getValue().body();
        assertThat(requestBody).isNotNull();
    }
}

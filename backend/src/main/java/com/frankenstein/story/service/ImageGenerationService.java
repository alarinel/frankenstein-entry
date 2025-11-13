package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.frankenstein.story.exception.StoryGenerationException;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Service for generating images using Stability AI
 */
@Slf4j
@Service
public class ImageGenerationService {

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final int imageWidth;
    private final int imageHeight;
    private final String stylePreset;

    public ImageGenerationService(
            OkHttpClient httpClient,
            ObjectMapper objectMapper,
            @Value("${api.stability.key}") String apiKey,
            @Value("${api.stability.url}") String apiUrl,
            @Value("${api.stability.image-width}") int imageWidth,
            @Value("${api.stability.image-height}") int imageHeight,
            @Value("${api.stability.style-preset}") String stylePreset) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.stylePreset = stylePreset;
    }

    public CompletableFuture<byte[]> generateImage(String prompt, int seed) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Generating image with seed {} for prompt: {}", seed, prompt);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("text_prompts", new Object[]{
                        Map.of("text", prompt, "weight", 1)
                });
                requestBody.put("cfg_scale", 7);
                requestBody.put("height", imageHeight);
                requestBody.put("width", imageWidth);
                requestBody.put("samples", 1);
                requestBody.put("steps", 30);
                requestBody.put("seed", seed);
                requestBody.put("style_preset", stylePreset);

                RequestBody body = RequestBody.create(
                        objectMapper.writeValueAsString(requestBody),
                        MediaType.parse("application/json")
                );

                Request request = new Request.Builder()
                        .url(apiUrl)
                        .addHeader("Authorization", "Bearer " + apiKey)
                        .addHeader("Accept", "application/json")
                        .post(body)
                        .build();

                try (Response response = httpClient.newCall(request).execute()) {
                    if (!response.isSuccessful()) {
                        String errorBody = response.body() != null ? response.body().string() : "No error body";
                        log.error("Stability AI error: {} - {}", response.code(), errorBody);
                        throw new StoryGenerationException("Image generation failed: " + response.code());
                    }

                    String responseBody = response.body().string();
                    Map<String, Object> jsonResponse = objectMapper.readValue(responseBody, Map.class);

                    // Extract base64 image from response
                    if (jsonResponse.containsKey("artifacts")) {
                        Object[] artifacts = (Object[]) jsonResponse.get("artifacts");
                        if (artifacts.length > 0) {
                            Map<String, Object> artifact = (Map<String, Object>) artifacts[0];
                            String base64Image = (String) artifact.get("base64");
                            byte[] imageData = java.util.Base64.getDecoder().decode(base64Image);

                            log.debug("Successfully generated image ({} bytes)", imageData.length);
                            return imageData;
                        }
                    }

                    throw new StoryGenerationException("No image in response");
                }
            } catch (IOException e) {
                log.error("Failed to generate image", e);
                throw new StoryGenerationException("Image generation failed", e);
            }
        });
    }

    public CompletableFuture<byte[]> generateImageWithRetry(String prompt, int seed, int maxRetries) {
        return generateImageWithRetry(prompt, seed, maxRetries, 0);
    }

    private CompletableFuture<byte[]> generateImageWithRetry(String prompt, int seed, int maxRetries, int attempt) {
        return generateImage(prompt, seed)
                .exceptionallyCompose(throwable -> {
                    if (attempt < maxRetries) {
                        log.warn("Image generation failed (attempt {}/{}), retrying...", attempt + 1, maxRetries);
                        try {
                            TimeUnit.SECONDS.sleep(2 * (attempt + 1)); // Exponential backoff
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                        return generateImageWithRetry(prompt, seed, maxRetries, attempt + 1);
                    } else {
                        log.error("Image generation failed after {} attempts", maxRetries);
                        return CompletableFuture.failedFuture(throwable);
                    }
                });
    }
}

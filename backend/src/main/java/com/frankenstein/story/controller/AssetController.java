package com.frankenstein.story.controller;

import com.frankenstein.story.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/stories/{storyId}/assets")
public class AssetController {

    private final FileStorageService fileStorageService;

    public AssetController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/images/page-{pageNumber}.png")
    public ResponseEntity<byte[]> getImage(
            @PathVariable String storyId,
            @PathVariable int pageNumber) {
        try {
            log.debug("Serving image for story {} page {}", storyId, pageNumber);
            byte[] imageData = fileStorageService.loadAsset(storyId, "images/page-" + pageNumber + ".png");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setCacheControl("max-age=3600");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(imageData);
        } catch (IOException e) {
            log.error("Failed to load image", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/audio/narration/page-{pageNumber}.mp3")
    public ResponseEntity<byte[]> getNarration(
            @PathVariable String storyId,
            @PathVariable int pageNumber) {
        try {
            log.debug("Serving narration for story {} page {}", storyId, pageNumber);
            byte[] audioData = fileStorageService.loadAsset(storyId, "audio/narration/page-" + pageNumber + ".mp3");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
            headers.setCacheControl("max-age=3600");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(audioData);
        } catch (IOException e) {
            log.error("Failed to load narration", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/audio/effects/{effectName}.mp3")
    public ResponseEntity<byte[]> getSoundEffect(
            @PathVariable String storyId,
            @PathVariable String effectName) {
        try {
            log.debug("Serving sound effect {} for story {}", effectName, storyId);
            byte[] audioData = fileStorageService.loadAsset(storyId, "audio/effects/" + effectName + ".mp3");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
            headers.setCacheControl("max-age=3600");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(audioData);
        } catch (IOException e) {
            log.error("Failed to load sound effect", e);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
}

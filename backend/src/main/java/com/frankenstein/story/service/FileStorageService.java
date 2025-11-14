package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.frankenstein.story.exception.StoryGenerationException;
import com.frankenstein.story.exception.StoryNotFoundException;
import com.frankenstein.story.model.Story;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class FileStorageService {

   private final Path storageRoot;
   private final ObjectMapper objectMapper;

   public FileStorageService(@Value("${storage.root}") String storageRoot) {
      this.storageRoot = Paths.get(storageRoot);
      this.objectMapper = new ObjectMapper();
      this.objectMapper.registerModule(new JavaTimeModule());
      initializeStorage();
   }

   private void initializeStorage() {
      try {
         Files.createDirectories(storageRoot);
         log.info("Storage initialized at: {}", storageRoot.toAbsolutePath());
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to initialize storage", e);
      }
   }

   public Path getStoryDirectory(String storyId) {
      return storageRoot.resolve(storyId);
   }

   public Path getImagesDirectory(String storyId) {
      return getStoryDirectory(storyId).resolve("images");
   }

   public Path getAudioDirectory(String storyId) {
      return getStoryDirectory(storyId).resolve("audio");
   }

   public Path getNarrationDirectory(String storyId) {
      return getAudioDirectory(storyId).resolve("narration");
   }

   public Path getSoundEffectsDirectory(String storyId) {
      return getAudioDirectory(storyId).resolve("effects");
   }

   public void createStoryDirectories(String storyId) {
      try {
         Files.createDirectories(getImagesDirectory(storyId));
         Files.createDirectories(getNarrationDirectory(storyId));
         Files.createDirectories(getSoundEffectsDirectory(storyId));
         log.debug("Created directories for story: {}", storyId);
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to create story directories", e);
      }
   }

   public void saveStoryMetadata(Story story) {
      try {
         Path metadataPath = getStoryDirectory(story.getId()).resolve("story.json");
         objectMapper.writerWithDefaultPrettyPrinter().writeValue(metadataPath.toFile(), story);
         log.debug("Saved metadata for story: {}", story.getId());
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to save story metadata", e);
      }
   }

   public Story loadStory(String storyId) {
      try {
         Path metadataPath = getStoryDirectory(storyId).resolve("story.json");
         if (!Files.exists(metadataPath)) {
            throw new StoryNotFoundException(storyId);
         }
         return objectMapper.readValue(metadataPath.toFile(), Story.class);
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to load story: " + storyId, e);
      }
   }

   public List<Story> loadAllStories() {
      try (Stream<Path> paths = Files.list(storageRoot)) {
         return paths.filter(Files::isDirectory).map(dir -> {
            try {
               return loadStory(dir.getFileName().toString());
            } catch (Exception e) {
               log.warn("Failed to load story from: {}", dir, e);
               return null;
            }
         }).filter(story -> story != null).collect(Collectors.toList());
      } catch (IOException e) {
         log.error("Failed to list stories", e);
         return new ArrayList<>();
      }
   }

   public void saveImage(String storyId, int pageNumber, byte[] imageData) {
      try {
         Path imagePath = getImagesDirectory(storyId).resolve("page-" + pageNumber + ".png");
         FileUtils.writeByteArrayToFile(imagePath.toFile(), imageData);
         log.debug("Saved image for story {} page {}", storyId, pageNumber);
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to save image", e);
      }
   }

   public void saveNarration(String storyId, int pageNumber, byte[] audioData) {
      try {
         Path audioPath = getNarrationDirectory(storyId).resolve("page-" + pageNumber + ".mp3");
         FileUtils.writeByteArrayToFile(audioPath.toFile(), audioData);
         log.debug("Saved narration for story {} page {}", storyId, pageNumber);
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to save narration", e);
      }
   }

   public void saveSoundEffect(String storyId, String effectName, byte[] audioData) {
      try {
         Path effectPath = getSoundEffectsDirectory(storyId).resolve(effectName + ".mp3");
         FileUtils.writeByteArrayToFile(effectPath.toFile(), audioData);
         log.debug("Saved sound effect {} for story {}", effectName, storyId);
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to save sound effect", e);
      }
   }

   public String getImageUrl(String storyId, int pageNumber) {
      return String.format("/api/stories/%s/assets/images/page-%d.png", storyId, pageNumber);
   }

   public String getNarrationUrl(String storyId, int pageNumber) {
      return String.format("/api/stories/%s/assets/audio/narration/page-%d.mp3", storyId, pageNumber);
   }

   public String getSoundEffectUrl(String storyId, String effectName) {
      return String.format("/api/stories/%s/assets/audio/effects/%s.mp3", storyId, effectName);
   }

   public byte[] loadAsset(String storyId, String assetPath) throws IOException {
      Path fullPath = getStoryDirectory(storyId).resolve(assetPath);
      if (!Files.exists(fullPath)) {
         throw new IOException("Asset not found: " + assetPath);
      }
      return Files.readAllBytes(fullPath);
   }

   public void deleteStory(String storyId) {
      try {
         Path storyDir = getStoryDirectory(storyId);
         if (Files.exists(storyDir)) {
            FileUtils.deleteDirectory(storyDir.toFile());
            log.info("Deleted story: {}", storyId);
         }
      } catch (IOException e) {
         throw new StoryGenerationException("Failed to delete story", e);
      }
   }
}

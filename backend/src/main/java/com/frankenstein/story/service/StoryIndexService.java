package com.frankenstein.story.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryIndexEntry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

/**
 * Service for managing the story index file.
 * Provides thread-safe operations for adding, removing, and retrieving story entries.
 * Maintains a persistent JSON index at storage/story-index.json.
 * 
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StoryIndexService {

    private final ObjectMapper objectMapper;
    
    @Value("${storage.root}")
    private String storageRoot;
    
    private Path indexFilePath;
    
    @PostConstruct
    public void initializeIndex() {
        this.indexFilePath = Paths.get(storageRoot, "story-index.json");
        
        if (!Files.exists(indexFilePath)) {
            log.info("Story index not found, scanning existing stories...");
            rebuildIndexFromStorage();
        } else {
            log.info("Story index found at: {}", indexFilePath.toAbsolutePath());
        }
    }
    
    /**
     * Loads the story index from the JSON file.
     * Returns an empty list if the file doesn't exist.
     * 
     * @return List of story index entries
     */
    private List<StoryIndexEntry> loadIndex() {
        try {
            if (!Files.exists(indexFilePath)) {
                log.debug("Index file does not exist, returning empty list");
                return new ArrayList<>();
            }
            
            List<StoryIndexEntry> entries = objectMapper.readValue(
                indexFilePath.toFile(), 
                new TypeReference<List<StoryIndexEntry>>() {}
            );
            
            log.debug("Loaded {} entries from index", entries.size());
            return entries;
            
        } catch (FileNotFoundException e) {
            log.debug("Index file not found, returning empty list");
            return new ArrayList<>();
        } catch (IOException e) {
            log.error("Failed to read story index file", e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Saves the story index to the JSON file with atomic write operation.
     * Uses a temporary file and atomic move to prevent corruption.
     * 
     * @param entries List of story index entries to save
     */
    private void saveIndex(List<StoryIndexEntry> entries) {
        try {
            // Ensure parent directory exists
            Files.createDirectories(indexFilePath.getParent());
            
            // Write to temporary file first
            Path tempFile = indexFilePath.resolveSibling(indexFilePath.getFileName() + ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter()
                .writeValue(tempFile.toFile(), entries);
            
            // Atomic move to actual file
            Files.move(tempFile, indexFilePath, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            
            log.debug("Saved {} entries to index", entries.size());
            
        } catch (IOException e) {
            log.error("Failed to save story index file", e);
            throw new RuntimeException("Failed to save story index", e);
        }
    }
    
    /**
     * Adds a new story to the index.
     * Thread-safe operation that loads, appends, and saves atomically.
     * 
     * @param storyId The unique identifier of the story
     * @param title The title of the story
     * @param createdAt The creation timestamp
     */
    public synchronized void addStoryToIndex(String storyId, String title, LocalDateTime createdAt) {
        try {
            List<StoryIndexEntry> entries = loadIndex();
            
            // Check if story already exists
            boolean exists = entries.stream()
                .anyMatch(entry -> entry.getId().equals(storyId));
            
            if (exists) {
                log.debug("Story {} already exists in index, skipping", storyId);
                return;
            }
            
            // Add new entry
            StoryIndexEntry newEntry = StoryIndexEntry.builder()
                .id(storyId)
                .title(title)
                .createdAt(createdAt)
                .build();
            
            entries.add(newEntry);
            saveIndex(entries);
            
            log.info("Added story {} to index", storyId);
            
        } catch (Exception e) {
            log.error("Failed to add story {} to index", storyId, e);
            // Don't throw - index update failure shouldn't fail story generation
        }
    }
    
    /**
     * Removes a story from the index.
     * Thread-safe operation that loads, filters, and saves atomically.
     * 
     * @param storyId The unique identifier of the story to remove
     */
    public synchronized void removeStoryFromIndex(String storyId) {
        try {
            List<StoryIndexEntry> entries = loadIndex();
            
            int originalSize = entries.size();
            entries.removeIf(entry -> entry.getId().equals(storyId));
            
            if (entries.size() < originalSize) {
                saveIndex(entries);
                log.info("Removed story {} from index", storyId);
            } else {
                log.debug("Story {} not found in index", storyId);
            }
            
        } catch (Exception e) {
            log.error("Failed to remove story {} from index", storyId, e);
            throw new RuntimeException("Failed to remove story from index", e);
        }
    }
    
    /**
     * Retrieves all stories from the index, sorted by creation date descending.
     * 
     * @return List of story index entries, newest first
     */
    public List<StoryIndexEntry> getAllStories() {
        List<StoryIndexEntry> entries = loadIndex();
        
        // Sort by createdAt descending (newest first)
        entries.sort(Comparator.comparing(StoryIndexEntry::getCreatedAt).reversed());
        
        return entries;
    }
    
    /**
     * Checks if a story exists in the index.
     * 
     * @param storyId The unique identifier of the story
     * @return true if the story exists in the index, false otherwise
     */
    public boolean storyExists(String storyId) {
        List<StoryIndexEntry> entries = loadIndex();
        return entries.stream()
            .anyMatch(entry -> entry.getId().equals(storyId));
    }
    
    /**
     * Rebuilds the index by scanning the storage directory for existing stories.
     * Called automatically if the index file doesn't exist on startup.
     */
    private void rebuildIndexFromStorage() {
        try {
            Path storageDir = Paths.get(storageRoot);
            
            if (!Files.exists(storageDir)) {
                log.info("Storage directory does not exist, creating empty index");
                saveIndex(new ArrayList<>());
                return;
            }
            
            List<StoryIndexEntry> entries = new ArrayList<>();
            
            // Scan all directories in storage
            try (Stream<Path> paths = Files.list(storageDir)) {
                paths.filter(Files::isDirectory)
                    .forEach(storyDir -> {
                        try {
                            Path storyJsonPath = storyDir.resolve("story.json");
                            
                            if (Files.exists(storyJsonPath)) {
                                // Load story metadata
                                ObjectMapper mapper = new ObjectMapper();
                                mapper.registerModule(new JavaTimeModule());
                                Story story = mapper.readValue(storyJsonPath.toFile(), Story.class);
                                
                                // Add to index
                                StoryIndexEntry entry = StoryIndexEntry.builder()
                                    .id(story.getId())
                                    .title(story.getTitle())
                                    .createdAt(story.getCreatedAt())
                                    .build();
                                
                                entries.add(entry);
                                log.debug("Added story {} to rebuilt index", story.getId());
                            }
                        } catch (Exception e) {
                            log.warn("Failed to load story from directory: {}", storyDir, e);
                        }
                    });
            }
            
            // Save the rebuilt index
            saveIndex(entries);
            log.info("Rebuilt index with {} stories", entries.size());
            
        } catch (IOException e) {
            log.error("Failed to rebuild index from storage", e);
            // Create empty index as fallback
            saveIndex(new ArrayList<>());
        }
    }
}

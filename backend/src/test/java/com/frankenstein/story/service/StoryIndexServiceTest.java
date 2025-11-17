package com.frankenstein.story.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.frankenstein.story.model.StoryIndexEntry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for StoryIndexService
 * 
 * @author alarinel@gmail.com
 */
class StoryIndexServiceTest {

    @TempDir
    Path tempDir;

    private StoryIndexService service;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        
        service = new StoryIndexService(objectMapper);
        ReflectionTestUtils.setField(service, "storageRoot", tempDir.toString());
        service.initializeIndex();
    }

    @Test
    void addStoryToIndex_CreatesNewIndex_WhenFileDoesNotExist() {
        // Given
        final String storyId = "test-story-1";
        final String title = "Test Story";
        final LocalDateTime createdAt = LocalDateTime.now();

        // When
        service.addStoryToIndex(storyId, title, createdAt);

        // Then
        final List<StoryIndexEntry> stories = service.getAllStories();
        assertThat(stories).hasSize(1);
        assertThat(stories.get(0).getId()).isEqualTo(storyId);
        assertThat(stories.get(0).getTitle()).isEqualTo(title);
        assertThat(stories.get(0).getCreatedAt()).isEqualTo(createdAt);
    }

    @Test
    void addStoryToIndex_AppendsToExistingIndex() {
        // Given
        final String storyId1 = "story-1";
        final String storyId2 = "story-2";
        final LocalDateTime now = LocalDateTime.now();

        // When
        service.addStoryToIndex(storyId1, "First Story", now.minusDays(1));
        service.addStoryToIndex(storyId2, "Second Story", now);

        // Then
        final List<StoryIndexEntry> stories = service.getAllStories();
        assertThat(stories).hasSize(2);
        assertThat(stories.get(0).getId()).isEqualTo(storyId2); // Newest first
        assertThat(stories.get(1).getId()).isEqualTo(storyId1);
    }

    @Test
    void addStoryToIndex_SkipsDuplicates() {
        // Given
        final String storyId = "duplicate-story";
        final LocalDateTime createdAt = LocalDateTime.now();

        // When
        service.addStoryToIndex(storyId, "Original Title", createdAt);
        service.addStoryToIndex(storyId, "Duplicate Title", createdAt);

        // Then
        final List<StoryIndexEntry> stories = service.getAllStories();
        assertThat(stories).hasSize(1);
        assertThat(stories.get(0).getTitle()).isEqualTo("Original Title");
    }

    @Test
    void removeStoryFromIndex_RemovesEntry() {
        // Given
        final String storyId = "story-to-remove";
        service.addStoryToIndex(storyId, "Story to Remove", LocalDateTime.now());
        service.addStoryToIndex("story-to-keep", "Story to Keep", LocalDateTime.now());

        // When
        service.removeStoryFromIndex(storyId);

        // Then
        final List<StoryIndexEntry> stories = service.getAllStories();
        assertThat(stories).hasSize(1);
        assertThat(stories.get(0).getId()).isEqualTo("story-to-keep");
    }

    @Test
    void removeStoryFromIndex_HandlesNonExistentStory() {
        // Given
        service.addStoryToIndex("existing-story", "Existing Story", LocalDateTime.now());

        // When
        service.removeStoryFromIndex("non-existent-story");

        // Then
        final List<StoryIndexEntry> stories = service.getAllStories();
        assertThat(stories).hasSize(1);
        assertThat(stories.get(0).getId()).isEqualTo("existing-story");
    }

    @Test
    void getAllStories_ReturnsSortedByDateDesc() {
        // Given
        final LocalDateTime now = LocalDateTime.now();
        service.addStoryToIndex("story-1", "Oldest Story", now.minusDays(2));
        service.addStoryToIndex("story-2", "Middle Story", now.minusDays(1));
        service.addStoryToIndex("story-3", "Newest Story", now);

        // When
        final List<StoryIndexEntry> stories = service.getAllStories();

        // Then
        assertThat(stories).hasSize(3);
        assertThat(stories.get(0).getId()).isEqualTo("story-3"); // Newest
        assertThat(stories.get(1).getId()).isEqualTo("story-2");
        assertThat(stories.get(2).getId()).isEqualTo("story-1"); // Oldest
    }

    @Test
    void getAllStories_ReturnsEmptyList_WhenNoIndex() {
        // When
        final List<StoryIndexEntry> stories = service.getAllStories();

        // Then
        assertThat(stories).isEmpty();
    }

    @Test
    void storyExists_ReturnsTrue_WhenStoryInIndex() {
        // Given
        final String storyId = "existing-story";
        service.addStoryToIndex(storyId, "Existing Story", LocalDateTime.now());

        // When
        final boolean exists = service.storyExists(storyId);

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    void storyExists_ReturnsFalse_WhenStoryNotInIndex() {
        // Given
        service.addStoryToIndex("other-story", "Other Story", LocalDateTime.now());

        // When
        final boolean exists = service.storyExists("non-existent-story");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    void concurrentAdditions_MaintainDataIntegrity() throws InterruptedException {
        // Given
        final int threadCount = 10;
        final ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        final CountDownLatch latch = new CountDownLatch(threadCount);
        final AtomicInteger successCount = new AtomicInteger(0);

        // When - Add stories concurrently
        for (int i = 0; i < threadCount; i++) {
            final int storyNum = i;
            executor.submit(() -> {
                try {
                    service.addStoryToIndex(
                        "concurrent-story-" + storyNum,
                        "Concurrent Story " + storyNum,
                        LocalDateTime.now()
                    );
                    successCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Then
        final List<StoryIndexEntry> stories = service.getAllStories();
        assertThat(stories).hasSize(threadCount);
        assertThat(successCount.get()).isEqualTo(threadCount);
    }

    @Test
    void initializeIndex_CreatesEmptyIndex_WhenStorageDirectoryDoesNotExist() {
        // Given - Fresh service with non-existent storage
        final Path nonExistentDir = tempDir.resolve("non-existent");
        final StoryIndexService newService = new StoryIndexService(objectMapper);
        ReflectionTestUtils.setField(newService, "storageRoot", nonExistentDir.toString());

        // When
        newService.initializeIndex();

        // Then
        final List<StoryIndexEntry> stories = newService.getAllStories();
        assertThat(stories).isEmpty();
    }

    @Test
    void indexFile_IsPersisted() throws Exception {
        // Given
        final String storyId = "persisted-story";
        service.addStoryToIndex(storyId, "Persisted Story", LocalDateTime.now());

        // When - Create new service instance
        final StoryIndexService newService = new StoryIndexService(objectMapper);
        ReflectionTestUtils.setField(newService, "storageRoot", tempDir.toString());
        newService.initializeIndex();

        // Then - Should load existing index
        final List<StoryIndexEntry> stories = newService.getAllStories();
        assertThat(stories).hasSize(1);
        assertThat(stories.get(0).getId()).isEqualTo(storyId);
    }

    @Test
    void indexFile_IsCreatedAtCorrectLocation() {
        // Given
        service.addStoryToIndex("test-story", "Test Story", LocalDateTime.now());

        // Then
        final Path indexFile = tempDir.resolve("story-index.json");
        assertThat(Files.exists(indexFile)).isTrue();
    }
}

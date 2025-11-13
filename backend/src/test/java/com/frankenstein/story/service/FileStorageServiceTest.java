package com.frankenstein.story.service;

import com.frankenstein.story.exception.FileStorageException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService service;

    @BeforeEach
    void setUp() {
        service = new FileStorageService();
        ReflectionTestUtils.setField(service, "storageLocation", tempDir.toString());
        service.init();
    }

    @Test
    void storeImage_Success() {
        // Given
        byte[] imageData = "fake-image-data".getBytes();
        String filename = "test-image.png";

        // When
        String storedPath = service.storeImage(imageData, filename);

        // Then
        assertThat(storedPath).isNotNull();
        assertThat(storedPath).contains("images");
        assertThat(storedPath).contains(filename);

        Path imagePath = tempDir.resolve(storedPath);
        assertThat(Files.exists(imagePath)).isTrue();
    }

    @Test
    void storeAudio_Success() {
        // Given
        byte[] audioData = "fake-audio-data".getBytes();
        String filename = "test-audio.mp3";

        // When
        String storedPath = service.storeAudio(audioData, filename);

        // Then
        assertThat(storedPath).isNotNull();
        assertThat(storedPath).contains("audio");
        assertThat(storedPath).contains(filename);

        Path audioPath = tempDir.resolve(storedPath);
        assertThat(Files.exists(audioPath)).isTrue();
    }

    @Test
    void loadAsBytes_Success() throws IOException {
        // Given
        byte[] originalData = "test-content".getBytes();
        Path testFile = tempDir.resolve("images").resolve("test.png");
        Files.createDirectories(testFile.getParent());
        Files.write(testFile, originalData);

        // When
        byte[] loadedData = service.loadAsBytes("images/test.png");

        // Then
        assertThat(loadedData).isEqualTo(originalData);
    }

    @Test
    void loadAsBytes_FileNotFound_ThrowsException() {
        // Given
        String nonExistentFile = "images/does-not-exist.png";

        // When/Then
        assertThatThrownBy(() -> service.loadAsBytes(nonExistentFile))
                .isInstanceOf(FileStorageException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void storeImage_WithNullData_ThrowsException() {
        // Given
        byte[] nullData = null;
        String filename = "test.png";

        // When/Then
        assertThatThrownBy(() -> service.storeImage(nullData, filename))
                .isInstanceOf(NullPointerException.class);
    }

    @Test
    void storeAudio_WithNullFilename_ThrowsException() {
        // Given
        byte[] audioData = "test-data".getBytes();
        String nullFilename = null;

        // When/Then
        assertThatThrownBy(() -> service.storeAudio(audioData, nullFilename))
                .isInstanceOf(NullPointerException.class);
    }

    @Test
    void deleteFile_Success() throws IOException {
        // Given
        byte[] data = "test-data".getBytes();
        String storedPath = service.storeImage(data, "to-delete.png");
        Path filePath = tempDir.resolve(storedPath);
        assertThat(Files.exists(filePath)).isTrue();

        // When
        service.deleteFile(storedPath);

        // Then
        assertThat(Files.exists(filePath)).isFalse();
    }

    @Test
    void init_CreatesDirectories() {
        // Given
        Path imagesDir = tempDir.resolve("images");
        Path audioDir = tempDir.resolve("audio");

        // When - init() is called in @BeforeEach

        // Then
        assertThat(Files.exists(imagesDir)).isTrue();
        assertThat(Files.isDirectory(imagesDir)).isTrue();
        assertThat(Files.exists(audioDir)).isTrue();
        assertThat(Files.isDirectory(audioDir)).isTrue();
    }

    @Test
    void storeImage_GeneratesUniqueFilenames() {
        // Given
        byte[] data1 = "image1".getBytes();
        byte[] data2 = "image2".getBytes();
        String filename = "same-name.png";

        // When
        String path1 = service.storeImage(data1, filename);
        String path2 = service.storeImage(data2, filename);

        // Then
        assertThat(path1).isNotEqualTo(path2);
        assertThat(Files.exists(tempDir.resolve(path1))).isTrue();
        assertThat(Files.exists(tempDir.resolve(path2))).isTrue();
    }
}

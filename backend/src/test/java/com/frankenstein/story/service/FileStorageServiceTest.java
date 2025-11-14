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
      final byte[] imageData = "fake-image-data".getBytes();
      final String filename = "test-image.png";

      // When
      final String storedPath = service.storeImage(imageData, filename);

      // Then
      assertThat(storedPath).isNotNull();
      assertThat(storedPath).contains("images");
      assertThat(storedPath).contains(filename);

      final Path imagePath = tempDir.resolve(storedPath);
      assertThat(Files.exists(imagePath)).isTrue();
   }

   @Test
   void storeAudio_Success() {
      // Given
      final byte[] audioData = "fake-audio-data".getBytes();
      final String filename = "test-audio.mp3";

      // When
      final String storedPath = service.storeAudio(audioData, filename);

      // Then
      assertThat(storedPath).isNotNull();
      assertThat(storedPath).contains("audio");
      assertThat(storedPath).contains(filename);

      final Path audioPath = tempDir.resolve(storedPath);
      assertThat(Files.exists(audioPath)).isTrue();
   }

   @Test
   void loadAsBytes_Success() throws IOException {
      // Given
      final byte[] originalData = "test-content".getBytes();
      final Path testFile = tempDir.resolve("images").resolve("test.png");
      Files.createDirectories(testFile.getParent());
      Files.write(testFile, originalData);

      // When
      final byte[] loadedData = service.loadAsBytes("images/test.png");

      // Then
      assertThat(loadedData).isEqualTo(originalData);
   }

   @Test
   void loadAsBytes_FileNotFound_ThrowsException() {
      // Given
      final String nonExistentFile = "images/does-not-exist.png";

      // When/Then
      assertThatThrownBy(() -> service.loadAsBytes(nonExistentFile)).isInstanceOf(FileStorageException.class).hasMessageContaining("not found");
   }

   @Test
   void storeImage_WithNullData_ThrowsException() {
      // Given
      final byte[] nullData = null;
      final String filename = "test.png";

      // When/Then
      assertThatThrownBy(() -> service.storeImage(nullData, filename)).isInstanceOf(NullPointerException.class);
   }

   @Test
   void storeAudio_WithNullFilename_ThrowsException() {
      // Given
      final byte[] audioData = "test-data".getBytes();
      final String nullFilename = null;

      // When/Then
      assertThatThrownBy(() -> service.storeAudio(audioData, nullFilename)).isInstanceOf(NullPointerException.class);
   }

   @Test
   void deleteFile_Success() throws IOException {
      // Given
      final byte[] data = "test-data".getBytes();
      final String storedPath = service.storeImage(data, "to-delete.png");
      final Path filePath = tempDir.resolve(storedPath);
      assertThat(Files.exists(filePath)).isTrue();

      // When
      service.deleteFile(storedPath);

      // Then
      assertThat(Files.exists(filePath)).isFalse();
   }

   @Test
   void init_CreatesDirectories() {
      // Given
      final Path imagesDir = tempDir.resolve("images");
      final Path audioDir = tempDir.resolve("audio");

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
      final byte[] data1 = "image1".getBytes();
      final byte[] data2 = "image2".getBytes();
      final String filename = "same-name.png";

      // When
      final String path1 = service.storeImage(data1, filename);
      final String path2 = service.storeImage(data2, filename);

      // Then
      assertThat(path1).isNotEqualTo(path2);
      assertThat(Files.exists(tempDir.resolve(path1))).isTrue();
      assertThat(Files.exists(tempDir.resolve(path2))).isTrue();
   }
}

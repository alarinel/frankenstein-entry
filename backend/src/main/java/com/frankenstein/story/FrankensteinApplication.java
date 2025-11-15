package com.frankenstein.story;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application class for Frankenstein Story Generator
 *
 * @author alarinel@gmail.com
 */
@SpringBootApplication
@EnableAsync
public class FrankensteinApplication {

   public static void main(final String[] args) {
      // Initialize API tracking on startup
      initializeApiTracking();
      // Load .env file if it exists
      try {
         // Try multiple locations for .env file
         Dotenv dotenv = null;

         // Try current directory first
         try {
            dotenv = Dotenv.configure().directory("./").load();
            System.out.println("✓ Loaded .env file from current directory");
         } catch (final Exception e1) {
            // Try backend directory
            try {
               dotenv = Dotenv.configure().directory("./backend").load();
               System.out.println("✓ Loaded .env file from backend directory");
            } catch (final Exception e2) {
               // Try parent directory
               try {
                  dotenv = Dotenv.configure().directory("../").load();
                  System.out.println("✓ Loaded .env file from parent directory");
               } catch (final Exception e3) {
                  System.out.println("⚠ No .env file found in any location, using system environment variables");
               }
            }
         }

         // Set environment variables from .env file
         if (dotenv != null) {
            dotenv.entries().forEach(entry -> {
               System.setProperty(entry.getKey(), entry.getValue());
               System.out.println("  - Loaded: " + entry.getKey());
            });
         }

      } catch (final Exception e) {
         System.out.println("⚠ Error loading .env file: " + e.getMessage());
      }

      SpringApplication.run(FrankensteinApplication.class, args);
   }
   
   private static void initializeApiTracking() {
      try {
         java.nio.file.Files.createDirectories(java.nio.file.Paths.get("storage/api-tracking"));
         System.out.println("✓ API tracking initialized");
      } catch (Exception e) {
         System.out.println("⚠ Failed to initialize API tracking: " + e.getMessage());
      }
   }
}

package com.frankenstein.story.service.orchestration;

import com.frankenstein.story.model.Story;
import com.frankenstein.story.model.StoryMetadata;
import com.frankenstein.story.model.StoryPage;
import com.frankenstein.story.model.StoryStructure;
import com.frankenstein.story.model.orchestration.AudioSet;
import com.frankenstein.story.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of story assembly service
 *
 * @author alarinel@gmail.com
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StoryAssemblyServiceImpl implements StoryAssemblyService {

   private final FileStorageService fileStorageService;

   @Override
   public void assembleStory(final Story story, final StoryStructure structure, final List<byte[]> images, final List<AudioSet> audioSets) {
      log.info("Assembling story: {}", story.getId());

      final List<StoryPage> pages = new ArrayList<>();
      double totalDuration = 0;

      for (int i = 0; i < structure.getPages().size(); i++) {
         final StoryStructure.PageStructure pageStructure = structure.getPages().get(i);
         final AudioSet audioSet = audioSets.get(i);

         final StoryPage page = createStoryPage(story.getId(), i, pageStructure, audioSet);
         pages.add(page);
         totalDuration += audioSet.getDuration();
      }

      story.setPages(pages);
      story.setMetadata(createMetadata(structure, totalDuration, pages.size()));

      log.info("Story assembly complete: {} pages, {} seconds", pages.size(), totalDuration);
   }

   private StoryPage createStoryPage(final String storyId, final int index, final StoryStructure.PageStructure pageStructure, final AudioSet audioSet) {
      final int pageNumber = index + 1;

      return StoryPage.builder()
                      .pageNumber(pageNumber)
                      .text(pageStructure.getText())
                      .imagePrompt(pageStructure.getImagePrompt())
                      .imageUrl(fileStorageService.getImageUrl(storyId, pageNumber))
                      .narrationUrl(fileStorageService.getNarrationUrl(storyId, pageNumber))
                      .backgroundMusic(pageStructure.getBackgroundMusic())
                      .mood(pageStructure.getMood())
                      .duration(audioSet.getDuration())
                      .build();
   }

   private StoryMetadata createMetadata(final StoryStructure structure, final double totalDuration, final int pageCount) {
      return StoryMetadata.builder()
                          .imageSeed(structure.getImageSeed())
                          .totalDuration(totalDuration)
                          .pageCount(pageCount)
                          .estimatedReadTime(formatDuration(totalDuration))
                          .build();
   }

   private String formatDuration(final double seconds) {
      final int minutes = (int) (seconds / 60);
      final int secs = (int) (seconds % 60);
      return String.format("%d:%02d", minutes, secs);
   }
}

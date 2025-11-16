package com.frankenstein.story.model.orchestration;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Data structure for audio generation results
 *
 * @author alarinel@gmail.com
 */
@Data
@Builder
public class AudioSet {
   private byte[] narration;
   private List<byte[]> effects;
   private double duration;
}

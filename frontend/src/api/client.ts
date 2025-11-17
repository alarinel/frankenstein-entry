import axios from 'axios';
import {
  Story,
  StoryInput,
  GenerateStoryResponse,
  StoryStatusResponse,
  StoryIndexEntry,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const storyApi = {
  generateStory: async (input: StoryInput): Promise<GenerateStoryResponse> => {
    const response = await client.post<GenerateStoryResponse>('/stories/generate', input);
    return response.data;
  },

  getStory: async (storyId: string): Promise<Story> => {
    const response = await client.get<Story>(`/stories/${storyId}`);
    return response.data;
  },

  getStoryStatus: async (storyId: string): Promise<StoryStatusResponse> => {
    const response = await client.get<StoryStatusResponse>(`/stories/${storyId}/status`);
    return response.data;
  },

  getAllStories: async (): Promise<Story[]> => {
    const response = await client.get<Story[]>('/stories');
    return response.data;
  },

  getStoryList: async (): Promise<StoryIndexEntry[]> => {
    try {
      const response = await client.get<StoryIndexEntry[]>('/stories/list');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch story list:', error);
      throw error;
    }
  },

  deleteStory: async (storyId: string): Promise<void> => {
    try {
      await client.delete(`/stories/${storyId}`);
    } catch (error) {
      console.error(`Failed to delete story ${storyId}:`, error);
      throw error;
    }
  },

  getAssetUrl: (url: string): string => {
    // If URL already starts with /api, don't prepend base URL
    if (url.startsWith('/api')) {
      return url;
    }
    return `${API_BASE_URL}${url}`;
  },
};

export default client;

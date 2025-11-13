import axios from 'axios';
import {
  Story,
  StoryInput,
  GenerateStoryResponse,
  StoryStatusResponse,
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

  getAssetUrl: (url: string): string => {
    // If URL already starts with /api, don't prepend base URL
    if (url.startsWith('/api')) {
      return url;
    }
    return `${API_BASE_URL}${url}`;
  },
};

export default client;

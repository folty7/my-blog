import apiClient from './client';
import type { Post } from '../types/post';

export const postService = {
  // GET all posts
  getAllPosts: async (): Promise<Post[]> => {
    // We expect the backend to return an array of posts
    const response = await apiClient.get('/posts');
    return response.data;
  },

  // GET a single post by slug
  getPostBySlug: async (slug: string): Promise<Post> => {
    const response = await apiClient.get(`/posts/${slug}`);
    return response.data;
  },

  // GET a single post by ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await apiClient.get(`/posts/id/${id}`);
    return response.data;
  },

  // GET user's personal posts
  getMyPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get('/posts/my-posts');
    return response.data;
  },

  // POST a new post
  createPost: async (data: { title: string; slug: string; content: string; tags: string[] }): Promise<Post> => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  // PATCH an existing post
  updatePost: async (id: number, data: Partial<{ title: string; slug: string; content: string; tags: string[] }>): Promise<Post> => {
    const response = await apiClient.patch(`/posts/${id}`, data);
    return response.data;
  },

  // DELETE a post
  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  }
};

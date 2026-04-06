import apiClient from './client';
import type { Comment } from '../types/post';

export const commentService = {
  // GET comments for a specific post
  getCommentsForPost: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/comments/post/${postId}`);
    return response.data;
  },

  // POST a new comment
  addComment: async (data: { content: string; postId: number }): Promise<Comment> => {
    const response = await apiClient.post('/comments', data);
    return response.data;
  },

  // DELETE a comment
  deleteComment: async (id: number): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  }
};

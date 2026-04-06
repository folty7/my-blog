import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../api/commentService';
import { useAuthStore } from '../store/authStore';
import { Send, Trash2, MessageCircle, AlertCircle } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // 1. Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getCommentsForPost(postId),
  });

  // 2. Mutation for adding a comment
  const addMutation = useMutation({
    mutationFn: (content: string) => commentService.addComment({ content, postId }),
    onSuccess: () => {
      // This triggers an automatic background re-fetch of the comments list!
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
    },
  });

  // 3. Mutation for deleting a comment
  const deleteMutation = useMutation({
    mutationFn: (id: number) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addMutation.mutate(newComment);
  };

  if (isLoading) return <p>Loading thoughts...</p>;

  return (
    <div className="comments-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
        <MessageCircle size={24} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Discussion ({comments?.length || 0})</h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="auth-form" style={{ marginBottom: '3rem' }}>
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              style={{ minHeight: '100px', padding: '1rem' }}
              disabled={addMutation.isPending}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: 'auto', display: 'flex', gap: '8px' }}
            disabled={addMutation.isPending || !newComment.trim()}
          >
            <Send size={18} />
            <span>{addMutation.isPending ? 'Posting...' : 'Post Comment'}</span>
          </button>

          {addMutation.isError && (
            <p className="field-error" style={{ marginTop: '1rem' }}>
              {getApiError(addMutation.error)}
            </p>
          )}
        </form>
      ) : (
        <div className="auth-card" style={{ maxWidth: 'none', textAlign: 'center', marginBottom: '3rem', padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Want to join the discussion? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in here</a>
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments?.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No comments yet. Be the first to start the conversation!
          </p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="comment-author">{comment.author.name}</span>

                {/* Security Check: Only show delete if user owns the comment */}
                {user?.name === comment.author.name && (
                  <button
                    onClick={() => deleteMutation.mutate(comment.id)}
                    className="btn-logout"
                    title="Delete your comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <p style={{ fontSize: '1rem', color: '#475569', marginTop: '0.5rem' }}>
                {comment.content}
              </p>

              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

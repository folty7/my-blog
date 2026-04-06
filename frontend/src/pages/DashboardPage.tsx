import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postService } from '../api/postService';
import { Edit2, Trash2, Plus, MessageSquare, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const queryClient = useQueryClient();

  // 1. Fetch only my posts
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['my-posts'],
    queryFn: postService.getMyPosts,
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => postService.deletePost(id),
    onSuccess: () => {
      // Refresh the list after deleting
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      // Also invalidate main feed just in case
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-display" style={{ fontSize: '3rem' }}>My Dashboard</h1>
          <p className="subtitle">Manage your published stories and drafts.</p>
        </div>
        <Link to="/create-post" className="btn-primary" style={{ display: 'flex', gap: '8px', width: 'auto' }}>
          <Plus size={20} /> <span>Write New Post</span>
        </Link>
      </div>

      {isError && (
        <div className="form-error">
          <AlertCircle size={18} />
          <span>Failed to load your posts.</span>
        </div>
      )}

      {posts?.length === 0 ? (
        <div className="auth-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="subtitle">You haven't written any posts yet.</p>
          <Link to="/create-post" style={{ color: 'var(--primary)', fontWeight: 600 }}>Start your first story →</Link>
        </div>
      ) : (
        <div className="post-grid">
          {posts?.map((post) => (
            <article key={post.id} className="post-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div className="tags-row" style={{ margin: 0 }}>
                  {post.tags.map(t => <span key={t.id} className="tag-badge">#{t.name}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to={`/edit-post/${post.id}`}
                    className="btn-logout"
                    style={{ padding: '6px', color: 'var(--primary)', border: '1px solid #e2e8f0' }}
                    title="Edit post"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="btn-logout"
                    style={{ padding: '6px', color: '#ef4444', border: '1px solid #fee2e2' }}
                    title="Delete post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h2 className="title" style={{ fontSize: '1.25rem' }}>
                <Link to={`/post/${post.slug}`}>{post.title}</Link>
              </h2>

              <div className="post-meta" style={{ border: 'none', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={14} />
                  <span>{post._count?.comments || 0} comments</span>
                </div>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

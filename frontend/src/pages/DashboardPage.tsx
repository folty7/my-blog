import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postService } from '../api/postService';
import { Edit2, Trash2, Plus, MessageSquare, AlertCircle } from 'lucide-react';
import GridContainer from '../components/GridContainer';

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
    <>
      <GridContainer showPattern={true} style={{ padding: '6rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="text-display" style={{ fontSize: '3rem' }}>My Dashboard</h1>
            <p className="subtitle">Manage your published stories and drafts.</p>
          </div>
          <Link to="/create-post" className="btn-primary" style={{ display: 'flex', gap: '8px', width: 'auto' }}>
            <Plus size={20} /> <span>Write New Post</span>
          </Link>
        </div>

        {isError && (
          <div className="form-error" style={{ marginTop: '2rem' }}>
            <AlertCircle size={18} />
            <span>Failed to load your posts.</span>
          </div>
        )}
      </GridContainer>

      <div>
        {posts?.length === 0 ? (
          <GridContainer style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <p className="subtitle">You haven't written any posts yet.</p>
            <Link to="/create-post" style={{ color: 'var(--primary)', fontWeight: 600 }}>Start your first story →</Link>
          </GridContainer>
        ) : (
          <div className="post-list" style={{ display: 'flex', flexDirection: 'column' }}>
            {posts?.map((post) => (
              <GridContainer key={post.id} style={{ padding: '2.5rem 2rem' }}>
                <article className="post-card" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div className="tags-row" style={{ margin: 0 }}>
                      {post.tags.map(t => <span key={t.id} className="tag-badge">#{t.name}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="btn-logout"
                        style={{ padding: '8px', color: 'var(--primary)', borderColor: 'var(--border-color)' }}
                        title="Edit post"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="btn-logout"
                        style={{ padding: '8px', color: '#ef4444', borderColor: 'var(--border-color)' }}
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
              </GridContainer>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postService } from '../api/postService';
import { Clock, MessageSquare, User as UserIcon, AlertCircle } from 'lucide-react';

export default function HomePage() {

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getAllPosts,
  });

  if (isLoading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Fetching latest posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-12">
        <div className="form-error">
          <AlertCircle size={20} />
          <span>Error loading posts: {(error as any).message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-display">The Fullstack Blog</h1>
        <p className="subtitle">Insights, tutorials and stories from our community.</p>
      </div>

      <div className="post-grid">
        {posts?.map((post) => (
          <article key={post.id} className="post-card">
            <div className="tags-row">
              {post.tags.map((tag) => (
                <span key={tag.id} className="tag-badge">#{tag.name}</span>
              ))}
            </div>

            <h2 className="title">
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="excerpt">
              {post.content.length > 150
                ? post.content.substring(0, 150) + '...'
                : post.content}
            </p>

            <div className="post-meta">
              <div className="user-info">
                <UserIcon size={14} />
                <span className="author-name">{post.author.name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>

              {post._count && post._count.comments > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
                  <MessageSquare size={14} />
                  <span>{post._count.comments}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="subtitle">No posts found. Be the first to write one!</p>
          <Link to="/create-post" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
            Write a Post
          </Link>
        </div>
      )}
    </div>
  );
}

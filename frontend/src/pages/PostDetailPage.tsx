import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../api/postService';
import { User as UserIcon, ArrowLeft, Calendar } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';
import CommentsSection from '../components/CommentsSection';

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch only this specific post by slug
  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postService.getPostBySlug(slug!),
    enabled: !!slug, // only run if slug is present
  });

  if (isLoading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Opening the story...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container py-12 text-center">
        <div className="form-error" style={{ display: 'inline-flex' }}>
          <span>{getApiError(error, "Could not find this article.")}</span>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container post-detail-container">
      <Link to="/" className="btn-logout" style={{ marginBottom: '2rem', display: 'inline-flex', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
        <ArrowLeft size={18} /> <span>Back home</span>
      </Link>

      <header className="post-header">
        <div className="tags-row">
          {post.tags.map((tag) => (
            <span key={tag.id} className="tag-badge">#{tag.name}</span>
          ))}
        </div>

        <h1 className="title-large">{post.title}</h1>

        <div className="post-meta" style={{ border: 'none', padding: 0 }}>
          <div className="user-info">
            <UserIcon size={18} />
            <span className="author-name" style={{ fontSize: '1rem' }}>{post.author.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <Calendar size={16} />
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </header>

      <div className="post-content">
        {/* We map paragraphs to actual <p> tags for better spacing in CSS */}
        {post.content.split('\n').map((para, idx) => (
          para ? <p key={idx}>{para}</p> : <br key={idx} />
        ))}
      </div>

      <CommentsSection postId={post.id} />
    </article>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../api/postService';
import { getApiError } from '../../utils/errorHandler';
import { ArrowLeft } from 'lucide-react';
import CommentsSection from '../components/CommentsSection';
import GridContainer from '../components/GridContainer';

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
    <>
      <GridContainer
        wrapperClassName="hero-section"
        showPattern={!post.imageUrl}
        style={{
          position: 'relative',
          padding: '8rem 2rem',
          textAlign: 'center',
          zIndex: 10,
          backgroundImage: post.imageUrl ? `url(http://localhost:3000${post.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Subtle hero gradient background or deep overlay if image exists */}
        <div style={{
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: post.imageUrl ? 0.7 : 0.2,
          background: post.imageUrl
            ? 'linear-gradient(to bottom, rgba(14,14,20,0.8), rgba(14,14,20,0.95))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        <Link
          to="/"
          className="mono-text"
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            padding: '0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: '50px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 20
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.borderColor = 'var(--text-main)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--primary)', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '0.35rem 0.85rem', borderRadius: '50px', display: 'inline-block', margin: '0 auto 1.5rem auto', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).toUpperCase()}
        </div>

        <h1 className="title-large" style={{ fontSize: '4rem', marginBottom: '1.5rem', margin: '0 auto' }}>{post.title}</h1>

        <div className="tags-row" style={{ justifyContent: 'center', marginTop: '2rem' }}>
          {post.tags.map((tag) => (
            <span key={tag.id} className="tag-badge" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: '50px' }}>
              {tag.name}
            </span>
          ))}
        </div>
      </GridContainer>

      <GridContainer style={{ padding: '6rem 2rem' }}>
        <article className="post-content" style={{ margin: '0 auto' }}>
          {post.content.split('\n').map((para, idx) => {
            if (!para) return <br key={idx} />;
            return <p key={idx} style={{ color: '#d1d5db', fontSize: '1.25rem', lineHeight: '1.8' }}>{para}</p>;
          })}
        </article>
      </GridContainer>

      <div>
        <GridContainer style={{ padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <CommentsSection postId={post.id} />
          </div>
        </GridContainer>
      </div>
    </>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../api/postService';
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
    <>
      <div className="border-b-grid" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Subtle hero gradient background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2, background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', maxWidth: '900px', padding: '6rem 2rem', textAlign: 'center', zIndex: 10 }}>
          <div style={{ marginBottom: '4rem', textAlign: 'left' }}>
            <Link
              to="/"
              className="mono-text"
              style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: '32px', color: 'var(--text-muted)' }}
            >
              ← Back
            </Link>
          </div>

          <div className="mono-text" style={{ fontSize: '0.85rem', color: '#cda06b', marginBottom: '1rem' }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).toUpperCase()}
          </div>

          <h1 className="title-large" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{post.title}</h1>

          <div className="tags-row" style={{ justifyContent: 'center', marginTop: '2rem' }}>
            {post.tags.map((tag) => (
              <span key={tag.id} className="tag-badge" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <article className="container" style={{ maxWidth: '800px', padding: '4rem 2rem' }}>
        <div className="post-content">
          {post.content.split('\n').map((para, idx) => {
            if (!para) return <br key={idx} />;
            // If the paragraph looks like a heading (e.g. short and no punctuation at the end, or we just want to style the first line)
            // Just output standard paragraphs for now, user can format content manually
            return <p key={idx} style={{ color: '#d1d5db' }}>{para}</p>;
          })}
        </div>

        <CommentsSection postId={post.id} />
      </article>
    </>
  );
}

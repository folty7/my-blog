import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postService } from '../api/postService';
import { AlertCircle } from 'lucide-react';
import PixelSnow from '../components/PixelSnow';
import GridContainer from '../components/GridContainer';


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
          <span>Error loading posts: {error instanceof Error ? error.message : 'Unknown error'}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <GridContainer wrapperClassName="hero-section" showPattern={true} className="hero-content-wrapper" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
          <PixelSnow
            color="#ffffff"
            flakeSize={0.01}
            minFlakeSize={1.25}
            pixelResolution={180}
            speed={0.8}
            density={0.25}
            direction={125}
            brightness={1}
            depthFade={8}
            farPlane={20}
            gamma={0.4545}
            variant="square"
          />
        </div>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="text-display" style={{ marginBottom: '1.5rem' }}>Blog</h1>
          <p className="subtitle" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.8', margin: '0 auto', textTransform: 'lowercase' }}>
            Our blog offers tips and strategies written by experts to enhance your web presence, attract more customers, and thrive in the digital landscape.
          </p>
        </div>
      </GridContainer>

      {/* Posts Section */}
      <div>
        <GridContainer style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem' }}>
          <span className="mono-text">Posts</span>
        </GridContainer>

        <div className="post-list" style={{ display: 'flex', flexDirection: 'column' }}>
          {posts?.map((post) => (
            <GridContainer key={post.id} style={{ padding: '0 2rem' }}>
              <Link to={`/post/${post.slug}`} className="post-card">
                {/* Left Column: Image Area (Mock) */}
                <div style={{ width: '250px', height: '140px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="mono-text" style={{ fontSize: '0.7rem' }}>Môj Blog</span>
                </div>

                {/* Middle Column: Title & Excerpt */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 className="title">{post.title}</h2>
                  <p className="excerpt">
                    {post.content.length > 150
                      ? post.content.substring(0, 150) + '...'
                      : post.content}
                  </p>
                </div>

                {/* Right Column: Tags & Date */}
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', gap: '1rem' }}>
                  <div className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="tag-badge">{tag.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </GridContainer>
          ))}
        </div>

        {posts?.length === 0 && (
          <div className="text-center py-12" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <p className="subtitle">No posts found. Be the first to write one!</p>
            <Link to="/create-post" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              Write a Post
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

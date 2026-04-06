import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { postService } from '../api/postService';
import { Send, Type, Hash, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';

// Helper to generate slug from title
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// Schema for Post Creation
const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  // Watch the title to auto-generate the slug
  const watchedTitle = watch('title');

  useEffect(() => {
    if (watchedTitle) {
      setValue('slug', generateSlug(watchedTitle));
    }
  }, [watchedTitle, setValue]);

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    setError('');

    // Process the comma-separated string into a clean array
    const tagArray = data.tags
      ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    try {
      const newPost = await postService.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        tags: tagArray,
      });

      // Redirect to the new post's detail page!
      navigate(`/post/${newPost.slug}`);
    } catch (err: unknown) {
      setError(getApiError(err, "Failed to publish post."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <div className="auth-header">
          <h1 style={{ fontSize: '2.5rem' }}>Write a New Story</h1>
          <p>Share your thoughts with the world</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="form-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <div className="input-with-icon">
              <Type size={18} />
              <input
                {...register('title')}
                type="text"
                placeholder="A catchy title..."
                className={errors.title ? 'input-error' : ''}
              />
            </div>
            {errors.title && <p className="field-error">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label>Slug (URL Friendly)</label>
            <div className="input-with-icon">
              <LinkIcon size={18} />
              <input
                {...register('slug')}
                type="text"
                placeholder="my-cool-post"
                className={errors.slug ? 'input-error' : ''}
              />
            </div>
            {errors.slug && <p className="field-error">{errors.slug.message}</p>}
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <div className="input-with-icon">
              <Hash size={18} />
              <input
                {...register('tags')}
                type="text"
                placeholder="react, tutorial, tech..."
                className={errors.tags ? 'input-error' : ''}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Add keywords to help readers find your post.
            </p>
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              {...register('content')}
              placeholder="What's on your mind?"
              className={errors.content ? 'input-error' : ''}
            />
            {errors.content && <p className="field-error">{errors.content.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-submit" style={{ marginTop: '2rem' }}>
            {loading ? "Publishing..." : (
              <>
                <Send size={20} />
                <span>Publish Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

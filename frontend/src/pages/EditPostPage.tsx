import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../api/postService';
import type { Tag } from '../types/post';
import { Save, Type, Hash, Link as LinkIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: () => postService.getPostById(Number(id)),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('slug', post.slug);
      setValue('content', post.content);
      setValue('tags', post.tags.map((t: Tag) => t.name).join(', '));
    }
  }, [post, setValue]);

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    setError('');

    const tagArray = data.tags 
      ? data.tags.split(',').map(t => t.trim()).filter(Boolean) 
      : [];

    try {
      await postService.updatePost(Number(id), {
        title: data.title,
        slug: data.slug,
        content: data.content,
        tags: tagArray
      });

      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getApiError(err, "Failed to update post."));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="spinner"></div>;

  return (
    <div className="container py-12">
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} className="btn-logout" style={{ display: 'flex', gap: '8px', padding: '8px' }}>
            <ArrowLeft size={18} /> <span>Back</span>
          </button>
        </div>

        <div className="auth-header">
          <h1 style={{ fontSize: '2.5rem' }}>Edit Post</h1>
          <p>Update your story content and tags</p>
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
                className={errors.title ? 'input-error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Slug</label>
            <div className="input-with-icon">
              <LinkIcon size={18} />
              <input 
                {...register('slug')}
                type="text" 
                className={errors.slug ? 'input-error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="input-with-icon">
              <Hash size={18} />
              <input 
                {...register('tags')}
                type="text" 
                className={errors.tags ? 'input-error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea 
              {...register('content')}
              className={errors.content ? 'input-error' : ''}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit" style={{ marginTop: '2rem' }}>
            {loading ? "Saving..." : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

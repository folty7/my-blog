import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../api/postService';
import type { Tag } from '../types/post';
import { Save, Type, Hash, Link as LinkIcon, AlertCircle, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
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
      if (post.imageUrl) {
        setCurrentImageUrl(post.imageUrl);
        setPreviewUrl(`${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${post.imageUrl}`);
      }
    }
  }, [post, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentImageUrl(null);
  };

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    setError('');

    const tagArray = data.tags 
      ? data.tags.split(',').map(t => t.trim()).filter(Boolean) 
      : [];

    try {
      let imageUrl = currentImageUrl || '';
      
      if (selectedFile) {
        const uploadRes = await postService.uploadImage(selectedFile);
        imageUrl = uploadRes.imageUrl;
      }

      await postService.updatePost(Number(id), {
        title: data.title,
        slug: data.slug,
        content: data.content,
        tags: tagArray,
        imageUrl: imageUrl || undefined
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
            <label>Title Image (Hero Background)</label>
            {!previewUrl ? (
              <div 
                onClick={() => document.getElementById('image-upload')?.click()}
                style={{ 
                  border: '2px dashed var(--border-color)', 
                  padding: '3rem 2rem', 
                  textAlign: 'center', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'; }}
              >
                <ImageIcon size={32} style={{ color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Click to change title image</p>
              </div>
            ) : (
              <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '180px' }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    style={{ 
                      backgroundColor: 'rgba(0,0,0,0.6)', 
                      border: 'none', 
                      borderRadius: '4px', 
                      padding: '0.25rem 0.75rem',
                      color: 'white',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    Change
                  </button>
                  <button 
                    type="button" 
                    onClick={removeImage}
                    style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.6)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '32px', 
                      height: '32px', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </div>

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

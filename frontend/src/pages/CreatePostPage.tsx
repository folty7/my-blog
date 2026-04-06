import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { postService } from '../api/postService';
import { Send, Type, Hash, Link as LinkIcon, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';
import GridContainer from '../components/GridContainer';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
  };

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      if (selectedFile) {
        const uploadRes = await postService.uploadImage(selectedFile);
        imageUrl = uploadRes.imageUrl;
      }

      // Process the comma-separated string into a clean array
      const tagArray = data.tags
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const newPost = await postService.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        tags: tagArray,
        imageUrl: imageUrl || undefined,
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
    <>
      <GridContainer showPattern={true} style={{ padding: '6rem 2rem' }}>
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
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Click to upload a title image</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max size 5MB (JPG, PNG, WEBP)</p>
                </div>
              ) : (
                <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '180px' }}>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    style={{ 
                      position: 'absolute', 
                      top: '0.5rem', 
                      right: '0.5rem', 
                      backgroundColor: 'rgba(0,0,0,0.6)', 
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
      </GridContainer>
    </>
  );
}

import { useState, useEffect, useRef } from 'react';
import { postService } from '../api/postService';
import { Upload, X, Check } from 'lucide-react';

interface ImagePickerModalProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
  apiBaseUrl: string;
}

export default function ImagePickerModal({ onSelect, onClose, apiBaseUrl }: ImagePickerModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    postService.getUploadedImages().then(data => {
      setImages(data.map(d => d.imageUrl));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { imageUrl } = await postService.uploadImage(file);
      setImages(prev => [imageUrl, ...prev]);
      setSelected(imageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Select Image</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Upload strip */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px dashed var(--border-color)',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              color: 'var(--text-muted)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Upload size={16} />
            {uploading ? 'Uploading…' : 'Upload new image'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        {/* Image grid */}
        <div style={{ overflowY: 'auto', padding: '1rem 1.25rem', flex: 1 }}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>Loading…</p>
          ) : images.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No images uploaded yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {images.map(url => (
                <div
                  key={url}
                  onClick={() => setSelected(url === selected ? null : url)}
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: `2px solid ${selected === url ? 'var(--primary)' : 'var(--border-color)'}`,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <img
                    src={`${apiBaseUrl}${url}`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {selected === url && (
                    <div style={{
                      position: 'absolute', top: '0.25rem', right: '0.25rem',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '50%',
                      width: '22px', height: '22px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={13} color="white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn-logout" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selected}
            className="btn-submit"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', opacity: selected ? 1 : 0.4 }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import './styles.css';

export const EditURLModal: React.FC<{
  url: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, originalUrl: string) => Promise<void>;
}> = ({ url, isOpen, onClose, onSave }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (url) {
      setOriginalUrl(url.originalUrl);
    }
  }, [url, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSave(url.id, originalUrl);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update URL');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit URL</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Short Code</label>
            <input
              type="text"
              value={url?.shortCode || ''}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Original URL</label>
            <textarea
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Enter the new URL"
              required
              disabled={loading}
              rows={4}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Created Date</label>
            <input
              type="text"
              value={new Date(url?.createdAt).toLocaleString()}
              disabled
              className="form-control"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditURLModal;

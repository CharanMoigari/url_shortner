import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export const URLCard: React.FC<{
  url: any;
  onDelete: (id: string) => void;
  onCopy: (text: string) => void;
  onEdit: (url: any) => void;
}> = ({ url, onDelete, onCopy, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="url-card">
      <div className="url-card-header">
        <h3>{url.shortCode}</h3>
        <p className="url-original" title={url.originalUrl}>
          {url.originalUrl}
        </p>
        <div className="url-short-container">
          <a 
            href={url.shortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="url-short"
          >
            {url.shortUrl || 'URL not available'}
          </a>
          <button
            className="btn btn-sm btn-link"
            onClick={() => onCopy(url.shortUrl)}
            title="Copy to clipboard"
            style={{ marginLeft: '8px' }}
          >
            📋
          </button>
        </div>
      </div>
      <div className="url-card-body">
        <div className="stat">
          <span className="stat-label">Clicks</span>
          <span className="stat-value">{url.clickCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Created</span>
          <span className="stat-value">
            {new Date(url.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="url-card-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            if (!url.shortUrl) {
              alert('Short URL is not available');
              return;
            }
            onCopy(url.shortUrl);
          }}
          title={url.shortUrl || 'URL not available'}
        >
          Copy URL
        </button>
        <button
          className="btn btn-sm btn-info"
          onClick={() => navigate(`/analytics/${url.id}`)}
          title="View analytics"
        >
          📊 Analytics
        </button>
        <button
          className="btn btn-sm btn-warning"
          onClick={() => onEdit(url)}
          title="Edit URL"
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(url.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

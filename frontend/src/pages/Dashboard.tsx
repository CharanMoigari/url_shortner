import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import { URLCard } from '../components/URLCard';
import { ShortURL } from '../types';
import '../components/styles.css';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<ShortURL[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadURLs();
  }, [page, search]);

  // Refresh URLs when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadURLs();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [page, search]);

  const loadURLs = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getURLs(page, 20, search);
      setUrls(result.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateURL = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiClient.createURL(originalUrl, customAlias || undefined);
      setOriginalUrl('');
      setCustomAlias('');
      setMessage('Short URL created successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadURLs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteURL = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      await apiClient.deleteURL(id);
      setMessage('URL deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadURLs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete URL');
    }
  };

  const handleCopyToClipboard = (text: string) => {
    if (!text) {
      setError('URL is not available for copying');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        setMessage(`Copied: ${text}`);
        setTimeout(() => setMessage(''), 3000);
      },
      () => {
        setError('Failed to copy to clipboard');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>URL Shortener</h1>
        <div>
          <span>Welcome, {user?.email}</span>
          <button 
            className="btn btn-primary" 
            onClick={loadURLs}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <section className="create-section">
          <h2>Create Short URL</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleCreateURL} className="create-form">
            <input
              type="url"
              placeholder="Enter URL (e.g., https://example.com/very/long/url)"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Custom alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </form>
        </section>

        <section className="urls-section">
          <h2>Your URLs</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search URLs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {loading && urls.length === 0 ? (
            <div className="loading">Loading...</div>
          ) : urls.length === 0 ? (
            <div className="empty-state">
              <p>No URLs found. Create your first short URL!</p>
            </div>
          ) : (
            <div className="urls-grid">
              {urls.map((url) => (
                <URLCard
                  key={url.id}
                  url={url}
                  onDelete={handleDeleteURL}
                  onCopy={handleCopyToClipboard}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

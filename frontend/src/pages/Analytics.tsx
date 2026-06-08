import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import '../components/styles.css';

interface AnalyticsData {
  browserStats: Array<{ browser: string; count: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
  referrerStats: Array<{ referrer: string; count: number }>;
  totalClicks: number;
}

export const Analytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [url, setUrl] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'browser' | 'device' | 'daily' | 'referrer'>('browser');

  useEffect(() => {
    loadAnalytics();
  }, [id]);

  const loadAnalytics = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [urlData, browserStats, deviceStats, dailyStats, totalClicks, referrerStats] = await Promise.all([
        apiClient.getURL(id),
        apiClient.getBrowserStats(id),
        apiClient.getDeviceStats(id),
        apiClient.getDailyStats(id),
        apiClient.getTotalClicks(id),
        apiClient.getReferrerStats(id),
      ]);

      setUrl(urlData);
      setAnalytics({
        browserStats: browserStats || [],
        deviceStats: deviceStats || [],
        dailyStats: dailyStats || [],
        referrerStats: referrerStats || [],
        totalClicks: totalClicks?.totalClicks || 0,
      });
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  if (!url || !analytics) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          {error || 'URL not found'}
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sortedBrowserStats = [...analytics.browserStats].sort((a, b) => b.count - a.count);
  const sortedDeviceStats = [...analytics.deviceStats].sort((a, b) => b.count - a.count);
  const sortedDailyStats = [...analytics.dailyStats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedReferrerStats = [...analytics.referrerStats].sort((a, b) => b.count - a.count);

  const maxBrowserCount = sortedBrowserStats.length > 0 ? Math.max(...sortedBrowserStats.map(s => s.count)) : 1;
  const maxDeviceCount = sortedDeviceStats.length > 0 ? Math.max(...sortedDeviceStats.map(s => s.count)) : 1;
  const maxDailyCount = sortedDailyStats.length > 0 ? Math.max(...sortedDailyStats.map(s => s.count)) : 1;
  const maxReferrerCount = sortedReferrerStats.length > 0 ? Math.max(...sortedReferrerStats.map(s => s.count)) : 1;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1>Analytics: {url.shortCode}</h1>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-value">{analytics.totalClicks}</div>
          <div className="summary-label">Total Clicks</div>
        </div>
        <div className="summary-card">
          <div className="summary-value-url" title={url.originalUrl}>
            {url.originalUrl.length > 50 ? url.originalUrl.substring(0, 50) + '...' : url.originalUrl}
          </div>
          <div className="summary-label">Original URL</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{new Date(url.createdAt).toLocaleDateString()}</div>
          <div className="summary-label">Created</div>
        </div>
      </div>

      <div className="analytics-tabs">
        <button
          className={`tab-button ${activeTab === 'browser' ? 'active' : ''}`}
          onClick={() => setActiveTab('browser')}
        >
          Browser Stats
        </button>
        <button
          className={`tab-button ${activeTab === 'device' ? 'active' : ''}`}
          onClick={() => setActiveTab('device')}
        >
          Device Stats
        </button>
        <button
          className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily Stats
        </button>
        <button
          className={`tab-button ${activeTab === 'referrer' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrer')}
        >
          Top Referrers
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'browser' && (
          <div className="analytics-section">
            <h2>Browser Distribution</h2>
            {sortedBrowserStats.length > 0 ? (
              <div className="chart-container">
                {sortedBrowserStats.map((stat) => (
                  <div key={stat.browser} className="chart-bar">
                    <div className="bar-label">{stat.browser}</div>
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          width: `${(stat.count / maxBrowserCount) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="bar-count">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No browser data available</p>
            )}
          </div>
        )}

        {activeTab === 'device' && (
          <div className="analytics-section">
            <h2>Device Distribution</h2>
            {sortedDeviceStats.length > 0 ? (
              <div className="chart-container">
                {sortedDeviceStats.map((stat) => (
                  <div key={stat.device} className="chart-bar">
                    <div className="bar-label">{stat.device}</div>
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          width: `${(stat.count / maxDeviceCount) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="bar-count">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No device data available</p>
            )}
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="analytics-section">
            <h2>Daily Clicks</h2>
            {sortedDailyStats.length > 0 ? (
              <div className="chart-container">
                {sortedDailyStats.map((stat) => (
                  <div key={stat.date} className="chart-bar">
                    <div className="bar-label">{new Date(stat.date).toLocaleDateString()}</div>
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          width: `${(stat.count / maxDailyCount) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="bar-count">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No daily data available</p>
            )}
          </div>
        )}

        {activeTab === 'referrer' && (
          <div className="analytics-section">
            <h2>Top Referrers</h2>
            {sortedReferrerStats.length > 0 ? (
              <div className="referrer-table">
                <div className="referrer-header">
                  <div className="referrer-domain">Referring Domain</div>
                  <div className="referrer-count">Clicks</div>
                </div>
                {sortedReferrerStats.map((stat, idx) => (
                  <div key={stat.referrer || idx} className="referrer-row">
                    <div className="referrer-domain" title={stat.referrer || 'Direct'}>
                      <a href={stat.referrer || '#'} target="_blank" rel="noopener noreferrer" className="referrer-link">
                        {stat.referrer ? (new URL(stat.referrer).hostname || stat.referrer) : 'Direct / No Referrer'}
                      </a>
                    </div>
                    <div className="referrer-count">
                      <div className="referrer-bar">
                        <div
                          className="referrer-bar-fill"
                          style={{
                            width: `${(stat.count / maxReferrerCount) * 100}%`,
                          }}
                        />
                        <span className="referrer-count-badge">{stat.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No referrer data available</p>
            )}
          </div>
        )}
      </div>

      <div className="analytics-actions">
        <button
          className="btn btn-primary"
          onClick={loadAnalytics}
          disabled={loading}
        >
          Refresh Analytics
        </button>
      </div>
    </div>
  );
};

export default Analytics;

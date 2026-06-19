import React from 'react';

export default function LoadingSpinner({ fullScreen = false }) {
  const content = (
    <div className="loading-spinner-wrap">
      <div className="loading-spinner" />
      <p className="loading-text">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
      </div>
    );
  }
  return content;
}

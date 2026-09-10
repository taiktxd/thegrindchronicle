'use client';

import { useState, useEffect } from 'react';

interface PostActionsProps {
  slug: string;
  title?: string;
}

export default function PostActions({ slug }: PostActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const rawData = localStorage.getItem('thegrind_bookmarks');
        const savedBookmarks: string[] = rawData ? (JSON.parse(rawData) as string[]) : [];
        setIsBookmarked(savedBookmarks.includes(slug));
      } catch {
        setIsBookmarked(false);
      }
    }
  }, [slug]);

  const toggleBookmark = () => {
    if (typeof window === 'undefined') return;

    try {
      const rawData = localStorage.getItem('thegrind_bookmarks');
      const savedBookmarks: string[] = rawData ? (JSON.parse(rawData) as string[]) : [];
      let updated: string[];

      if (isBookmarked) {
        updated = savedBookmarks.filter((item) => item !== slug);
      } else {
        updated = [...savedBookmarks, slug];
      }

      localStorage.setItem('thegrind_bookmarks', JSON.stringify(updated));
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "44px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #e2e8f0" }} />
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #e2e8f0" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
      {/* Icon Bookmark (fa-bookmark style) */}
      <button
        onClick={toggleBookmark}
        title={isBookmarked ? "Remove Bookmark" : "Save Story"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "1px solid #e2e8f0",
          backgroundColor: isBookmarked ? "#000" : "#fff",
          color: isBookmarked ? "#fff" : "#4a5568",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Icon Share / Copy Link (fa-share-alt style) */}
      <div style={{ position: "relative" }}>
        <button
          onClick={handleCopyLink}
          title="Share / Copy Link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid #e2e8f0",
            backgroundColor: copied ? "#10b981" : "#fff",
            color: copied ? "#fff" : "#4a5568",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          )}
        </button>

        {copied && (
          <span
            style={{
              position: "absolute",
              top: "-34px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#1e293b",
              color: "#fff",
              fontSize: "0.75rem",
              padding: "3px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            Copied link!
          </span>
        )}
      </div>
    </div>
  );
}
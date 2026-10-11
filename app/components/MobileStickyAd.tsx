'use client';

import { useState } from 'react';

export default function MobileStickyAd() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      aria-label="Mobile Sticky Advertisement"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 flex flex-col items-center shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="w-full max-w-[320px] flex items-center justify-between mb-0.5">
        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">
          Advertisement
        </span>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="text-gray-400 hover:text-gray-700 text-xs px-1 font-bold leading-none"
          title="Close ad"
          aria-label="Close advertisement"
        >
          ✕
        </button>
      </div>

      <div className="w-[320px] h-[50px] rounded bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-center">
        {/* Vị trí đặt script Google AdSense Mobile Anchor 320x50 */}
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-semibold text-gray-600">Mobile Anchor Ad</span>
          <span className="text-[10px] text-gray-400 font-mono">320 × 50</span>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  format?: string;
}

export default function AdBanner({ adKey, width, height }: AdBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Xóa nội dung cũ nếu có trước khi inject
    bannerRef.current.innerHTML = '';

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.topcreativeformat.com/${adKey}/invoke.js`;

    bannerRef.current.appendChild(confScript);
    bannerRef.current.appendChild(invokeScript);
  }, [adKey, width, height]);

  return (
    <div className="flex flex-col items-center justify-center my-6 overflow-hidden">
      <span className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1 font-sans">
        Sponsored
      </span>
      <div
        ref={bannerRef}
        style={{ width: `${width}px`, minHeight: `${height}px` }}
        className="flex items-center justify-center bg-neutral-100/50 rounded"
      />
    </div>
  );
}
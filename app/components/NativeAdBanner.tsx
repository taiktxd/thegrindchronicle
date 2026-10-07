'use client';

import { useEffect, useRef } from 'react';

export default function NativeAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Tránh chèn trùng lặp script khi chuyển trang hoặc re-render
    const existingScript = containerRef.current.querySelector('script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl30558952.profitableratecpmnetwork.com/89b1d4b64b46783bca74fc727b6c4b18/invoke.js';

    containerRef.current.appendChild(script);
  }, []);

  return (
    <aside className="mt-8 mb-4 w-full border-t border-neutral-100 pt-4 overflow-hidden">
      <div className="text-center mb-2">
        <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-sans">
          Advertisement
        </span>
      </div>
      
      <div ref={containerRef} className="flex justify-center items-center min-h-[90px] w-full">
        <div id="container-89b1d4b64b46783bca74fc727b6c4b18"></div>
      </div>
    </aside>
  );
}
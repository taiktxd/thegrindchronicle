'use client';

import { useEffect, useRef } from 'react';

export default function NativeAdBanner() {
  const adLoaded = useRef(false);

  useEffect(() => {
    // Ngăn chặn việc inject script lặp lại khi render
    if (adLoaded.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl30558952.profitableratecpmnetwork.com/89b1d4b64b46783bca74fc727b6c4b18/invoke.js';

    document.body.appendChild(script);
    adLoaded.current = true;

    return () => {
      // Dọn dẹp script khi rời trang
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full my-10 py-6 border-t border-b border-neutral-200/80">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
          Sponsored Stories
        </span>
        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">
          Advertisement
        </span>
      </div>

      {/* Container chứa quảng cáo 4:1 của Adsterra */}
      <div className="w-full overflow-hidden flex justify-center min-h-[140px]">
        <div id="container-89b1d4b64b46783bca74fc727b6c4b18" className="w-full" />
      </div>
    </div>
  );
}
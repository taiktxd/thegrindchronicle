'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Tránh inject trùng lặp khi component re-render
    const existing = containerRef.current.querySelector('script');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://pl30558952.profitableratecpmnetwork.com/89b1d4b64b46783bca74fc727b6c4b18/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full my-8 flex flex-col items-center select-none">
      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
        Advertisement
      </span>
      <div ref={containerRef} className="w-full flex justify-center overflow-hidden">
        <div id="container-89b1d4b64b46783bca74fc727b6c4b18" className="w-full flex justify-center" />
      </div>
    </div>
  );
}
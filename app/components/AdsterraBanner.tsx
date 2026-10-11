'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Dọn sạch iframe cũ khi chuyển bài viết để tránh chồng lấn
    bannerRef.current.innerHTML = '';

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : 'd5c2c3348a532d9400b036176ff75a69',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highrevenueformat.com/d5c2c3348a532d9400b036176ff75a69/invoke.js';

    bannerRef.current.appendChild(confScript);
    bannerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-full my-6 flex flex-col items-center select-none">
      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
        Advertisement
      </span>
      <div
        ref={bannerRef}
        className="w-[300px] h-[250px] flex items-center justify-center overflow-hidden bg-gray-50/50 rounded shadow-2xs"
      />
    </div>
  );
}
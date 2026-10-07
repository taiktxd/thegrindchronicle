'use client';

import { useEffect, useRef } from 'react';

export default function Banner300x250() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Xóa nội dung cũ để tránh nạp trùng khi chuyển trang
    containerRef.current.innerHTML = '';

    // 1. Tạo script cấu hình atOptions
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

    // 2. Tạo script gọi invoke.js của Adsterra
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highrevenueformat.com/d5c2c3348a532d9400b036176ff75a69/invoke.js';

    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <aside className="mb-8 mt-2 flex flex-col items-center justify-center">
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-h-[250px] min-w-[300px] flex items-center justify-center overflow-hidden"
      />
    </aside>
  );
}
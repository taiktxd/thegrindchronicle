'use client';

import Giscus from '@giscus/react';

export default function GiscusComments() {
  return (
    <section className="mt-14 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Discussion & Reader Thoughts
      </h3>
      <Giscus
        id="comments"
        repo="taiktxd/the-grind-chronicle-next"
        repoId="R_kgDOTw7EdQ"
        category="Announcements"
        categoryId="DIC_kwDOTw7Edc4DEV8i"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
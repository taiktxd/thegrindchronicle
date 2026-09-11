'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CommentForm({ postSlug }: { postSlug: string }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, name, message }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setName('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-4">
        Thank you for your comment! Your comment will appear after it has been approved.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        maxLength={80}
        className="border-b border-gray-300 bg-transparent py-2 text-sm text-gray-800
                   placeholder:text-gray-400 focus:outline-none focus:border-amber-600"
      />
      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts about the post…"
        maxLength={2000}
        className="border border-gray-300 rounded-md bg-transparent p-3 text-sm text-gray-800
                   placeholder:text-gray-400 resize-none focus:outline-none focus:border-amber-600"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start px-5 py-2 bg-amber-600 text-white text-sm font-bold uppercase tracking-wider
                   rounded-full hover:bg-amber-700 transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Send Comment'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600">An error occurred. Please try again.</p>
      )}
    </form>
  );
}
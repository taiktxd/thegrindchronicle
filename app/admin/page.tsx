'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CommentItem {
  id: number | string;
  post_slug: string;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
}

interface SubscriberItem {
  id: number | string;
  email: string;
  created_at: string;
}

const AUTHORIZED_ADMIN_EMAIL = 'thegrindchronicle.contact@gmail.com';

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'comments' | 'subscribers'>('comments');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // State cho tính năng Reply bình luận
  const [replyingToId, setReplyingToId] = useState<number | string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);

  // Phân trang 6 bình luận / trang
  const [currentPage, setCurrentPage] = useState(1);
  const COMMENTS_PER_PAGE = 6;

  // 1. Khôi phục phiên làm việc từ sessionStorage
  useEffect(() => {
    const savedCode = sessionStorage.getItem('tgc_admin_passcode');
    const savedEmail = sessionStorage.getItem('tgc_admin_email');

    if (!savedCode || !savedEmail || savedEmail.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return;
    }

    let isMounted = true;

    async function restoreSession(code: string, email: string) {
      try {
        const res = await fetch('/api/admin/comments', {
          headers: {
            'x-admin-passcode': code,
            'x-admin-email': email,
          },
        });

        if (!res.ok) {
          sessionStorage.removeItem('tgc_admin_passcode');
          sessionStorage.removeItem('tgc_admin_email');
          return;
        }

        const commentData = await res.json();
        if (!isMounted) return;

        setComments(commentData);
        setIsAuthenticated(true);
        setAdminEmail(email);
        setPasscode(code);

        const subRes = await fetch('/api/admin/subscribers', {
          headers: {
            'x-admin-passcode': code,
            'x-admin-email': email,
          },
        });
        if (subRes.ok && isMounted) {
          const subData = await subRes.json();
          setSubscribers(subData);
        }
      } catch {
        if (isMounted) {
          sessionStorage.removeItem('tgc_admin_passcode');
          sessionStorage.removeItem('tgc_admin_email');
        }
      }
    }

    void restoreSession(savedCode, savedEmail);

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Mở khóa Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = adminEmail.trim().toLowerCase();
    const code = passcode.trim();

    setAuthError('');

    if (emailInput !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setAuthError(`Access Denied: Only ${AUTHORIZED_ADMIN_EMAIL} is authorized.`);
      return;
    }

    if (!code) {
      setAuthError('Please enter the Admin Passcode.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/comments', {
        headers: {
          'x-admin-passcode': code,
          'x-admin-email': emailInput,
        },
      });

      if (!res.ok) {
        throw new Error('Invalid Passcode');
      }

      const commentData = await res.json();
      setComments(commentData);
      setIsAuthenticated(true);

      sessionStorage.setItem('tgc_admin_email', emailInput);
      sessionStorage.setItem('tgc_admin_passcode', code);

      const subRes = await fetch('/api/admin/subscribers', {
        headers: {
          'x-admin-passcode': code,
          'x-admin-email': emailInput,
        },
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData);
      }
    } catch {
      setAuthError('Access Denied: Invalid Passcode.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // 3. Đăng xuất an toàn khỏi Admin
  const handleAdminLogout = () => {
    sessionStorage.removeItem('tgc_admin_passcode');
    sessionStorage.removeItem('tgc_admin_email');
    setIsAuthenticated(false);
    setAdminEmail('');
    setPasscode('');
    setComments([]);
    setSubscribers([]);
  };

  // 4. Đổi bộ lọc bình luận
  const handleFilterChange = (filter: 'all' | 'pending' | 'approved') => {
    setCommentFilter(filter);
    setCurrentPage(1);
    setReplyingToId(null);
  };

  // 5. Duyệt / Ẩn bình luận
  const handleToggleApprove = async (id: number | string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ id, approved: !currentStatus }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, approved: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error('Failed to toggle approval:', err);
    }
  };

  // 6. Xóa bình luận
  const handleDeleteComment = async (id: number | string) => {
    if (!confirm('Are you sure you want to permanently delete this comment?')) return;
    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passcode': passcode,
          'x-admin-email': adminEmail,
        },
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  // 7. GỬI BÌNH LUẬN TRẢ LỜI CỦA ADMIN (Rep)
  const handleSendReply = async (originalComment: CommentItem) => {
    if (!replyText.trim()) return;

    setReplySending(true);
    try {
      const replyPayload = {
        postSlug: originalComment.post_slug,
        name: 'The Grind Chronicle',
        message: `@${originalComment.name} ${replyText.trim()}`,
      };

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyPayload),
      });

      if (!res.ok) throw new Error('Failed to send reply');

      // Tự động tải lại danh sách bình luận mới nhất
      const refreshRes = await fetch('/api/admin/comments', {
        headers: {
          'x-admin-passcode': passcode,
          'x-admin-email': adminEmail,
        },
      });
      if (refreshRes.ok) {
        const freshComments = await refreshRes.json();
        setComments(freshComments);
      }

      setReplyingToId(null);
      setReplyText('');
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Could not post reply. Please check connection and try again.');
    } finally {
      setReplySending(false);
    }
  };

  // 8. Xóa subscriber
  const handleDeleteSubscriber = async (id: number | string) => {
    if (!confirm('Remove this email from subscribers list?')) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passcode': passcode,
          'x-admin-email': adminEmail,
        },
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
    }
  };

  // 9. Copy toàn bộ email
  const handleCopyEmails = () => {
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ================= MÀN HÌNH KHÓA =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] flex flex-col justify-center items-center px-4 font-sans text-neutral-900">
        <div className="w-full max-w-sm bg-white border border-neutral-200/90 rounded-2xl shadow-xl p-8 text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e67e22] inline-block mb-3" />
          <h1
            className="text-2xl font-bold uppercase tracking-tight font-serif mb-1"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Editorial Desk
          </h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-6 font-medium">
            The Grind Chronicle Admin
          </p>

          <form onSubmit={handleLogin} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1 ml-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="thegrindchronicle.contact@gmail.com"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1 ml-1">
                Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg tracking-widest placeholder:tracking-normal placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            {authError && (
              <p className="text-[11px] text-red-600 font-medium pt-1 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-neutral-950 hover:bg-[#e67e22] text-white text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying Desk…' : 'Unlock Desk →'}
            </button>
          </form>

          <Link
            href="/"
            className="inline-block mt-6 text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    );
  }

  // ================= BẢNG ĐIỀU KHIỂN =================
  const pendingCommentsCount = comments.filter((c) => !c.approved).length;
  const filteredComments = comments.filter((c) => {
    if (commentFilter === 'pending') return !c.approved;
    if (commentFilter === 'approved') return c.approved;
    return true;
  });

  const totalPages = Math.ceil(filteredComments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  return (
    <div className="bg-[#fcfbf9] text-neutral-900 font-sans pb-8 min-h-screen">
      
      {/* HEADER ADMIN */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="font-serif font-black uppercase text-sm sm:text-base tracking-tight text-neutral-950"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The Grind Chronicle
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Editorial Desk
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full border border-neutral-200 text-xs text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium font-mono text-[11px]">{adminEmail}</span>
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors px-2 py-1 rounded-md hover:bg-neutral-100 hidden md:inline-block"
            >
              View Site ↗
            </Link>

            <button
              onClick={handleAdminLogout}
              className="text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
              Total Comments
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif">{comments.length}</span>
              {pendingCommentsCount > 0 && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {pendingCommentsCount} pending
                </span>
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
              Active Subscribers
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif">{subscribers.length}</span>
              <span className="text-xs text-neutral-400">readers in circle</span>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
              Desk Action
            </span>
            <button
              onClick={handleCopyEmails}
              disabled={subscribers.length === 0}
              className="text-xs font-medium py-2 px-3 border border-neutral-300 hover:border-neutral-900 rounded-lg text-neutral-800 transition-colors text-center disabled:opacity-40 cursor-pointer"
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy All Subscriber Emails'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === 'comments'
                ? 'text-neutral-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e67e22]'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Comments Moderation ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === 'subscribers'
                ? 'text-neutral-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e67e22]'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Dispatch Subscribers ({subscribers.length})
          </button>
        </div>

        {/* TAB 1: COMMENTS */}
        {activeTab === 'comments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Filter:</span>
                {(['all', 'pending', 'approved'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                      commentFilter === filter
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {filteredComments.length > 0 && (
                <span className="text-xs text-neutral-400 font-sans">
                  Showing {startIndex + 1}–{Math.min(startIndex + COMMENTS_PER_PAGE, filteredComments.length)} of {filteredComments.length}
                </span>
              )}
            </div>

            {filteredComments.length === 0 ? (
              <div className="py-12 bg-white border border-neutral-200 rounded-xl text-center text-xs text-neutral-400 font-serif italic">
                No comments matching this criteria.
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden shadow-2xs">
                {paginatedComments.map((c) => (
                  <div key={c.id} className="py-3.5 px-4 sm:px-5 flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-neutral-900">{c.name}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(c.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <Link
                            href={`/post/${c.post_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#e67e22] hover:underline truncate max-w-[200px]"
                          >
                            /{c.post_slug} ↗
                          </Link>
                        </div>

                        <p
                          className="text-xs text-neutral-800 font-serif leading-relaxed"
                          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >
                          {c.message}
                        </p>
                      </div>

                      {/* HÀNG NÚT THAO TÁC: ĐÃ BỔ SUNG NÚT "Rep" */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (replyingToId === c.id) {
                              setReplyingToId(null);
                              setReplyText('');
                            } else {
                              setReplyingToId(c.id);
                              setReplyText('');
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                            replyingToId === c.id
                              ? 'bg-amber-100 border-amber-300 text-amber-900'
                              : 'bg-white border-neutral-200 text-neutral-700 hover:border-amber-500 hover:text-amber-600'
                          }`}
                        >
                          💬 Rep
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleApprove(c.id, c.approved)}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                            c.approved
                              ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {c.approved ? 'Hide' : 'Approve'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-xs px-2.5 py-1 rounded-md text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* KHUNG SOẠN THẢO TRẢ LỜI (MỞ RA KHI BẤM NÚT "Rep") */}
                    {replyingToId === c.id && (
                      <div className="mt-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg animate-in fade-in duration-150">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-neutral-600">
                            Replying to <strong className="text-neutral-900">@{c.name}</strong> as{' '}
                            <span className="text-[#e67e22] font-serif">The Grind Chronicle</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="text-[11px] text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          autoFocus
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Type your reply to ${c.name}…`}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-md focus:outline-none focus:border-amber-600 transition-all font-sans resize-none"
                        />

                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            disabled={replySending || !replyText.trim()}
                            onClick={() => handleSendReply(c)}
                            className="px-4 py-1.5 bg-[#e67e22] hover:bg-[#d35400] text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {replySending ? 'Posting Reply…' : 'Send Reply ↵'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* BỘ PHÂN TRANG */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 py-3 px-4 bg-neutral-50/50 font-sans border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 text-xs border border-neutral-200 rounded text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNum = index + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2.5 py-1 text-xs border rounded transition-colors cursor-pointer ${
                            isActive
                              ? 'border-neutral-950 bg-neutral-950 text-white font-medium'
                              : 'border-neutral-200 text-neutral-700 hover:border-neutral-900 bg-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 text-xs border border-neutral-200 rounded text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div>
            {subscribers.length === 0 ? (
              <div className="py-12 bg-white border border-neutral-200 rounded-xl text-center text-xs text-neutral-400 font-serif italic">
                No newsletter subscribers recorded yet.
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden shadow-2xs">
                {subscribers.map((s, index) => (
                  <div key={s.id} className="p-3.5 px-4 sm:px-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-300 font-mono w-6 text-right">
                        {index + 1}.
                      </span>
                      <div>
                        <span className="font-medium text-xs sm:text-sm text-neutral-900 block">
                          {s.email}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          Joined on{' '}
                          {new Date(s.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSubscriber(s.id)}
                      className="text-xs text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Remove subscriber"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
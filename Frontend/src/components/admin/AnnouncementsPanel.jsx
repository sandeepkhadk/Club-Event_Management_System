// AnnouncementsPanel.jsx
import React, { useState } from 'react';
import { Megaphone, Send, Trash2, Clock, Shield } from 'lucide-react';

const AnnouncementsPanel = ({
  announcements = [],
  isAdmin,
  onPost,
  onDelete,
  currentUserId,
}) => {
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!text.trim()) return;
    setPosting(true);
    await onPost(text.trim());
    setText('');
    setPosting(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-2xl shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-[#39D353]/15 border border-[#39D353]/30
          flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-6 h-6 text-[#39D353]" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Announcements</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}&nbsp;·&nbsp;
            <span className={isAdmin ? 'text-[#39D353] font-semibold' : 'text-slate-500'}>
              {isAdmin ? 'You can post announcements' : 'Read-only'}
            </span>
          </p>
        </div>
      </div>

      {/* Compose box — admin only */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Post New Announcement
            </span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write an announcement for all club members..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
              text-sm text-slate-700 placeholder-slate-400 resize-none
              focus:outline-none focus:ring-2 focus:ring-[#39D353]/40 focus:border-[#39D353]
              transition-all duration-200"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${text.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
              {text.length} / 500
            </span>
            <button
              onClick={handlePost}
              disabled={!text.trim() || posting || text.length > 500}
              className="flex items-center gap-2 px-5 py-2.5
                bg-[#39D353] hover:bg-[#2bb545] disabled:bg-slate-200
                text-slate-900 disabled:text-slate-400
                text-sm font-bold rounded-xl shadow-sm
                transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Announcements list */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="py-16 bg-white text-center rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-600 mb-1">No Announcements Yet</h3>
            <p className="text-sm text-slate-400">
              {isAdmin ? 'Post your first announcement above.' : 'Check back later for updates.'}
            </p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5
                hover:border-[#39D353]/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Green accent bar */}
                  <div className="w-1 self-stretch rounded-full bg-[#39D353] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {ann.message || ann.content || ann.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Shield className="w-3 h-3 text-yellow-500" />
                        {ann.posted_by_name || ann.author || 'Admin'}
                      </span>
                      <span className="text-slate-300 text-xs">·</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(ann.created_at || ann.posted_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: delete (admin only, or own post) */}
                {isAdmin && (
                  <button
                    onClick={() => onDelete(ann.id)}
                    className="flex-shrink-0 p-2 rounded-xl
                      bg-red-50 hover:bg-red-500
                      text-red-400 hover:text-white
                      border border-red-100 hover:border-red-500
                      transition-all duration-200"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AnnouncementsPanel;
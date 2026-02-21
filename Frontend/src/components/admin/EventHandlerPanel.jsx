// EventHandlerPanel.jsx
import React, { useState } from 'react';
import {
  ClipboardList, CheckCircle, XCircle,
  Clock, Pencil, UserCheck
} from 'lucide-react';

const EventHandlerPanel = ({ handlerEvents, onEdit, onApproveJoin, onRejectJoin }) => {
  const [expandedEvent, setExpandedEvent] = useState(null);

  if (handlerEvents.length === 0) {
    return (
      <div className="p-12 bg-white text-center rounded-2xl border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
          <ClipboardList className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-600 mb-1">No Events Assigned</h3>
        <p className="text-sm text-slate-400">
          You haven't been assigned as a handler for any events yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-2xl shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-[#39D353]/15 border border-[#39D353]/30
          flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-6 h-6 text-[#39D353]" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">My Assigned Events</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {handlerEvents.length} event{handlerEvents.length !== 1 ? 's' : ''}&nbsp;·&nbsp;
            <span className="text-[#39D353] font-semibold">Edit &amp; manage join requests</span>
          </p>
        </div>
      </div>

      {/* ── Event Cards ──────────────────────────────────── */}
      <div className="space-y-4">
        {handlerEvents.map(event => {
          const pendingRequests = (event.join_requests || []).filter(r => r.status === 'pending');
          const isExpanded = expandedEvent === event.id;

          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Event row */}
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {event.title || event.name}
                    </h3>
                    {pendingRequests.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                        text-[10px] font-bold bg-amber-100 text-amber-600 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        {pendingRequests.length} pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {event.date || event.event_date || 'Date TBD'}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Edit button */}
                  <button
                    onClick={() => onEdit(event)}
                    className="flex items-center gap-1.5 px-3 py-2
                      bg-[#39D353]/10 hover:bg-[#39D353]
                      text-[#39D353] hover:text-slate-900
                      text-xs font-bold rounded-xl
                      border border-[#39D353]/30 hover:border-[#39D353]
                      transition-all duration-200"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  {/* Toggle join requests */}
                  {(event.join_requests || []).length > 0 && (
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                      className="flex items-center gap-1.5 px-3 py-2
                        bg-slate-100 hover:bg-slate-200
                        text-slate-600 text-xs font-bold rounded-xl
                        border border-slate-200 transition-all duration-200"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Requests
                      <span className={`ml-1 inline-block transition-transform duration-200
                        ${isExpanded ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── Join Requests Panel ───────────────────── */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Join Requests ({(event.join_requests || []).length})
                  </p>

                  {(event.join_requests || []).map(req => (
                    <div
                      key={req.user_id}
                      className="flex items-center justify-between gap-3 p-3
                        bg-white rounded-xl border border-slate-100 shadow-sm"
                    >
                      {/* User info */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500
                          flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {req.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{req.name || 'Unknown'}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold
                            px-1.5 py-0.5 rounded-full
                            ${req.status === 'pending'  ? 'bg-amber-100 text-amber-600' :
                              req.status === 'approved' ? 'bg-[#39D353]/15 text-[#25a83d]' :
                              'bg-red-100 text-red-500'}`}>
                            {req.status === 'pending'  && <Clock className="w-2.5 h-2.5" />}
                            {req.status === 'approved' && <CheckCircle className="w-2.5 h-2.5" />}
                            {req.status === 'rejected' && <XCircle className="w-2.5 h-2.5" />}
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Actions — only for pending */}
                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onApproveJoin(event.id, req.user_id)}
                            className="flex items-center gap-1 px-3 py-1.5
                              bg-[#39D353] hover:bg-[#2bb545]
                              text-slate-900 text-xs font-bold rounded-lg
                              transition-all duration-200 shadow-sm"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => onRejectJoin(event.id, req.user_id)}
                            className="flex items-center gap-1 px-3 py-1.5
                              bg-red-50 hover:bg-red-500
                              text-red-500 hover:text-white text-xs font-bold rounded-lg
                              border border-red-200 hover:border-red-500
                              transition-all duration-200"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventHandlerPanel;
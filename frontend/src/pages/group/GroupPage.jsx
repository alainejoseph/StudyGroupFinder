import React, { useEffect, useState } from "react";
import { MessageCircle, Users, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

/* ---------------- Skeleton Component ---------------- */

const Skeleton = ({ className }) => {
  return (
    <div
      className={`bg-slate-800 animate-pulse rounded-lg ${className}`}
    />
  );
};

/* ---------------- Main Component ---------------- */

export default function StudyGroupPage() {
  const location = useLocation();
  const { groupId } = location.state || {};

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    axios
      .get(`${BACKEND}/group/${groupId}`, { withCredentials: true })
      .then((res) => {
        // Small delay for smooth UX
        setTimeout(() => {
          setGroup(res.data.group);
          setLoading(false);
        }, 10000);
      })
      .catch(() => {
        setLoading(false)
        enqueueSnackbar("try again by refreshing", {
          variant: "error", anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      });
  }, [groupId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* ================= HERO ================= */}
        <div className="rounded-2xl p-6 md:p-10 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold">
                {loading ? (
                  <Skeleton className="h-10 w-72" />
                ) : (
                  group?.name
                )}
              </h2>

              {/* Description */}
              <div className="mt-4 text-white/80 max-w-2xl">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : (
                  group?.description
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/90">
                {loading ? (
                  <>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {group?.members?.length || 0} members
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {group?.schedule || "Schedule not set"}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-36" />
                  <Skeleton className="h-10 w-36" />
                </>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition">
                    <MessageCircle size={18} /> Open Chat
                  </button>
                  <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl transition">
                    Leave Group
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-8">
            {/* -------- Pinned Messages -------- */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Pinned Messages
              </h3>

              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-slate-700 rounded-xl p-4 bg-slate-800"
                    >
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))
                  : group?.pinnedMessages?.length > 0
                    ? group.pinnedMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className="border border-amber-500/40 rounded-xl p-4 bg-slate-800"
                      >
                        <p>{msg.text}</p>
                        <p className="text-sm text-slate-400 mt-2">
                          {msg.author} • {msg.time}
                        </p>
                      </div>
                    ))
                    : (
                      <p className="text-slate-400">No pinned messages</p>
                    )}
              </div>
            </section>

            {/* -------- Upcoming Sessions -------- */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Upcoming Sessions
              </h3>

              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-slate-700 rounded-xl p-4 bg-slate-800"
                    >
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))
                  : group?.sessions?.length > 0
                    ? group.sessions.map((session) => (
                      <div
                        key={session._id}
                        className="border border-slate-700 hover:border-indigo-500 transition rounded-xl p-4 bg-slate-800 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">
                            {session.title}
                          </p>
                          <p className="text-sm text-slate-400">
                            {session.date} • {session.time}
                          </p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                          Study Session
                        </span>
                      </div>
                    ))
                    : (
                      <p className="text-slate-400">No sessions scheduled</p>
                    )}
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Members ({loading ? "..." : group?.members?.length || 0})
              </h3>

              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))
                  : group?.members?.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
                        {member.name?.charAt(0)}
                      </div>
                      <span className="text-slate-300">
                        {member.name}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all"); // "all" or "unread"

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/notifications?page=${page}&limit=20&unreadOnly=${filter === "unread"}`
      );
      setNotifications(data.notifications || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { data } = await api.get("/api/notifications/unread-count");
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Error loading unread count:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [page, filter]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/api/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.entityType === "TASK" && notification.entityId) {
      return `/student/tasks/${notification.entityId}/submissions`;
    }
    if (notification.entityType === "SUBMISSION" && notification.entityId) {
      try {
        const metadata = notification.metadata 
          ? (typeof notification.metadata === 'string' 
              ? JSON.parse(notification.metadata) 
              : notification.metadata)
          : {};
        if (metadata.taskId) {
          return `/student/tasks/${metadata.taskId}/submissions`;
        }
      } catch (err) {
        console.error("Error parsing notification metadata:", err, notification.metadata);
        return null;
      }
    }
    if (notification.entityType === "PROJECT" && notification.entityId) {
      return `/student/projects/${notification.entityId}`;
    }
    return null;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getTypeColor = (type) => {
    const colors = {
      DEADLINE_REMINDER: "bg-yellow-500/20 text-yellow-300",
      FEEDBACK_ADDED: "bg-blue-500/20 text-blue-300",
      GRADE_POSTED: "bg-green-500/20 text-green-300",
      TASK_APPROVED: "bg-green-500/20 text-green-300",
      TASK_ASSIGNED: "bg-purple-500/20 text-purple-300",
      TASK_UPDATED: "bg-orange-500/20 text-orange-300",
      PROJECT_UPDATED: "bg-indigo-500/20 text-indigo-300",
    };
    return colors[type] || "bg-white/10 text-white/70";
  };

  if (loading && notifications.length === 0) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-4xl animate-pulse">🔔</div>
            <p className="text-white/70">Loading notifications...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-2xl backdrop-blur-sm">
                🔔
              </div>
              <h1 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-3xl font-bold text-transparent">
                Notifications
              </h1>
            </div>
            <p className="mt-2 text-lg text-white/80">
              {unreadCount > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-secondary"></span>
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-emerald-400">✓ All caught up!</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-5 py-2.5 text-sm font-bold text-brand-secondary backdrop-blur-sm transition-all duration-300 hover:bg-brand-secondary/20 hover:scale-105"
            >
              ✓ Mark all as read
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm"
        >
          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
              filter === "all"
                ? "bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark shadow-lg"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter("unread");
              setPage(1);
            }}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
              filter === "unread"
                ? "bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark shadow-lg"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </motion.div>

        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 text-center backdrop-blur-2xl"
          >
            <div className="text-6xl mb-4">🔕</div>
            <p className="text-lg font-semibold text-white/90">No Notifications</p>
            <p className="mt-2 text-white/60">No notifications found.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const link = getNotificationLink(notification);
              const NotificationCard = (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    !notification.isRead
                      ? "border-brand-secondary/40 bg-gradient-to-br from-brand-secondary/10 to-brand-accent/10"
                      : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {notification.type.replace("_", " ")}
                        </span>
                        {!notification.isRead && (
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-secondary shadow-lg shadow-brand-secondary/50" />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {notification.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {notification.message}
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-xs text-white/50">
                        <span>🕐</span>
                        <span>{formatTime(notification.createdAt)}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleMarkAsRead(notification.id);
                          }}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-brand-secondary/40 hover:bg-brand-secondary/10 hover:text-white"
                        >
                          ✓ Read
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(notification.id);
                        }}
                        className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 backdrop-blur-sm transition-all duration-300 hover:border-red-400 hover:bg-red-500/20"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              );

              return link ? (
                <Link key={notification.id} to={link} className="block">
                  {NotificationCard}
                </Link>
              ) : (
                <div key={notification.id}>{NotificationCard}</div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-sm text-white/70">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}



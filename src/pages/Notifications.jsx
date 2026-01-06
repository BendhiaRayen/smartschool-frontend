import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <p className="text-white/70">Loading notifications...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Notifications</h1>
            <p className="mt-2 text-white/70">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-4 py-2 text-sm font-semibold text-brand-secondary transition hover:bg-brand-secondary/20"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              filter === "all"
                ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter("unread");
              setPage(1);
            }}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              filter === "unread"
                ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
            No notifications found.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const link = getNotificationLink(notification);
              const NotificationCard = (
                <div
                  className={`rounded-2xl border p-4 transition ${
                    !notification.isRead
                      ? "border-brand-secondary/40 bg-brand-secondary/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {notification.type.replace("_", " ")}
                        </span>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-brand-secondary" />
                        )}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/70">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-white/50">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:border-white/20 hover:text-white"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:border-red-400 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );

              return link ? (
                <Link key={notification.id} to={link}>
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



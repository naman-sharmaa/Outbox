"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { format } from "date-fns";
import ComposeModal from "@/components/ComposeModal";
import {
  Send,
  Clock,
  AlertCircle,
  BarChart2,
  Mail,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

axios.defaults.withCredentials = true;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");
  const [jobs, setJobs] = useState({ scheduled: [], sent: [] });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchJobs();

    const jobsRefreshInterval = window.setInterval(fetchJobs, 3000);
    return () => window.clearInterval(jobsRefreshInterval);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data);
    } catch (err) {
      window.location.href = "/";
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      setJobs(res.data);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        window.location.href = "/";
      }
    }
  };

  const handleLogout = async () => {
    await axios.post(`${API_URL}/auth/logout`);
    window.location.href = "/";
  };

  const currentJobs = activeTab === "scheduled" ? jobs.scheduled : jobs.sent;

  const groupedJobs = useMemo(() => {
    const groups: Record<string, any> = {};
    currentJobs.forEach((job: any) => {
      const dateVal = activeTab === "scheduled" ? job.scheduledAt : job.sentAt;
      const timeKey = dateVal
        ? format(new Date(dateVal), "MMM d, yyyy HH:mm")
        : "no-date";

      // Group by Campaign ID + Time. If no Campaign ID exists (older jobs), group by Subject + Time.
      const key = job.campaignId
        ? `${job.campaignId}-${timeKey}`
        : `legacy-${job.subject}-${timeKey}`;

      if (!groups[key]) {
        groups[key] = {
          id: key,
          isCampaign: !!job.campaignId,
          subject: job.subject,
          scheduledAt: job.scheduledAt,
          sentAt: job.sentAt,
          status: job.status,
          jobs: [],
        };
      }
      groups[key].jobs.push(job);
    });
    return Object.values(groups);
  }, [currentJobs, activeTab]);

  if (!user)
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center text-text-muted">
        Loading your workspace...
      </div>
    );

  const toggleGroup = (groupId: string) => {
    const next = new Set(expandedGroups);
    if (next.has(groupId)) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    setExpandedGroups(next);
  };

  const sentCount = jobs.sent.filter((j: any) => j.status === "sent").length;
  const failedCount = jobs.sent.filter(
    (j: any) => j.status === "failed",
  ).length;

  return (
    <div className="min-h-screen bg-brand-base font-body text-text-base flex flex-col">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-surface px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6347] flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <span className="font-display font-semibold text-xl tracking-tight text-white hidden md:block">
              ReachInbox
            </span>
          </div>
          <div className="h-6 w-px bg-brand-border hidden md:block"></div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-base border border-brand-border overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800"></div>
              )}
            </div>
            <div>
              <h2 className="font-medium text-sm leading-tight text-text-base">
                {user.name}
              </h2>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {user.slackWebhookUrl ? (
            <span className="text-xs font-medium text-green-700 border border-green-200 px-3 py-1.5 rounded-md bg-green-50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Slack Connected
            </span>
          ) : (
            <a
              href={`${API_URL}/auth/slack`}
              className="text-sm font-medium text-text-base bg-brand-surface border border-brand-border px-4 py-2 rounded-md hover:bg-brand-base transition-colors shadow-sm"
            >
              Connect Slack
            </a>
          )}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-text-muted hover:text-text-base px-2"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-muted">
                Total Scheduled
              </h3>
              <Clock className="text-accent-primary opacity-80" size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-text-base">
              {jobs.scheduled.length}
            </p>
          </div>
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-muted">
                Total Sent
              </h3>
              <Send className="text-green-600 opacity-80" size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-text-base">
              {sentCount}
            </p>
          </div>
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-muted">
                Failed Sends
              </h3>
              <AlertCircle className="text-red-500 opacity-80" size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-text-base">
              {failedCount}
            </p>
          </div>
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-muted">
                Open Rate (Est)
              </h3>
              <BarChart2 className="text-accent-amber opacity-80" size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-text-base">
              ~24%
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-brand-surface border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="px-6 py-5 border-b border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-brand-surface">
            <div className="flex gap-1 bg-brand-base p-1 rounded-lg border border-brand-border">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "scheduled" ? "bg-brand-surface shadow-sm text-text-base" : "text-text-muted hover:text-text-base"}`}
                onClick={() => setActiveTab("scheduled")}
              >
                Scheduled
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "sent" ? "bg-brand-surface shadow-sm text-text-base" : "text-text-muted hover:text-text-base"}`}
                onClick={() => setActiveTab("sent")}
              >
                History
              </button>
            </div>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="bg-accent-primary hover:bg-accent-primary/90 text-black px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Send size={16} /> New Campaign
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-brand-base border-b border-brand-border z-10">
                <tr className="text-text-muted text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Recipient</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">
                    {activeTab === "scheduled" ? "Scheduled For" : "Sent At"}
                  </th>
                  <th className="p-4 pr-6">Status</th>
                  {activeTab === "scheduled" && (
                    <th className="p-4 pr-6 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {currentJobs.length === 0 && (
                  <tr>
                    <td
                      colSpan={activeTab === "scheduled" ? 5 : 4}
                      className="p-12 text-center text-text-muted"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-brand-base rounded-full flex items-center justify-center mb-4">
                          <Mail className="text-brand-border" size={32} />
                        </div>
                        <p className="text-base font-medium text-text-base">
                          No {activeTab} jobs found.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {groupedJobs.map((group: any) => {
                  const isExpanded = expandedGroups.has(group.id);
                  const isMulti = group.jobs.length > 1;

                  const groupHeader = (
                    <tr
                      key={`group-${group.id}`}
                      onClick={() => isMulti && toggleGroup(group.id)}
                      className={`hover:bg-brand-base/50 transition-colors group ${isMulti ? "cursor-pointer" : ""}`}
                    >
                      <td className="p-4 pl-6 text-sm font-medium text-text-base flex items-center gap-2">
                        {isMulti && (
                          <span className="text-text-muted">
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </span>
                        )}
                        {!isMulti && <span className="w-4 inline-block" />}
                        {isMulti ? (
                          <span className="font-semibold">
                            {group.jobs.length} emails grouped
                          </span>
                        ) : (
                          group.jobs[0].recipient
                        )}
                      </td>
                      <td className="p-4 text-sm text-text-muted truncate max-w-[250px] group-hover:text-text-base transition-colors">
                        {group.subject}
                      </td>
                      <td className="p-4 text-sm font-mono text-text-muted">
                        {format(
                          new Date(
                            activeTab === "scheduled"
                              ? group.scheduledAt
                              : group.sentAt,
                          ),
                          "MMM d, yyyy HH:mm",
                        )}
                      </td>
                      <td className="p-4 pr-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            group.status === "sent"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : group.status === "failed"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {group.status === "sent" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          )}
                          {group.status === "failed" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          )}
                          {group.status === "scheduled" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          )}
                          {group.status.charAt(0).toUpperCase() +
                            group.status.slice(1)}
                        </span>
                      </td>
                      {activeTab === "scheduled" && (
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const msg = isMulti
                                ? `Are you sure you want to cancel all ${group.jobs.length} scheduled emails in this group?`
                                : "Are you sure you want to cancel this scheduled email?";

                              if (window.confirm(msg)) {
                                try {
                                  await Promise.all(
                                    group.jobs.map((j: any) =>
                                      axios.delete(
                                        `${API_URL}/api/jobs/${j.id}`,
                                      ),
                                    ),
                                  );
                                  fetchJobs();
                                } catch (err) {
                                  alert("Failed to cancel one or more jobs.");
                                }
                              }
                            }}
                            className="text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-md transition-colors"
                          >
                            Cancel {isMulti ? "Group" : ""}
                          </button>
                        </td>
                      )}
                    </tr>
                  );

                  if (!isMulti) return groupHeader;

                  const groupItems = isExpanded
                    ? group.jobs.map((job: any) => (
                        <tr
                          key={job.id}
                          className="bg-brand-surface/50 hover:bg-brand-base/50 transition-colors group border-l-2 border-l-brand-border"
                        >
                          <td className="p-4 pl-12 text-sm font-medium text-text-muted">
                            {job.recipient}
                          </td>
                          <td className="p-4 text-sm text-text-muted truncate max-w-[250px]">
                            {job.subject}
                          </td>
                          <td className="p-4 text-sm font-mono text-text-muted">
                            {format(
                              new Date(
                                activeTab === "scheduled"
                                  ? job.scheduledAt
                                  : job.sentAt,
                              ),
                              "MMM d, yyyy HH:mm",
                            )}
                          </td>
                          <td className="p-4 pr-6">
                            <span className="text-xs font-medium text-text-muted">
                              {job.status.charAt(0).toUpperCase() +
                                job.status.slice(1)}
                            </span>
                          </td>
                          {activeTab === "scheduled" && (
                            <td className="p-4 pr-6 text-right">
                              {/* Empty actions column for children since the group handles cancellation */}
                            </td>
                          )}
                        </tr>
                      ))
                    : null;

                  return (
                    <React.Fragment key={group.id}>
                      {groupHeader}
                      {groupItems}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isComposeOpen && (
        <ComposeModal
          onClose={() => setIsComposeOpen(false)}
          onSuccess={() => {
            setIsComposeOpen(false);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
}

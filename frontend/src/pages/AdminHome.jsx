import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  ShieldCheck,
  AlertTriangle,
  Search,
  Ban,
  Trash2, Lock, Unlock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("users");
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const menuItems = [
    { label: "Admin Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [stat, setStat] = useState({ users: 0, groups: 0, reports: 0 })
  const [groups, setGroups] = useState([]);


  useEffect(() => {
    fetchUsers()
    fetchGroups();
    fetchReports();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true)

      const res = await axios.get(`${BACKEND}/admin/users`, { withCredentials: true })

      setUsers(res.data.users)
    } catch (err) {
      console.log(err)
      enqueueSnackbar("error occured try refreshing");
    }
    finally {
      setLoading(false)
    }
  }

  const fetchGroups = async () => {
    try {
      setLoading(true);



      const res = await axios.get(`${BACKEND}/admin/groups`, { withCredentials: true });
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND}/admin/reports`, { withCredentials: true });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id, isBanned) => {
    try {

      await axios.patch(`${BACKEND}/admin/users/${id}/${isBanned ? "unban" : "ban"}`, {}, { withCredentials: true })

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  //SEARCH FILTER 
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  // SEARCH END

  // ADMIN STATS


  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND}/admin/stats`, { withCredentials: true })
      console.log("stats\n", res)
      setStat(res.data || { users: 0, groups: 0, reports: 0 })
    }
    catch (err) {
      console.log(err)
    }


  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">

      {/* ================= SIDEBAR ================= */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col justify-between">

        {/* Logo */}
        <div>
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-indigo-400">
              StudyGroup
            </h1>
            <p className="text-xs text-gray-400">
              Find your study tribe
            </p>
          </div>

          {/* Menu */}
          <div className="p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 ml-64 overflow-y-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">
            Monitor and manage the platform
          </p>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <StatCard
            icon={<Users size={28} />}
            title="Total Users"
            value={stat.users}
            color="bg-indigo-500/20 text-indigo-400"
          />

          <StatCard
            icon={<ShieldCheck size={28} />}
            title="Active Groups"
            value={stat.groups}
            color="bg-green-500/20 text-green-400"
          />

          <StatCard
            icon={<AlertTriangle size={28} />}
            title="Pending Reports"
            value={stat.reports}
            color="bg-red-500/20 text-red-400"
          />

        </div>

        {/* ===== Tabs ===== */}
        <div className="bg-[#1e293b] rounded-xl p-2 flex mb-6">
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            label="User Management"
          />
          <TabButton
            active={activeTab === "groups"}
            onClick={() => setActiveTab("groups")}
            label="Group Moderation"
          />
          <TabButton
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            label="Reports"
          />
        </div>

        {/* ===== USERS TABLE ===== */}
        {activeTab === "users" && (
          <div className="bg-[#1e293b] rounded-xl p-6">

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search users..."
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3">User</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Groups</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Joined</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-[#0f172a]"
                    >
                      <td className="py-4 font-medium">{user.name}</td>
                      <td className="py-4 text-gray-400">{user.email}</td>
                      <td className="py-4">{user.groupsJoined.length}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${user.isBanned
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                            }`}
                        >
                          {user.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">{user.joined}</td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleBan(user._id, user.isBanned)}
                          className={`${user.isBanned
                            ? "text-green-400 hover:text-green-600"
                            : "text-red-400 hover:text-red-600"
                            }`}
                        >
                          {user.isBanned ? <Unlock size={18} /> : <Ban size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
        {
          activeTab === "groups" && <GroupTable />
        }
        {
          activeTab === "reports" && <ReportsTable />
        }
      </div>
    </div>
  );

  function GroupTable() {



    const deleteGroup = async (id) => {
      if (!window.confirm("Are you sure you want to delete this group?")) return;

      try {
        await axios.delete(`${BACKEND}/admin/groups/${id}`, { withCredentials: true });
        fetchGroups();
      } catch (err) {
        console.error(err);
      }
    };

    const toggleLock = async (id) => {
      try {
        await axios.patch(`${BACKEND}/admin/groups/${id}/toggle-lock`, {}, { withCredentials: true });
        fetchGroups();
      } catch (err) {
        console.error(err);
      }
    };

    const filteredGroups = groups.filter((g) =>
      g.groupName.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="bg-[#1e293b] rounded-xl p-6">

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <p className="text-gray-400">Loading groups...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="text-left py-3">Group</th>
                  <th className="text-left py-3">Creator</th>
                  <th className="text-left py-3">Members</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Created</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredGroups.map((group) => (
                  <tr
                    key={group._id}
                    className="border-b border-gray-800 hover:bg-[#0f172a]"
                  >
                    <td className="py-4 font-medium">
                      {group.groupName}
                    </td>

                    <td className="py-4 text-gray-400">
                      {group.createdBy?.name || "Unknown"}
                    </td>

                    <td className="py-4">
                      {group.members?.length || 0}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${group.isLocked
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                          }`}
                      >
                        {group.isLocked ? "Locked" : "Active"}
                      </span>
                    </td>

                    <td className="py-4 text-gray-400">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 flex gap-3">

                      {/* Lock / Unlock */}
                      <button
                        onClick={() => toggleLock(group._id)}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        {group.isLocked ? (
                          <Unlock size={18} />
                        ) : (
                          <Lock size={18} />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteGroup(group._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  function ReportsTable() {
    const resolveReport = async (id) => {
      try {
        await axios.patch(`${BACKEND}/admin/reports/${id}/resolve`);
        fetchReports();
      } catch (err) {
        console.error(err);
      }
    };

    const rejectReport = async (id) => {
      try {
        await axios.patch(`${BACKEND}/admin/reports/${id}/reject`);
        fetchReports();
      } catch (err) {
        console.error(err);
      }
    };

    const filteredReports = reports.filter((r) =>
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.targetType.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="bg-[#1e293b] rounded-xl p-6">

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <p className="text-gray-400">Loading reports...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="text-left py-3">Reporter</th>
                  <th className="text-left py-3">Target</th>
                  <th className="text-left py-3">Reason</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-b border-gray-800 hover:bg-[#0f172a]"
                  >
                    {/* Reporter */}
                    <td className="py-4">
                      <div className="font-medium">
                        {report.reportedBy?.name || "Unknown"}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {report.reportedBy?.email}
                      </div>
                    </td>

                    {/* Target */}
                    <td className="py-4 capitalize">
                      {report.targetType}
                    </td>

                    {/* Reason */}
                    <td className="py-4 text-gray-300">
                      {report.reason}
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : report.status === "resolved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                          }`}
                      >
                        {report.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 flex gap-3">

                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() => resolveReport(report._id)}
                            className="text-green-400 hover:text-green-600"
                          >
                            <CheckCircle size={18} />
                          </button>

                          <button
                            onClick={() => rejectReport(report._id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({ icon, title, value, growth, color }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6 hover:scale-105 transition shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-green-400 text-sm font-medium">
          {growth}
        </span>
      </div>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${active
        ? "bg-indigo-600 text-white"
        : "text-gray-400 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}


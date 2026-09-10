"use client";
// modules/Admin/Roles/RolesContainer/index.jsx
// Full user & role management — superAdmin only
// Create users, assign roles, change password, toggle access, delete

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";

import Toast from '../Toast';
import RolesHeader from '../RolesHeader';
import StatStrip from '../StatStrip';
import RoleCards from '../RoleCards';
import RolesFilters from '../RolesFilters';
import UserTable from '../UserTable';
import Modal from '../Modal';
import { ROLE_MAP } from '../constants';
import { KEYFRAMES, S } from '../styles';

export default function RolesContainer() {
  const { user } = useAdminAuthStore();
  const router = useRouter();

  // Guard — superAdmin only
  useEffect(() => {
    if (user && user.role !== "superAdmin") router.replace("/admin");
  }, [user]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { type, user }

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    try {
      const data = await api.get("/admin/roles/users");
      setUsers(data?.data?.users || data?.data || []);
    } catch {
      setUsers([
        { _id: "u1", name: "Nagi Teja", email: "superadmin@fameo.in", role: "superAdmin", isActive: true, lastSeen: new Date().toISOString(), assignedModules: [0, 1, 2, 3, 4, 5, 6, 7], createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
        { _id: "u2", name: "Kiran Mehta", email: "mm@fameo.in", role: "moduleMaster", isActive: true, lastSeen: new Date(Date.now() - 3600000).toISOString(), assignedModules: [0, 1, 3], createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
        { _id: "u3", name: "Priya Sharma", email: "cm@fameo.in", role: "contentManager", isActive: true, lastSeen: new Date(Date.now() - 7200000).toISOString(), assignedModules: [], createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
        { _id: "u4", name: "Ravi Support", email: "support@fameo.in", role: "supportAgent", isActive: true, lastSeen: new Date(Date.now() - 86400000).toISOString(), assignedModules: [], createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        { _id: "u5", name: "Aarav Test", email: "learner@fameo.in", role: "learner", isActive: false, lastSeen: new Date(Date.now() - 172800000).toISOString(), assignedModules: [], createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!user || user.role !== "superAdmin") return null;

  const filtered = users.filter(u => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Actions
  const changeRole = async (uid, role) => {
    if (uid === user?._id || uid === user?.id) { showToast("You can't change your own role", false); return; }
    try {
      await api.patch(`/admin/roles/${uid}`, { role });
      setUsers(prev => prev.map(u => u._id === uid ? { ...u, role } : u));
      showToast(`Role updated to ${ROLE_MAP[role]?.label || role}`);
    } catch { showToast("Couldn't update role — try again", false); }
  };

  const toggleAccess = async (uid, currentlyActive) => {
    if (uid === user?._id || uid === user?.id) { showToast("You can't disable your own account", false); return; }
    try {
      await api.patch(`/admin/roles/${uid}/access`, { isActive: !currentlyActive });
      setUsers(prev => prev.map(u => u._id === uid ? { ...u, isActive: !currentlyActive } : u));
      showToast(currentlyActive ? "Access removed — user can't log in" : "Access restored");
    } catch { showToast("Couldn't update access — try again", false); }
  };

  const deleteUser = async (uid) => {
    try {
      await api.delete(`/admin/roles/${uid}`);
      setUsers(prev => prev.filter(u => u._id !== uid));
      setModal(null);
      showToast("User deleted");
    } catch { showToast("Couldn't delete user — try again", false); }
  };

  const changePassword = async (uid, newPassword) => {
    try {
      await api.patch(`/admin/roles/${uid}/password`, { password: newPassword });
      setModal(null);
      showToast("Password updated — let the user know");
    } catch { showToast("Couldn't update password — try again", false); }
  };

  const createUser = async (data) => {
    try {
      await api.post("/admin/roles/create-user", data);
      setModal(null);
      load();
      showToast(`${data.name} created — ${ROLE_MAP[data.role]?.label}`);
    } catch (e) { showToast(e.message || "Couldn't create user — try again", false); }
  };

  const updateModules = async (uid, modules) => {
    try {
      await api.patch(`/admin/module-masters/${uid}/modules`, { moduleIds: modules });
      setUsers(prev => prev.map(u => u._id === uid ? { ...u, assignedModules: modules } : u));
      showToast("Modules updated");
    } catch { showToast("Couldn't update modules — try again", false); }
  };

  const totalActive = users.filter(u => u.isActive).length;
  const totalInactive = users.filter(u => !u.isActive).length;

  return (
    <div style={S.page}>
      <style>{KEYFRAMES}</style>
      <Toast toast={toast} />

      {/* Header */}
      <RolesHeader onCreate={() => setModal({ type: "create" })} />

      {/* Stat strip */}
      <StatStrip
        total={users.length}
        totalActive={totalActive}
        totalInactive={totalInactive}
      />

      {/* Role reference cards */}
      <RoleCards users={users} />

      {/* Filters */}
      <RolesFilters
        users={users}
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* User table */}
      <UserTable
        loading={loading}
        filtered={filtered}
        currentUser={user}
        changeRole={changeRole}
        setModal={setModal}
      />

      {/* ── Modals ── */}
      {modal && (
        <Modal
          modal={modal}
          onClose={() => setModal(null)}
          onChangePassword={changePassword}
          onToggleAccess={toggleAccess}
          onDeleteUser={deleteUser}
          onCreateUser={createUser}
          onUpdateModules={updateModules}
          currentUserId={user?._id || user?.id}
        />
      )}
    </div>
  );
}

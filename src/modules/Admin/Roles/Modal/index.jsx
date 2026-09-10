"use client";
// modules/Admin/Roles/Modal/index.jsx

import CreateUserModal from './CreateUserModal';
import PasswordModal from './PasswordModal';
import AccessModal from './AccessModal';
import DeleteModal from './DeleteModal';
import ModulesModal from './ModulesModal';

/* ── Modal dispatcher ── */
export default function Modal({ modal, onClose, onChangePassword, onToggleAccess, onDeleteUser, onCreateUser, onUpdateModules }) {
  if (modal.type === "create") return <CreateUserModal onClose={onClose} onCreate={onCreateUser} />;
  if (modal.type === "password") return <PasswordModal onClose={onClose} user={modal.user} onSave={onChangePassword} />;
  if (modal.type === "access") return <AccessModal onClose={onClose} user={modal.user} onConfirm={onToggleAccess} />;
  if (modal.type === "delete") return <DeleteModal onClose={onClose} user={modal.user} onConfirm={onDeleteUser} />;
  if (modal.type === "modules") return <ModulesModal onClose={onClose} user={modal.user} onSave={onUpdateModules} />;
  return null;
}

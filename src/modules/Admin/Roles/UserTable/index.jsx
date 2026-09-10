"use client";
// modules/Admin/Roles/UserTable/index.jsx

import UserRow from './UserRow';
import { S } from '../styles';
import { ROLE_MAP } from '../constants';

export default function UserTable({ loading, filtered, currentUser, changeRole, setModal }) {
  return (
      <>
        {loading ? <div style={S.empty}>Loading users…</div> :
          filtered.length === 0 ? (
            <div style={S.empty}>
              No users match this filter. Adjust your search, or create a new user.
            </div>
          ) :
            <div style={S.table}>
              <div style={S.thead}>
                <span style={{ flex: 2.5 }}>User</span>
                <span style={{ flex: 1.5 }}>Role</span>
                <span style={{ flex: 1.5 }}>Modules</span>
                <span style={{ flex: 1 }}>Status</span>
                <span style={{ flex: 1 }}>Last seen</span>
                <span style={{ flex: 1 }}>Joined</span>
                <span style={{ flex: 2, textAlign: "right" }}>Actions</span>
              </div>

              {filtered.map(u => {
                const rc = ROLE_MAP[u.role] || { color: "#9c9484", label: u.role };
                const isSelf = u._id === currentUser?._id || u._id === currentUser?.id;

                return <UserRow key={u._id} u={u} rc={rc} isSelf={isSelf} changeRole={changeRole} setModal={setModal} />;
              })}
            </div>
        }
      </>
  );
}

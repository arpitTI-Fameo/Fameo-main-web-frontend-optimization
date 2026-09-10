"use client";
// app/admin/contacts/page.js

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}

export default function ContactsPage() {
  const { user }  = useAdminAuthStore();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRole] = useState("all");

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter !== "all") params.set("role", roleFilter);
      const data = await api.get(`/admin/contacts?${params}`);
      setUsers(data?.data?.users || []);
    } catch {
      setUsers([
        { _id:"u1", name:"Aarav Sharma",  email:"aarav@example.com",  role:"learner",  createdAt:new Date(Date.now()-86400000).toISOString(),  orderCount:3, isActive:true  },
        { _id:"u2", name:"Priya Nair",    email:"priya@example.com",  role:"learner",  createdAt:new Date(Date.now()-172800000).toISOString(), orderCount:1, isActive:true  },
        { _id:"u3", name:"Rohit Verma",   email:"rohit@example.com",  role:"creator",  createdAt:new Date(Date.now()-259200000).toISOString(), orderCount:5, isActive:true  },
        { _id:"u4", name:"Sneha Kumar",   email:"sneha@example.com",  role:"learner",  createdAt:new Date(Date.now()-345600000).toISOString(), orderCount:0, isActive:false },
        { _id:"u5", name:"Kiran Patel",   email:"kiran@example.com",  role:"creator",  createdAt:new Date(Date.now()-432000000).toISOString(), orderCount:2, isActive:true  },
      ]);
    }
    setLoading(false);
  }, [search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const ROLE_COLOR = { learner:"#7eb8d8", creator:"#C9A96E", brand:"#b89fd4", educator:"#7ec87e" };

  // supportAgent sees limited info — no email
  const showEmail = user?.role !== "supportAgent" || user?.role === "superAdmin";

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Contacts</h1>
          <p style={S.sub}>
            {user?.role === "supportAgent"
              ? "Learner profiles — use for diagnosing support issues."
              : "All registered users on the platform."}
          </p>
        </div>
        <span style={S.count}>{users.length} users</span>
      </div>

      <div style={S.filters}>
        <input style={S.search} placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={S.select} value={roleFilter} onChange={e => setRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="learner">Learner</option>
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
      </div>

      <div style={S.table}>
        <div style={S.thead}>
          <span style={{flex:2}}>Name</span>
          {showEmail && <span style={{flex:2}}>Email</span>}
          <span style={{flex:1}}>Role</span>
          <span style={{flex:1}}>Orders</span>
          <span style={{flex:1}}>Joined</span>
          <span style={{flex:1}}>Status</span>
        </div>

        {loading ? <div style={S.empty}>Loading…</div> :
         users.length === 0 ? <div style={S.empty}>No users found</div> :
         users.map(u => (
           <div key={u._id} style={S.trow}>
             <div style={{flex:2,display:"flex",alignItems:"center",gap:10,minWidth:0}}>
               <div style={{...S.avatar,background:(ROLE_COLOR[u.role]||"#aaa")+"22",color:ROLE_COLOR[u.role]||"#aaa"}}>
                 {u.name?.charAt(0).toUpperCase()}
               </div>
               <span style={S.name}>{u.name}</span>
             </div>
             {showEmail && <span style={{flex:2,fontSize:12,color:"#666",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</span>}
             <span style={{flex:1}}>
               <span style={{...S.rolePill,background:(ROLE_COLOR[u.role]||"#aaa")+"22",color:ROLE_COLOR[u.role]||"#888"}}>{u.role}</span>
             </span>
             <span style={{flex:1,fontSize:12,color:"#888"}}>{u.orderCount || 0}</span>
             <span style={{flex:1,fontSize:11,color:"#bbb"}}>{timeAgo(u.createdAt)}</span>
             <span style={{flex:1}}>
               <span style={{...S.statusDot,background:u.isActive?"#7ec87e":"#d49090",color:u.isActive?"#3a7c3a":"#9a3030"}}>
                 {u.isActive?"Active":"Inactive"}
               </span>
             </span>
           </div>
         ))
        }
      </div>
    </div>
  );
}

const S = {
  page:     { padding:"32px 40px",maxWidth:1100,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
  header:   { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 },
  heading:  { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sub:      { fontSize:13,color:"#aaa" },
  count:    { fontSize:12,color:"#bbb",alignSelf:"center" },
  filters:  { display:"flex",gap:10,marginBottom:16 },
  search:   { fontSize:12,padding:"8px 14px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",width:240,fontFamily:"'DM Sans',sans-serif" },
  select:   { fontSize:12,padding:"8px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" },
  table:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
  thead:    { display:"flex",padding:"10px 16px",background:"#fafaf8",borderBottom:"1px solid #ededea",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",gap:12 },
  trow:     { display:"flex",alignItems:"center",padding:"11px 16px",borderBottom:"1px solid #f5f5f2",gap:12 },
  avatar:   { width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0 },
  name:     { fontSize:13,fontWeight:400,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" },
  rolePill: { fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,fontWeight:600 },
  statusDot:{ fontSize:9,letterSpacing:".08em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,fontWeight:600,background:"transparent" },
  empty:    { padding:"40px 0",textAlign:"center",fontSize:13,color:"#bbb" },
};
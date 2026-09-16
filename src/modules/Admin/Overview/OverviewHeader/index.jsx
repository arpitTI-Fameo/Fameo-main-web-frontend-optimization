import Link from "next/link";
import { S } from '../styles';
import { greeting } from '../constants';
import { ADMIN_ROUTES } from "@/constants/routes";

export default function OverviewHeader({ user, roleSub, canCreate, isSA, isSupport, role, accent }) {
  return (
    <div style={S.header}>
      <div>
        <h1 style={S.heading}>Good {greeting()}, {user?.name?.split(" ")[0] || "Admin"}</h1>
        <p style={S.sub}>{roleSub}</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {canCreate && (
          <Link href={ADMIN_ROUTES.CONTENT_NEW} style={{ ...S.newBtn, background: accent, color: "#1a1200" }}>
            + New Topic
          </Link>
        )}
        {(isSA || role === "contentManager") && (
          <Link href={ADMIN_ROUTES.COURSES} style={{ ...S.newBtn, background: "#1a1208", color: "#F0E8D6" }}>
            Manage Courses
          </Link>
        )}
        {isSupport && (
          <Link href={ADMIN_ROUTES.SUPPORT} style={{ ...S.newBtn, background: accent, color: "#1a1200" }}>
            View Tickets →
          </Link>
        )}
      </div>
    </div>
  );
}

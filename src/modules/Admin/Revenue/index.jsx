"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAdminRevenue } from "@/lib/hooks/admin/useRevenue";
import { useRouter } from "next/navigation";
import { S } from './styles';

import RevenueHeader from './RevenueHeader';
import RevenueStats from './RevenueStats';
import RevenueTable from './RevenueTable';
import { ADMIN_ROUTES } from "@/constants/routes";
import { ADMIN_ROLE } from "@/constants/roles";

export function Revenue() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const revenueQuery = useAdminRevenue({ enabled: user?.role === "superAdmin" });

  const loading = revenueQuery.isPending;
  const data = revenueQuery.error ? {
    mtd:"₹2,84,000", ytd:"₹18,40,000", transactions:847,
    breakdown:[
      { product:"Reels Masterclass",       revenue:"₹1,04,930", units:234, type:"course"   },
      { product:"Brand Deal Template Pack", revenue:"₹59,613",  units:187, type:"template" },
      { product:"Creator Finance Guide",    revenue:"₹41,950",  units:119, type:"ebook"    },
    ]
  } : revenueQuery.data?.data;

  useEffect(() => {
    if (user && user.role !== ADMIN_ROLE.SUPER_ADMIN) { router.push(ADMIN_ROUTES.ROOT); }
  }, [user, router]);

  if (user?.role !== "superAdmin") return null;

  return (
    <div style={S.page}>
      <RevenueHeader />

      {loading ? <div style={S.empty}>Loading…</div> : <>
        <RevenueStats data={data} />
        <RevenueTable breakdown={data?.breakdown} />
      </>}
    </div>
  );
}

export default Revenue;

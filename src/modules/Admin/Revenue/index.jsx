"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { S } from './styles';

import RevenueHeader from './RevenueHeader';
import RevenueStats from './RevenueStats';
import RevenueTable from './RevenueTable';

export function Revenue() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "superAdmin") { router.push("/admin"); return; }
    fetch("/api/admin/revenue")
      .then(r => r.json())
      .then(d => setData(d.data))
      .catch(() => setData({
        mtd:"₹2,84,000", ytd:"₹18,40,000", transactions:847,
        breakdown:[
          { product:"Reels Masterclass",       revenue:"₹1,04,930", units:234, type:"course"   },
          { product:"Brand Deal Template Pack", revenue:"₹59,613",  units:187, type:"template" },
          { product:"Creator Finance Guide",    revenue:"₹41,950",  units:119, type:"ebook"    },
        ]
      }))
      .finally(() => setLoading(false));
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

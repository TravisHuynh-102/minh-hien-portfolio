import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminCMSDashboard } from "@/components/admin/admin-cms-dashboard";

export const metadata: Metadata = {
  title: "Admin CMS Studio | Portfolio Content Manager",
  description:
    "Trang quản trị nội dung trực quan cho Portfolio 3D Coverflow & Case Study 5 Trạm.",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#F5F3ED] font-mono text-xs text-[#5C5852]">
          Đang tải Admin CMS Studio...
        </div>
      }
    >
      <AdminCMSDashboard />
    </Suspense>
  );
}

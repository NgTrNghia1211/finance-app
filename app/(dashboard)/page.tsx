"use client";

import { Button } from "@/components/ui/button";
import { DataGrid } from "./_components/data-grid";
import { DataChart } from "./_components/data-chart";

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataChart />
    </div>
  );
}

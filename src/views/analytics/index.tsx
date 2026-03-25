"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import {
  SalesTrendChart,
  CategoryPieChart,
  VendorPerformanceBarChart,
} from "./charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("7d");

  const handleDownloadReport = (type: string) => {
    // Simulate download
    alert(`Downloading ${type} report for the last ${timeRange}...`);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Analytics & Reports
          </h1>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-37.5 h-9 text-xs">
              <Calendar className="mr-2 h-3.5 w-3.5 text-zinc-500" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="mtd">Month to Date</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-9 text-xs bg-zinc-900"
            onClick={() => handleDownloadReport("Full Summary")}
          >
            <Download className="mr-2 h-3.5 w-3.5" /> Export Data
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            label="Total Revenue"
            value="₦12.5M"
            icon={TrendingUp}
            variant="emerald"
          />
          <StatCard
            label="Total Orders"
            value="1,240"
            icon={FileText}
            variant="default"
          />
          <StatCard
            label="Active Users"
            value="8,540"
            icon={Users}
            variant="indigo"
          />
          <StatCard
            label="Avg Order Value"
            value="₦10,200"
            icon={CreditCard}
            variant="gold"
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="overview" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "overview",
                  label: "Sales Overview",
                  count: 0,
                  variant: "default",
                },
                {
                  value: "vendors",
                  label: "Vendor Performance",
                  count: 0,
                  variant: "indigo",
                },
                {
                  value: "reports",
                  label: "Export Reports",
                  count: 0,
                  variant: "rose",
                },
              ]}
            />
          </div>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Trend Chart (2/3 width) */}
              <Card className="lg:col-span-2 border-zinc-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-zinc-700">
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SalesTrendChart />
                </CardContent>
              </Card>

              {/* Category Pie (1/3 width) */}
              <Card className="border-zinc-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-zinc-700">
                    Sales by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: VENDORS */}
          <TabsContent value="vendors" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-zinc-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-zinc-700">
                    Top Performing Vendors (Sales Volume)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VendorPerformanceBarChart />
                </CardContent>
              </Card>

              {/* Vendor Summary Table Placeholder */}
              <Card className="border-zinc-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-zinc-700">
                    Subscription Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <span className="text-sm font-medium text-zinc-600">
                      Gold Tier Plan
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      ₦4,200,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <span className="text-sm font-medium text-zinc-600">
                      Silver Tier Plan
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      ₦1,850,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <span className="text-sm font-medium text-zinc-600">
                      Basic Plan
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      ₦500,000
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: REPORTS (Download Center) */}
          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReportCard
                title="Monthly Sales Report"
                desc="Comprehensive breakdown of all sales transactions, refunds, and net revenue."
                onDownload={() => handleDownloadReport("Monthly Sales")}
              />
              <ReportCard
                title="Vendor Payouts"
                desc="History of all settlements processed to vendors including commission deductions."
                onDownload={() => handleDownloadReport("Vendor Payouts")}
              />
              <ReportCard
                title="Customer Demographics"
                desc="Analysis of customer locations, device usage, and purchase frequency."
                onDownload={() => handleDownloadReport("Customer Data")}
              />
              <ReportCard
                title="Tax & Compliance"
                desc="VAT collected and remitted for the selected period."
                onDownload={() => handleDownloadReport("Tax Compliance")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: REPORT CARD ---
function ReportCard({
  title,
  desc,
  onDownload,
}: {
  title: string;
  desc: string;
  onDownload: () => void;
}) {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm hover:border-zinc-300 transition-colors flex flex-col justify-between h-48">
      <div>
        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3">
          <FileText size={20} />
        </div>
        <h3 className="font-bold text-zinc-900">{title}</h3>
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{desc}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        className="w-full mt-4 text-xs"
      >
        <Download className="mr-2 h-3.5 w-3.5" /> Download CSV
      </Button>
    </div>
  );
}

/**
 * AnalyticsDashboard.tsx
 * 
 * Beautiful analytics dashboard with Recharts visualizations.
 * Displays book downloads, engagement metrics, and trends.
 */

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { TrendingUp, BookOpen, Download, Zap } from "lucide-react";

export default function AnalyticsDashboard() {
  // Fetch analytics data
  const { data: metrics, isLoading: metricsLoading } = trpc.analytics.metrics.useQuery();
  const { data: dailyTrend, isLoading: trendLoading } = trpc.analytics.dailyTrend.useQuery();
  const { data: distribution, isLoading: distributionLoading } = trpc.analytics.distribution.useQuery();
  const { data: topBooks, isLoading: topBooksLoading } = trpc.analytics.topBooks.useQuery({ limit: 8 });

  const isLoading = metricsLoading || trendLoading || distributionLoading || topBooksLoading;

  // Prepare chart data
  const chartData = useMemo(() => {
    return {
      trend: dailyTrend || [],
      distribution: distribution || [],
      topBooks: topBooks || [],
    };
  }, [dailyTrend, distribution, topBooks]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="h-96 bg-[oklch(0.97_0.015_85)] rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-[oklch(0.97_0.015_85)] rounded-lg animate-pulse"></div>
          <div className="h-64 bg-[oklch(0.97_0.015_85)] rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Downloads */}
        <Card className="bg-gradient-to-br from-[oklch(0.72_0.12_75)]/10 to-[oklch(0.72_0.12_75)]/5 border border-[oklch(0.72_0.12_75)]/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-medium">Total Downloads</p>
              <p className="text-3xl font-bold text-[oklch(0.15_0.01_60)] mt-2">
                {metrics?.totalDownloads || 0}
              </p>
            </div>
            <Download className="w-10 h-10 text-[oklch(0.72_0.12_75)] opacity-60" />
          </div>
        </Card>

        {/* Total Books */}
        <Card className="bg-gradient-to-br from-[oklch(0.2_0.06_155)]/10 to-[oklch(0.2_0.06_155)]/5 border border-[oklch(0.2_0.06_155)]/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-medium">Total Books</p>
              <p className="text-3xl font-bold text-[oklch(0.15_0.01_60)] mt-2">
                {metrics?.totalBooks || 0}
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-[oklch(0.2_0.06_155)] opacity-60" />
          </div>
        </Card>

        {/* Avg Downloads */}
        <Card className="bg-gradient-to-br from-[oklch(0.4_0.06_155)]/10 to-[oklch(0.4_0.06_155)]/5 border border-[oklch(0.4_0.06_155)]/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-medium">Avg per Book</p>
              <p className="text-3xl font-bold text-[oklch(0.15_0.01_60)] mt-2">
                {metrics?.averageDownloadsPerBook || 0}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-[oklch(0.4_0.06_155)] opacity-60" />
          </div>
        </Card>

        {/* Recently Added */}
        <Card className="bg-gradient-to-br from-[oklch(0.6_0.06_155)]/10 to-[oklch(0.6_0.06_155)]/5 border border-[oklch(0.6_0.06_155)]/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-medium">Added (7 days)</p>
              <p className="text-3xl font-bold text-[oklch(0.15_0.01_60)] mt-2">
                {metrics?.recentlyAdded || 0}
              </p>
            </div>
            <Zap className="w-10 h-10 text-[oklch(0.6_0.06_155)] opacity-60" />
          </div>
        </Card>
      </div>

      {/* Download Trend Chart */}
      <Card className="p-6 border border-[oklch(0.87_0.025_80)]">
        <h3 className="text-lg font-bold text-[oklch(0.15_0.01_60)] mb-4">Download Trend (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 165, 116, 0.1)" />
            <XAxis dataKey="date" stroke="rgba(212, 165, 116, 0.6)" style={{ fontSize: "12px" }} />
            <YAxis stroke="rgba(212, 165, 116, 0.6)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(212, 165, 116, 0.3)",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="downloads"
              stroke="#d4a574"
              strokeWidth={3}
              dot={{ fill: "#d4a574", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books Bar Chart */}
        <Card className="p-6 border border-[oklch(0.87_0.025_80)]">
          <h3 className="text-lg font-bold text-[oklch(0.15_0.01_60)] mb-4">Top Books by Downloads</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.topBooks}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 165, 116, 0.1)" />
              <XAxis
                dataKey="title"
                stroke="rgba(212, 165, 116, 0.6)"
                style={{ fontSize: "11px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="rgba(212, 165, 116, 0.6)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(212, 165, 116, 0.3)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="downloadCount" fill="#d4a574" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Download Distribution Pie Chart */}
        <Card className="p-6 border border-[oklch(0.87_0.025_80)]">
          <h3 className="text-lg font-bold text-[oklch(0.15_0.01_60)] mb-4">Download Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(212, 165, 116, 0.3)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Book Highlight */}
      {metrics?.topBook && (
        <Card className="p-6 border border-[oklch(0.72_0.12_75)]/30 bg-gradient-to-r from-[oklch(0.72_0.12_75)]/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-medium">Most Popular Book</p>
              <p className="text-2xl font-bold text-[oklch(0.15_0.01_60)] mt-2">{metrics.topBook.title}</p>
              <p className="text-[oklch(0.45_0.03_80)] mt-1">
                {metrics.topBook.downloads} downloads
              </p>
            </div>
            <BookOpen className="w-16 h-16 text-[oklch(0.72_0.12_75)] opacity-20" />
          </div>
        </Card>
      )}
    </div>
  );
}

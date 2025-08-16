// File: src/pages/statistics.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// CHANGED: Import our new service function and the DTO type
import {
  getStatisticsSummary,
  type StatisticsSummary,
} from "@/services/statisticsService";

// Components
import StatsCards from "@/components/stats/StatsCards";
import OrdersPieChart from "@/components/stats/OrdersPieChart";
import OrdersBarChart from "@/components/stats/OrdersBarChart";
import ConsultantsChart from "@/components/stats/ConsultantsChart";
import TopCustomersChart from "@/components/stats/TopCustomersChart";
import RecentOrders from "@/components/stats/RecentOrders";
import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";

export default function Statistics() {
  // CHANGED: State now holds the summary object, not the full orders list
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]); // Keep fetching recent orders separately for the table
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // CHANGED: Fetch the pre-calculated summary and the raw recent orders in parallel
        const [summaryData, ordersData] = await Promise.all([
          getStatisticsSummary(),
          getOrders(),
        ]);
        setSummary(summaryData);

        // Sort orders by date to get the most recent ones for the table
        const sortedOrders = ordersData.sort(
          (a, b) =>
            new Date(b.creationDate ?? 0).getTime() -
            new Date(a.creationDate ?? 0).getTime()
        );
        setRecentOrders(sortedOrders.slice(0, 5)); // Take the top 5
      } catch (error) {
        console.error("Failed to fetch statistics data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Dashboard Statistics</h1>

      {isLoading || !summary ? (
        <p>Loading statistics...</p> // Improved loading state
      ) : (
        <>
          {/* CHANGED: Pass the summary object to the stats cards */}
          <StatsCards summary={summary} />

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CHANGED: Each chart now receives its specific, pre-calculated data */}
            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Orders by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersPieChart data={summary.ordersByStatus} />
              </CardContent>
            </Card>

            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Monthly Orders (Last Year)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersBarChart data={summary.monthlyOrders} />
              </CardContent>
            </Card>

            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Top 5 Consultants by Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConsultantsChart data={summary.topConsultants} />
              </CardContent>
            </Card>

            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Top 5 Customers by Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TopCustomersChart data={summary.topCustomers} />
              </CardContent>
            </Card>
          </div>

          {/* NOTE: RecentOrders still needs the raw order objects, which we fetch separately */}
          <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg font-semibold">
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={recentOrders} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// File: src/pages/statistics.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/order";
import { getOrders } from "@/services/orderService";

// Components
import StatsCards from "@/components/stats/StatsCards";
import OrdersPieChart from "@/components/stats/OrdersPieChart";
import OrdersBarChart from "@/components/stats/OrdersBarChart";
import ConsultantsChart from "@/components/stats/ConsultantsChart";
import TopCustomersChart from "@/components/stats/TopCustomersChart";
import RecentOrders from "@/components/stats/RecentOrders";

export default function Statistics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Dashboard Statistics</h1>

      {isLoading ? (
        <p>Loading statistics...</p>
      ) : (
        <>
          <StatsCards orders={orders} currentUserName="John Doe" />

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Orders by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersPieChart orders={orders} />
              </CardContent>
            </Card>

            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Weekly Orders (Last 4 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersBarChart orders={orders} />
              </CardContent>
            </Card>

            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Top 5 Consultants by Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConsultantsChart orders={orders} />
              </CardContent>
            </Card>

            <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg font-semibold">
                  Top 5 Customers by Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TopCustomersChart orders={orders} />
              </CardContent>
            </Card>
          </div>

          <Card className="min-h-[300px] border border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg font-semibold">
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={orders} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

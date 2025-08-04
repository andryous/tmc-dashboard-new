// File: src/components/stats/StatsCards.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/types/order";
import { getFullName } from "@/lib/fullName";

interface StatsCardsProps {
  orders: Order[];
  currentUserName: string;
}

export default function StatsCards({
  orders,
  currentUserName,
}: StatsCardsProps) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const inProgressOrders = orders.filter(
    (o) => o.status === "IN_PROGRESS"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const revenue = orders.length * 50;

  const johnOrders = orders.filter((o) => {
    if (!o.consultant || !currentUserName) return false;
    const fullName = getFullName(o.consultant);
    return (
      fullName.toLowerCase().trim() === currentUserName.toLowerCase().trim()
    );
  }).length;

  const cardClass = "border border-gray-200 text-center";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{totalOrders}</p>
        </CardContent>
      </Card>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{pendingOrders}</p>
        </CardContent>
      </Card>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{inProgressOrders}</p>
        </CardContent>
      </Card>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{completedOrders}</p>
        </CardContent>
      </Card>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{cancelledOrders}</p>
        </CardContent>
      </Card>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">
            Estimated Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">${revenue}</p>
        </CardContent>
      </Card>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-md font-semibold">
            Your orders {currentUserName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{johnOrders}</p>
        </CardContent>
      </Card>
    </div>
  );
}

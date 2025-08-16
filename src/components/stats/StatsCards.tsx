// File: src/components/stats/StatsCards.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// CHANGED: Import our new summary type
import type { StatisticsSummary } from "@/services/statisticsService";
import { DollarSign, Hourglass, ListChecks, Truck } from "lucide-react"; // ADDED: More icons for context

// CHANGED: The component now only needs the summary object
interface StatsCardsProps {
  summary: StatisticsSummary;
}

export default function StatsCards({ summary }: StatsCardsProps) {
  // REMOVED: All calculation logic is now gone. The backend does the work!

  const cardClass = "border border-blue-200 shadow-sm text-center";
  const iconClass = "mx-auto h-8 w-8 text-blue-500 mb-2";

  return (
    // CHANGED: Grid layout is more responsive
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* CHANGED: All cards now read directly from the summary prop */}
      <Card className={cardClass}>
        <CardHeader>
          <ListChecks className={iconClass} />
          <CardTitle className="text-md font-semibold">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">
            {summary.totalOrders}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader>
          <Truck className={iconClass} />
          <CardTitle className="text-md font-semibold">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">
            {summary.ordersInProgress}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader>
          <Hourglass className={iconClass} />
          <CardTitle className="text-md font-semibold">
            Pending Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">
            {summary.pendingServices}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader>
          <DollarSign className={iconClass} />
          <CardTitle className="text-md font-semibold">Est. Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Formatting the revenue to look like currency */}
          <p className="text-4xl font-bold text-blue-600">
            ${summary.estimatedTotalRevenue.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

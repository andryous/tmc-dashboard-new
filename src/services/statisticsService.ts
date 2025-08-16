// File: src/services/statisticsService.ts

import { API_BASE_URL } from "@/lib/api";

// This interface defines the shape of the data we expect from our new backend endpoint.
// It perfectly matches the StatisticsSummaryDTO.java class.
export interface StatisticsSummary {
  totalOrders: number;
  ordersInProgress: number;
  pendingServices: number;
  estimatedTotalRevenue: number;
  ordersByStatus: Record<string, number>;
  servicesByType: Record<string, number>;
  monthlyOrders: Record<string, number>;
  topConsultants: { name: string; count: number }[];
  topCustomers: { name: string; count: number }[];
}

// This is now the only function we need. It makes one call to get all calculated stats.
export async function getStatisticsSummary(): Promise<StatisticsSummary> {
  const response = await fetch(`${API_BASE_URL}/api/statistics/summary`);

  if (!response.ok) {
    throw new Error("Failed to fetch statistics summary from the backend.");
  }
  
  return response.json();
}
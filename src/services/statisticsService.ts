// File: src/services/statisticsService.ts

import type { Order } from "@/types/order";

// Helper function to resolve full name of a person (firstName + lastName)
function getFullName(person: any): string {
  if (person && typeof person === "object") {
    return `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim();
  }
  return String(person);
}

// Count orders grouped by a dynamic key (status, consultant, customer)
export function groupOrdersBy<T extends keyof Order>(orders: Order[], key: T): Record<string, number> {
  return orders.reduce<Record<string, number>>((acc, order) => {
    const value = order[key];
    const name = getFullName(value);
    if (name) {
      acc[name] = (acc[name] || 0) + 1;
    }
    return acc;
  }, {});
}

// Estimate revenue by multiplying number of orders by fixed price
export function calculateEstimatedRevenue(orders: Order[], pricePerOrder = 50): number {
  return orders.length * pricePerOrder;
}

// Get top N items from a grouped map (used for customers or consultants)
export function getTopEntries(map: Record<string, number>, topN: number = 5): { name: string; count: number }[] {
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

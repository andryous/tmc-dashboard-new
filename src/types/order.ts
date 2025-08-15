// File: src/types/order.ts

import type { Person } from "./person";

// Defines the structure for a single service item within an order.
export type OrderItem = {
  id: number;
  serviceType: "MOVING" | "PACKING" | "CLEANING";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  fromAddress: string;
  toAddress: string;
  startDate: string;
  endDate: string;
  note?: string;
};

// Defines the structure for the main order, which now contains multiple items.
export type Order = {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  customer: Person;
  consultant: Person;
  creationDate?: string;
  lastUpdated?: string;
  items: OrderItem[]; // This is the key change: an array of service items.
};
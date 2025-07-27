import type { Person } from "./person";
export type Order = {
  id: number;
  customer: Person;
  consultant: Person;
  serviceType: "MOVING" | "PACKING" | "CLEANING"; 
  fromAddress: string;
  toAddress: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  note: string;
  lastUpdated?: string;
  modifiedBy?: Person;
  parentOrderId?: number | null;
};

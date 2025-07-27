import type { Order } from "@/types/order"

// Simulated async fetch of orders
export async function getOrders(): Promise<Order[]> {
  return [
    {
      id: "ORD-001",
      customer: "Luis Martínez",
      consultant: "Clara Olsen",
      service: "MOVING",
      fromAddress: "Holagata 1, Oslo",
      toAddress: "Chaogata 15, Bergen",
      startDate: "2025-07-02",
      endDate: "2025-07-03",
      status: "PENDING",
      note: "Customer not available until 12 PM"
    },
    {
      id: "ORD-002",
      customer: "Eva Solheim",
      consultant: "Jonas Haugen",
      service: "CLEANING",
      fromAddress: "Markveien 22, Oslo",
      toAddress: "Same location",
      startDate: "2025-07-03",
      endDate: "2025-07-03",
      status: "IN_PROGRESS",
      note: "Bring eco-friendly products"
    },
    {
      id: "ORD-003",
      customer: "Nils Berg",
      consultant: "Marte Knutsen",
      service: "PACKING",
      fromAddress: "Kongens gate 10, Trondheim",
      toAddress: "Kirkegata 12, Trondheim",
      startDate: "2025-07-05",
      endDate: "2025-07-06",
      status: "COMPLETED",
      note: "Fragile kitchen items"
    },
    {
      id: "ORD-004",
      customer: "Anna Svensen",
      consultant: "Emil Larsen",
      service: "MOVING",
      fromAddress: "Ringveien 77, Oslo",
      toAddress: "Parkgata 4, Drammen",
      startDate: "2025-07-04",
      endDate: "2025-07-04",
      status: "CANCELLED",
      note: "Customer cancelled via phone"
    }
  ]
}

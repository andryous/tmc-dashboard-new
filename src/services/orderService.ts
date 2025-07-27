import { API_BASE_URL } from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";

// Fetches orders from the backend and maps them to the frontend format
export async function getOrders(): Promise<Order[]> {
  try {
    // Simulate network delay of 1.5 seconds

// Temporarily disabled delay while testing
// await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = await fetch(`${API_BASE_URL}/api/orders`);

    if (!response.ok) {
      throw new Error("Failed to fetch orders from backend");
    }

    const data = await response.json();
    console.log("RAW BACKEND DATA:", data);

    // Transform backend structure to frontend Order format
    const transformed = data.map((backendOrder: any): Order => ({
      id: backendOrder.id, // WIthout conversion, it respects the type
      parentOrderId: backendOrder.parentOrderId,
      customer: backendOrder.customer,       // reserve as object
      consultant: backendOrder.consultant,   // Preserve as object
      serviceType: backendOrder.serviceType,
      fromAddress: backendOrder.fromAddress,
      toAddress: backendOrder.toAddress,
      startDate: backendOrder.startDate,
      endDate: backendOrder.endDate,
      status: backendOrder.status,
      note: backendOrder.note,
      lastUpdated: backendOrder.lastUpdated,
      modifiedBy: backendOrder.modifiedBy,
      
    }));

    console.log("TRANSFORMED ORDERS:", transformed);
    return transformed;
  } catch (error) {
    console.error("Error loading orders:", error);
    toast.error("Failed to connect to backend");
    return [];
  }
}

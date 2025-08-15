// File: src/services/orderService.ts

import { API_BASE_URL } from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";

/**
 * Fetches all orders from the backend.
 * The backend now returns orders with a nested 'items' array,
 * which should match our new 'Order' and 'OrderItem' types directly.
 * @returns A promise that resolves to an array of orders.
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`);

    if (!response.ok) {
      // Log the response to get more details on the error
      const errorData = await response.text();
      console.error("Failed to fetch orders from backend:", response.status, errorData);
      throw new Error(`Failed to fetch orders. Status: ${response.status}`);
    }

    const data = await response.json();
    
    // The received data should now conform to our updated Order[] type.
    // We can cast it directly.
    return data as Order[];

  } catch (error) {
    console.error("Error loading orders:", error);
    toast.error("Failed to connect to backend or process order data.");
    return []; // Return an empty array on failure.
  }
}


/**
 * Creates a new order by sending the order payload to the backend.
 * @param orderPayload The data for the new order, conforming to the backend's OrderRequestDTO.
 * @returns The newly created order from the backend.
 */
export async function createOrder(orderPayload: {
  customerId: number;
  consultantId: number;
  status: string;
  items: any[]; // Using 'any' for now, can be tightened later
}) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Failed to create order:', errorBody);
    throw new Error(`Failed to create order: ${errorBody}`);
  }

  return await response.json();
}
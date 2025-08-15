// File: src/components/orders/ServiceIcon.tsx

import { Truck, Box, Sparkles } from "lucide-react";
import type { OrderItem } from "@/types/order";

// Helper component to render the correct icon based on the service type.
export const ServiceIcon = ({
  serviceType,
}: {
  serviceType: OrderItem["serviceType"];
}) => {
  const iconProps = { className: "w-5 h-5 mr-2 text-blue-600" };
  switch (serviceType) {
    case "MOVING":
      return <Truck {...iconProps} />;
    case "PACKING":
      return <Box {...iconProps} />;
    case "CLEANING":
      return <Sparkles {...iconProps} />;
    default:
      return null;
  }
};

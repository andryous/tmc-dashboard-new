import type { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceIcon } from "@/components/orders/ServiceIcon";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailsModal({ order }: { order: Order | null }) {
  if (!order) return null;

  function formatText(text: string) {
    if (!text) return "";
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 text-sm">
      {/* CHANGED: Replaced simple grid with a smart grid [auto_1fr] for better alignment */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
        <p>
          <strong>Customer:</strong>
        </p>
        <p>
          {order.customer.firstName} {order.customer.lastName}
        </p>

        <p>
          <strong>Consultant:</strong>
        </p>
        <p>
          {order.consultant
            ? `${order.consultant.firstName} ${order.consultant.lastName}`
            : "—"}
        </p>

        <p>
          <strong>Overall Status:</strong>
        </p>
        <p>
          <Badge className={getStatusBadgeVariant(order.status)}>
            {formatText(order.status)}
          </Badge>
        </p>

        <p>
          <strong>Created On:</strong>
        </p>
        <p>
          {order.creationDate
            ? new Date(order.creationDate).toLocaleString()
            : "—"}
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-semibold text-md">Services Included</h3>
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
          {order.items.map((item) => (
            <Card key={item.id} className="border-blue-300">
              <CardContent className="p-3">
                <div className="flex items-center font-semibold mb-2">
                  <ServiceIcon serviceType={item.serviceType} />
                  <span className="capitalize">
                    {item.serviceType.toLowerCase()}
                  </span>
                </div>
                {/* CHANGED: Applied the same smart grid here */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs pl-7 text-gray-600 items-center">
                  {item.id < 1_000_000 && (
                    <>
                      <p>
                        <strong>Item ID:</strong>
                      </p>
                      <p>#{item.id}</p>
                    </>
                  )}

                  <p>
                    <strong>Status:</strong>
                  </p>
                  <p>
                    <Badge
                      className={`${getStatusBadgeVariant(
                        item.status
                      )} text-xs`}
                    >
                      {formatText(item.status)}
                    </Badge>
                  </p>

                  <p>
                    <strong>From:</strong>
                  </p>
                  <p>{item.fromAddress}</p>

                  <p>
                    <strong>To:</strong>
                  </p>
                  <p>{item.toAddress || "—"}</p>

                  <p>
                    <strong>Dates:</strong>
                  </p>
                  <p>
                    {item.startDate} to {item.endDate}
                  </p>

                  {item.note && (
                    <>
                      <p className="self-start">
                        <strong>Note:</strong>
                      </p>
                      <p className="italic">{item.note}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// File: src/pages/Orders.tsx

import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ChevronUp,
  ChevronDown,
  Truck,
  Box,
  Sparkle,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";
import DeleteOrderDialog from "@/components/orders/DeleteOrderDialog";
import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Orders() {
  // Local state for loaded orders
  const [orders, setOrders] = useState<Order[]>([]);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  // State for error message
  const [error, setError] = useState<string | null>(null);
  // React Router: Query params
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const consultantId = searchParams.get("consultantId");
  // Search input state (persistent)
  const [searchText, setSearchText] = useState(
    () => localStorage.getItem("orders_searchText") ?? ""
  );
  // Sorting state for columns
  const [sortField, setSortField] = useState<"startDate" | "endDate" | "id">(
    () => {
      return (
        (localStorage.getItem("orders_sortField") as
          | "startDate"
          | "endDate"
          | "id") ?? "startDate"
      );
    }
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() => {
    return (
      (localStorage.getItem("orders_sortDirection") as "asc" | "desc") ?? "desc"
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  // Fetch orders on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Show skeletons
        const data = await getOrders();
        setOrders(data); // Save loaded orders
        setError(null); // Reset error
      } catch {
        setError("Failed to load orders");
      } finally {
        setIsLoading(false); // Hide skeletons
      }
    }
    fetchData();
  }, []);

  // Handle sorting of columns
  function handleSort(field: "startDate" | "endDate" | "id") {
    if (field === sortField) {
      const newDir = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDir);
      localStorage.setItem("orders_sortDirection", newDir);
    } else {
      setSortField(field);
      setSortDirection("desc");
      localStorage.setItem("orders_sortField", field);
      localStorage.setItem("orders_sortDirection", "desc");
    }
  }

  // Render arrow icons for column sorting
  function renderSortIcon(field: "startDate" | "endDate" | "id") {
    const active = sortField === field;
    const color = active ? "text-blue-600" : "text-gray-400";
    const Icon = sortDirection === "asc" ? ChevronUp : ChevronDown;
    return <Icon size={16} className={`ml-1 ${color}`} />;
  }

  // Format status string to readable text
  function formatStatus(status: string) {
    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Format service string for display
  function formatService(service: string) {
    return service.charAt(0).toUpperCase() + service.slice(1).toLowerCase();
  }

  // Get icon by service type
  function getServiceIcon(service: string) {
    switch (service) {
      case "MOVING":
        return <Truck className="w-4 h-4 inline-block mr-1" />;
      case "PACKING":
        return <Box className="w-4 h-4 inline-block mr-1" />;
      case "CLEANING":
        return <Sparkle className="w-4 h-4 inline-block mr-1" />;
      default:
        return null;
    }
  }

  // Badge color by status
  function getStatusBadgeVariant(status: string): string {
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
  }

  // Dialog states for order details and delete dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filtered and paginated order list
  const filteredOrders = orders.filter((order) => {
    const matchesCustomerId = customerId
      ? String(order.customer?.id) === customerId
      : true;
    const matchesConsultantId = consultantId
      ? String(order.consultant?.id) === consultantId
      : true;
    const lower = searchText.toLowerCase();
    const matchesSearch =
      order.customer?.firstName?.toLowerCase().includes(lower) ||
      order.customer?.lastName?.toLowerCase().includes(lower) ||
      order.consultant?.firstName?.toLowerCase().includes(lower) ||
      order.consultant?.lastName?.toLowerCase().includes(lower) ||
      order.serviceType?.toLowerCase().includes(lower) ||
      order.fromAddress?.toLowerCase().includes(lower) ||
      order.toAddress?.toLowerCase().includes(lower) ||
      order.status?.toLowerCase().includes(lower) ||
      order.note?.toLowerCase().includes(lower);

    // Allow searching by #orderID or #parentOrderID
    if (lower.startsWith("#")) {
      const id = Number(lower.slice(1));
      return (
        (order.id === id || order.parentOrderId === id) &&
        matchesCustomerId &&
        matchesConsultantId
      );
    }

    return matchesCustomerId && matchesConsultantId && matchesSearch;
  });

  const paginatedOrders = filteredOrders
    .sort((a, b) => {
      let aVal = sortField === "id" ? a.id : new Date(a[sortField]).getTime();
      let bVal = sortField === "id" ? b.id : new Date(b[sortField]).getTime();
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold">Orders</h1>

      {/* Error message if failed to load */}
      {error && <div className="text-red-600 font-medium">{error}</div>}

      {/* Search bar and create order button */}
      <div className="flex justify-end items-center gap-2">
        {/* Search input */}
        <div className="relative w-[280px]">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-md border border-gray-400 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-5 h-5 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Create new order button */}
        <Button asChild>
          <Link
            to="/orders/new"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            + New Order
          </Link>
        </Button>
      </div>

      {/* --- SKELETON TABLE BLOCK (shows when isLoading === true) --- */}
      {isLoading ? (
        <Table className="border border-gray-200">
          <TableHeader>
            <TableRow className="border-b border-blue-200">
              {/* Table headers, matches real table */}
              <TableHead>Order ID</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render 10 skeleton rows with 12 columns, matches layout */}
            {[...Array(10)].map((_, i) => (
              <TableRow key={i} className="odd:bg-white even:bg-blue-100">
                {[...Array(12)].map((_, j) => (
                  <TableCell key={j}>
                    {/* Each cell shows a skeleton loading bar */}
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        // --- ACTUAL ORDERS TABLE (when data loaded) ---
        <>
          <Table className="border border-gray-200">
            <TableHeader>
              <TableRow className="border-b border-blue-200">
                <TableHead onClick={() => handleSort("id")}>
                  <span className="inline-flex items-center font-bold">
                    Order ID {renderSortIcon("id")}
                  </span>
                </TableHead>
                <TableHead className="font-bold">Parent</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Consultant</TableHead>
                <TableHead className="font-bold">Service</TableHead>
                <TableHead className="font-bold">From</TableHead>
                <TableHead className="font-bold">To</TableHead>
                <TableHead onClick={() => handleSort("startDate")}>
                  <span className="inline-flex items-center font-bold">
                    Start Date {renderSortIcon("startDate")}
                  </span>
                </TableHead>
                <TableHead onClick={() => handleSort("endDate")}>
                  <span className="inline-flex items-center font-bold">
                    End Date {renderSortIcon("endDate")}
                  </span>
                </TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Note</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Render paginated order rows */}
              {paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="odd:bg-white even:bg-blue-100 hover:bg-gray-200 border-b border-blue-200"
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.parentOrderId ? `#${order.parentOrderId}` : "—"}
                  </TableCell>
                  <TableCell>
                    {order.customer.firstName} {order.customer.lastName}
                  </TableCell>
                  <TableCell>
                    {order.consultant
                      ? `${order.consultant.firstName} ${order.consultant.lastName}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {getServiceIcon(order.serviceType)}
                    {formatService(order.serviceType)}
                  </TableCell>
                  <TableCell>{order.fromAddress}</TableCell>
                  <TableCell>{order.toAddress}</TableCell>
                  <TableCell>{order.startDate}</TableCell>
                  <TableCell>{order.endDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.note}</TableCell>
                  <TableCell className="space-x-2">
                    {/* View order details button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Search className="w-4 h-4 text-blue-500" />
                    </Button>
                    {/* Edit order button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}/edit`)}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Button>
                    {/* Delete order button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-700" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50"
            >
              Previous
            </Button>

            {Array.from(
              { length: Math.ceil(filteredOrders.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <Button
                key={page}
                size="sm"
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-100"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredOrders.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(filteredOrders.length / itemsPerPage)
              }
              className="bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Dialog for order details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Full information about Order #{selectedOrder?.id}
              {selectedOrder?.parentOrderId != null && (
                <> – Parent: #{selectedOrder.parentOrderId}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <OrderDetailsModal order={selectedOrder} />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting an order */}
      <DeleteOrderDialog
        order={selectedOrder}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteSuccess={(deletedId) => {
          setOrders((prev) => prev.filter((o) => o.id !== Number(deletedId)));
        }}
      />
    </div>
  );
}

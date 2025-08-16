// File: src/pages/Orders.tsx

import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ChevronUp,
  Truck,
  Box,
  Sparkle,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";
import DeleteOrderDialog from "@/components/orders/DeleteOrderDialog";
import { getOrders } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PaginationControls from "@/components/ui/pagination/PaginationControls";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const consultantId = searchParams.get("consultantId");
  const [searchText, setSearchText] = useState(
    localStorage.getItem("orders_searchText") ?? ""
  );
  const [sortField, setSortField] = useState<"creationDate" | "id">(
    (localStorage.getItem("orders_sortField") as "creationDate" | "id") ?? "id"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (localStorage.getItem("orders_sortDirection") as "asc" | "desc") ?? "desc"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (customerId || consultantId) {
          setSearchText("");
        }
        const data = await getOrders();
        setOrders(data);
        setError(null);
      } catch {
        setError("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [customerId, consultantId]);

  const handleSort = (field: "creationDate" | "id") => {
    const newDir =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDir);
    localStorage.setItem("orders_sortField", field);
    localStorage.setItem("orders_sortDirection", newDir);
  };

  const renderSortIcon = (field: "creationDate" | "id") => {
    const active = sortField === field;
    return (
      <ChevronUp
        size={16}
        className={`ml-1 transition-transform ${
          active ? "text-blue-600" : "text-gray-400"
        } ${sortDirection === "desc" ? "rotate-180" : ""}`}
      />
    );
  };

  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const getServiceIcon = (service: OrderItem["serviceType"]) => {
    switch (service) {
      case "MOVING":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "PACKING":
        return <Box className="w-5 h-5  text-blue-500" />;
      case "CLEANING":
        return <Sparkle className="w-5 h-5  text-blue-500" />;
      default:
        return null;
    }
  };

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

  const filteredAndSortedOrders = orders
    .filter((order) => {
      const matchesCustomerId = customerId
        ? String(order.customer?.id) === customerId
        : true;
      const matchesConsultantId = consultantId
        ? String(order.consultant?.id) === consultantId
        : true;
      const lowerSearch = searchText.toLowerCase();
      let matchesSearch =
        String(order.id).includes(lowerSearch) ||
        order.customer?.firstName?.toLowerCase().includes(lowerSearch) ||
        order.customer?.lastName?.toLowerCase().includes(lowerSearch) ||
        order.consultant?.firstName?.toLowerCase().includes(lowerSearch) ||
        order.consultant?.lastName?.toLowerCase().includes(lowerSearch) ||
        order.status?.toLowerCase().includes(lowerSearch);
      if (!matchesSearch) {
        matchesSearch = order.items.some(
          (item) =>
            item.serviceType.toLowerCase().includes(lowerSearch) ||
            item.fromAddress.toLowerCase().includes(lowerSearch) ||
            item.toAddress.toLowerCase().includes(lowerSearch) ||
            item.note?.toLowerCase().includes(lowerSearch)
        );
      }
      return matchesCustomerId && matchesConsultantId && matchesSearch;
    })
    .sort((a, b) => {
      const aVal =
        sortField === "id" ? a.id : new Date(a.creationDate ?? 0).getTime();
      const bVal =
        sortField === "id" ? b.id : new Date(b.creationDate ?? 0).getTime();
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);

  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Orders</h1>
      {error && <div className="text-red-600 font-medium">{error}</div>}
      <div className="flex justify-between items-center gap-2">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by ID, customer, service..."
            value={searchText}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchText(e.target.value)
            }
            className="pl-9 border-blue-500 focus-visible:ring-blue-500"
          />
          {searchText && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchText("")}
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          )}
        </div>
        <Button asChild>
          <Link
            to="/orders/new"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            + New Order
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Table className="border border-gray-200">
          <TableHeader>
            <TableRow>
              {[...Array(7)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <>
          <Table className="border border-gray-200">
            <TableHeader>
              <TableRow className="border-b border-blue-200">
                <TableHead onClick={() => handleSort("id")}>
                  <span className="inline-flex items-center font-bold cursor-pointer">
                    Order ID {renderSortIcon("id")}
                  </span>
                </TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Consultant</TableHead>
                <TableHead className="font-bold">Services</TableHead>
                <TableHead onClick={() => handleSort("creationDate")}>
                  <span className="inline-flex items-center font-bold cursor-pointer">
                    Created On {renderSortIcon("creationDate")}
                  </span>
                </TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="odd:bg-white even:bg-blue-100 hover:bg-gray-100 border-b border-blue-200"
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.customer.firstName} {order.customer.lastName}
                  </TableCell>
                  <TableCell>
                    {order.consultant
                      ? `${order.consultant.firstName} ${order.consultant.lastName}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} title={item.serviceType}>
                          {getServiceIcon(item.serviceType)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.creationDate
                      ? new Date(order.creationDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate(`/orders/${order.id}/edit`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">
              Order Details
            </DialogTitle>
            <DialogDescription>
              Full information about Order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <OrderDetailsModal order={selectedOrder} />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                if (selectedOrder) {
                  navigate(`/orders/${selectedOrder.id}/edit`);
                  setIsDialogOpen(false);
                }
              }}
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

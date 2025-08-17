// src/pages/Customers.tsx

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NewCustomerForm from "@/components/customers/NewCustomerForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { Person } from "@/types/person";
import { getCustomers } from "@/services/personService";
import ArchiveCustomerDialog from "@/components/customers/ArchiveCustomerDialog";
import { ChevronUp, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function Customers() {
  const [customers, setCustomers] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Person | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"id">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 15;
  const navigate = useNavigate();

  // ADDED: State to handle the creation of a new customer
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // Use phoneNumber to be consistent
    address: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCustomers();
        setCustomers(data.filter((c) => !c.archived));
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleSort(field: "id") {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function renderSortIcon(field: "id") {
    const isActive = sortField === field;
    const Icon = sortDirection === "asc" ? ChevronUp : ChevronDown;
    return (
      <Icon
        size={16}
        className={`ml-1 ${isActive ? "text-blue-600" : "text-gray-400"}`}
      />
    );
  }

  async function handleArchive(customerId: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/persons/${customerId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ archived: true }),
        }
      );
      if (!response.ok) throw new Error("Failed to archive customer");
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    } catch (error) {
      console.error("Error archiving customer:", error);
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const search = searchText.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(search) ||
      customer.lastName.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search)
    );
  });

  const paginatedCustomers = [...filteredCustomers]
    .sort((a, b) => (sortDirection === "asc" ? a.id - b.id : b.id - a.id))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex gap-2 items-center">
          <div className="relative w-[280px]">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
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
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate("/archived-customers")}
          >
            Archived Customers
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setShowNewCustomerForm((prev) => !prev);
              setEditingCustomer(null);
              setNewCustomer({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                address: "",
              });
            }}
          >
            {showNewCustomerForm ? "Hide Form" : "New Customer"}
          </Button>
        </div>
      </div>

      {showNewCustomerForm && (
        <div className="mb-6 mt-4 flex justify-center">
          <div className="w-full max-w-xl">
            <NewCustomerForm
              // CHANGED: Logic now correctly passes phoneNumber to the child component
              newCustomer={
                editingCustomer
                  ? {
                      firstName: editingCustomer.firstName,
                      lastName: editingCustomer.lastName,
                      email: editingCustomer.email,
                      phoneNumber: editingCustomer.phoneNumber,
                      address: editingCustomer.address,
                    }
                  : newCustomer
              }
              setNewCustomer={
                editingCustomer
                  ? (updated) =>
                      setEditingCustomer((prev) =>
                        prev ? { ...prev, ...updated } : null
                      )
                  : setNewCustomer
              }
              customerId={editingCustomer?.id}
              showSubmitButton={true}
              onSuccess={(savedCustomer) => {
                const customerWithRole = {
                  ...savedCustomer,
                  personRole: "CUSTOMER" as const,
                };
                if (editingCustomer) {
                  setCustomers((prev) =>
                    prev.map((c) =>
                      c.id === savedCustomer.id ? customerWithRole : c
                    )
                  );
                } else {
                  setCustomers((prev) => [...prev, customerWithRole]);
                }
                setShowNewCustomerForm(false);
                setEditingCustomer(null);
              }}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <Table className="border border-gray-200">
            <TableHeader>
              <TableRow className="border-b border-blue-200">
                <TableHead
                  onClick={() => handleSort("id")}
                  className="font-bold cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    ID {renderSortIcon("id")}
                  </span>
                </TableHead>
                <TableHead className="font-bold">Full Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold text-right pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="odd:bg-white even:bg-blue-100 hover:bg-gray-200 border-b border-blue-200"
                >
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      Customer
                    </Badge>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() =>
                        navigate(`/orders?customerId=${customer.id}`)
                      }
                    >
                      View Orders
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setEditingCustomer(customer);
                        setShowNewCustomerForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <ArchiveCustomerDialog
                      customerId={customer.id}
                      onArchive={handleArchive}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
              { length: Math.ceil(filteredCustomers.length / itemsPerPage) },
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
                    Math.ceil(filteredCustomers.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredCustomers.length / itemsPerPage)
              }
              className="bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import { getArchivedCustomers } from "@/services/personService";
import { API_BASE_URL } from "@/lib/api";

// Page to display only archived customers
export default function ArchivedCustomers() {
  const [customers, setCustomers] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load archived customers on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Call backend API to get only archived customers
        const data = await getArchivedCustomers();

        // Store the result in state
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch archived customers", error);
      } finally {
        // Hide loading state once fetch completes
        setIsLoading(false);
      }
    }

    fetchData(); // Trigger fetch when component mounts
  }, []);

  // Function to restore a customer using PATCH
  async function handleRestore(customerId: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/persons/${customerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ archived: false }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to restore customer");
      }

      // Remove from list after restoring
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    } catch (error) {
      console.error("Error restoring customer:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold">Archived Customers</h1>

      {/* Skeletons while loading */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="odd:bg-white even:bg-blue-100 hover:bg-gray-300"
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

                <TableCell className="flex flex-wrap gap-2">
                  {/* Button to view related orders */}
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

                  {/* Button to restore archived customer */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-700 text-white hover:bg-red-800"
                    onClick={() => handleRestore(customer.id)}
                  >
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

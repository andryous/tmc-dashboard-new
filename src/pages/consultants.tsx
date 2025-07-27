// src/pages/Consultants.tsx (updated with visual styles)

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getConsultants } from "@/services/personService";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function Consultants() {
  const [consultants, setConsultants] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<"id">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getConsultants();
        setConsultants(data);
      } catch (error) {
        console.error("Failed to fetch consultants", error);
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

  const sortedConsultants = [...consultants].sort((a, b) =>
    sortDirection === "asc" ? a.id - b.id : b.id - a.id
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Consultants</h1>

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
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedConsultants.map((consultant) => (
              <TableRow
                key={consultant.id}
                className="odd:bg-white even:bg-blue-100 hover:bg-gray-200 border-b border-blue-200"
              >
                <TableCell>{consultant.id}</TableCell>
                <TableCell>
                  {consultant.firstName} {consultant.lastName}
                </TableCell>
                <TableCell>{consultant.email}</TableCell>
                <TableCell>{consultant.phoneNumber}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800">
                    Consultant
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() =>
                      navigate(`/orders?consultantId=${consultant.id}`)
                    }
                  >
                    View Orders
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

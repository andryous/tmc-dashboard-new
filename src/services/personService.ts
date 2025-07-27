// Import the Person type definition for type safety
import type { Person } from "@/types/person";
import { API_BASE_URL } from "@/lib/api";

// Fetch all persons with role CUSTOMER from the backend
export async function getCustomers(): Promise<Person[]> {
  const response = await fetch(`${API_BASE_URL}/api/persons/by-role/CUSTOMER`);

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return await response.json();
}

// Fetch all persons with role CONSULTANT from the backend
export async function getConsultants(): Promise<Person[]> {
  const response = await fetch(`${API_BASE_URL}/api/persons/by-role/CONSULTANT`);

  if (!response.ok) {
    throw new Error("Failed to fetch consultants");
  }

  return await response.json();
}

// Fetch all archived customers (with role CUSTOMER and archived=true)
export async function getArchivedCustomers(): Promise<Person[]> {
  // Send GET request to new backend endpoint for archived customers
  const response = await fetch(`${API_BASE_URL}/api/persons/by-role/CUSTOMER/archived`);

  // If request fails, throw an error to be caught in the UI
  if (!response.ok) {
    throw new Error("Failed to fetch archived customers");
  }

  // Parse and return the response body as JSON (list of Person objects)
  return await response.json();
}

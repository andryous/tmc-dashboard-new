import type { Person } from "@/types/person";

export function getFullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`.trim();
}
